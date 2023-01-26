import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

import SkeletonLoader from "../../../../components/common/SkeletonLoader";
import MessageOptions from "../../../../graphql/operations/message";
import {
  MessagesData,
  MessageSentSubscriptionData,
  MessagesVariables,
} from "../../../../util/types";
import MessageItems from "./MessageItems";

type Props = {
  userId: string;
  conversationId: string;
};

function Messages({ userId, conversationId }: Props) {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOptions.Queries.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const subscribeToMoreMessages = (conversationId: string) => {
    subscribeToMore({
      document: MessageOptions.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (
        prev,
        { subscriptionData }: MessageSentSubscriptionData
      ) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToMoreMessages(conversationId);
  }, [conversationId]);

  if (error) {
    return null;
  }

  // console.log(data);

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={7} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflow="scroll" height="100%">
          {data.messages.map((message) => (
            <MessageItems
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
}

export default Messages;
