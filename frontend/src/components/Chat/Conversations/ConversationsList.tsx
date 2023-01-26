import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import ConversationOperation from "../../../graphql/operations/conversations";
import ConversationItem from "./ConversationItem";
import ConversationsModal from "./Modal/Modal";

type Props = {
  session: Session;
  conversationData: Array<ConversationPopulated>;
  onViewConversation: (
    ConversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => void;
};

function ConversationsList({
  session,
  conversationData,
  onViewConversation,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConversation] = useMutation<{
    deleteConversation: boolean;
    conversationId: string;
  }>(ConversationOperation.Mutations.deleteConversation);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting Conversation",
          success: "Conversation Deleted",
          error: "Failed to Delete Conversation",
        }
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const sortedConversations = [...conversationData].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      position="relative"
      height="100%"
      overflow="hidden"
    >
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or Start a Conversations
        </Text>
      </Box>
      <ConversationsModal session={session} isOpen={isOpen} onClose={onClose} />
      {sortedConversations.map((conversation) => {
        const participants = conversation.participants.find(
          (p) => p.user.id === userId
        );

        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversationData={conversation}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participants?.hasSeenLatestMessage
              )
            }
            onDeleteConversation={onDeleteConversation}
            hasSeenLatestMessage={participants?.hasSeenLatestMessage}
            isSelected={conversation.id === router.query.conversationId}
          />
        );
      })}
      <Box position="absolute" bottom={0} left={0} width="100%" px={8}>
        <Button width="100%" onClick={() => signOut()}>
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default ConversationsList;
