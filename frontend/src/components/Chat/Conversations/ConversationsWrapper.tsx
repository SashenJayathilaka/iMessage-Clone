import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import SkeletonLoader from "../../../components/common/SkeletonLoader";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "../../../../../backend/src/util/types";
import ConversationOperation from "../../../graphql/operations/conversations";
import {
  ConversationData,
  ConversationDeletedData,
  ConversationUpdatedData,
} from "../../../util/types";
import ConversationsList from "./ConversationsList";

type Props = {
  session: Session;
};

function ConversationsWrapper({ session }: Props) {
  const router = useRouter();
  const {
    query: { conversationId },
  } = router;
  const {
    user: { id: userId },
  } = session;
  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationData, null>(
    ConversationOperation.Queries.conversations
  );

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperation.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData, null>(
    ConversationOperation.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;

        const currentlyViewingConversation =
          updatedConversation.id === conversationId;

        if (currentlyViewingConversation) {
          onViewConversation(conversationId, false);
        }
      },
    }
  );

  useSubscription<ConversationDeletedData, null>(
    ConversationOperation.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationData>({
          query: ConversationOperation.Queries.conversations,
        });

        if (!existing) return;

        const { conversations } = existing;

        const {
          conversationDeleted: { id: deleteConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationData>({
          query: ConversationOperation.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deleteConversationId
            ),
          },
        });

        router.push("/");
      },
    }
  );

  // console.log(conversationData, "conversationData");

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => {
    // Push

    router.push({ query: { conversationId } });

    if (hasSeenLatestMessage) return;
    // Mark conversation Read mutation
    try {
      if (session?.user) {
        await markConversationAsRead({
          variables: {
            conversationId: conversationId,
            userId: userId,
          },
          optimisticResponse: {
            markConversationAsRead: true,
          },
          update: (cache) => {
            const participantsFragment = cache.readFragment<{
              participants: Array<ParticipantPopulated>;
            }>({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment Participants on Conversation {
                  participants {
                    user {
                      id
                      username
                    }
                    hasSeenLatestMessage
                  }
                }
              `,
            });
            if (!participantsFragment) return;

            const participants = [...participantsFragment.participants];

            const userParticipantIdx = participants.findIndex(
              (p) => p.user.id === session?.user?.id
            );

            if (userParticipantIdx === -1) return;

            const userParticipant = participants[userParticipantIdx];

            participants[userParticipantIdx] = {
              ...userParticipant,
              hasSeenLatestMessage: true,
            };

            cache.writeFragment({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment UpdateParticipant on Conversation {
                  participants
                }
              `,
              data: {
                participants,
              },
            });
          },
        });
      }
    } catch (error: any) {
      console.log("onViewConversation error:", error?.message);
    }
  };

  const subscribeToMoreConversation = () => {
    subscribeToMore({
      document: ConversationOperation.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        // console.log("subscriptionData", subscriptionData);

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToMoreConversation();
  }, []);

  return (
    <Box
      width={{ base: "100%", md: "430px" }}
      bg="whiteAlpha.50"
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
    >
      {conversationLoading ? (
        <SkeletonLoader count={8} height="80px" />
      ) : (
        <ConversationsList
          session={session}
          conversationData={conversationData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
}

export default ConversationsWrapper;
