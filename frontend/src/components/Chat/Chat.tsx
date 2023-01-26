import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";

import ConversationsWrapper from "./Conversations/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

type Props = {
  session: Session;
};

function Chat({ session }: Props) {
  return (
    <Flex height="100vh">
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
}

export default Chat;
