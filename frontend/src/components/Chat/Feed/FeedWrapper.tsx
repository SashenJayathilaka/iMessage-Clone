import { Flex, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { text } from "stream/consumers";
import { BiMessageSquareDots } from "react-icons/bi";

import MessageInput from "./Messages/Input";
import Messages from "./Messages/Messages";
import MessagesHeader from "./Messages/MessagesHeader";
import NoConversationSelected from "./NoConversationSelected";

type Props = {
  session: Session;
};

function FeedWrapper({ session }: Props) {
  const router = useRouter();
  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flex={1}
          >
            <MessagesHeader userId={userId} conversationId={conversationId} />
            <Messages userId={userId} conversationId={conversationId} />
          </Flex>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <NoConversationSelected />
      )}
    </Flex>
  );
}

export default FeedWrapper;
