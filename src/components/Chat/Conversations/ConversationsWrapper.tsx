import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import ConversationsList from "./ConversationsList";

type Props = {
  session: Session;
};

function ConversationsWrapper({ session }: Props) {
  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      {/*  loader */}
      <ConversationsList session={session} />
    </Box>
  );
}

export default ConversationsWrapper;
