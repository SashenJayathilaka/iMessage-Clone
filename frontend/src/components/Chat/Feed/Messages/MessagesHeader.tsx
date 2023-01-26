import { formatUsernames } from "@/util/functions";
import { useQuery } from "@apollo/client";
import { Stack, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { ConversationData } from "../../../../util/types";
import ConversationOperations from "../../../../graphql/operations/conversations";

type Props = {
  userId: string;
  conversationId: string;
};

function MessagesHeader({ userId, conversationId }: Props) {
  const router = useRouter();

  const { data, loading } = useQuery<ConversationData, null>(
    ConversationOperations.Queries.conversations
  );

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  /*   if (data?.conversations && !loading && !conversation) {
    router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  } */

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={5}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Button
        display={{ md: "none" }}
        onClick={() =>
          router.replace("?conversationId", "/", {
            shallow: true,
          })
        }
      >
        Back
      </Button>
      {/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />} */}
      {!conversation && !loading && <Text>Conversation Not Found</Text>}
      {conversation && (
        <Stack direction="row">
          <Text color="whiteAlpha.600">To: </Text>
          <Text fontWeight={600}>
            {formatUsernames(conversation.participants, userId)}
          </Text>
        </Stack>
      )}
    </Stack>
  );
}

export default MessagesHeader;
