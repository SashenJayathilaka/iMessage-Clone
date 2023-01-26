import { Flex, Stack, Text, Image } from "@chakra-ui/react";
import React from "react";
import { BiMessageSquareDots } from "react-icons/bi";
import { useQuery } from "@apollo/client";

import ConversationOperation from "../../../graphql/operations/conversations";
import { ConversationData } from "../../../util/types";

type Props = {};

function NoConversationSelected({}: Props) {
  const { data, loading, error } = useQuery<ConversationData, null>(
    ConversationOperation.Queries.conversations
  );

  if (!data?.conversations || loading || error) return null;

  const { conversations } = data;

  const hasConversations = conversations.length;

  const text = hasConversations
    ? "Select a Conversation"
    : "Let's Get Started 🥳";
  return (
    <Flex height="100%" justify="center" align="center">
      <Stack spacing={10} align="center">
        <Text fontSize={40}>{text}</Text>
        <BiMessageSquareDots fontSize={90} />
        {/*         <Image
          alignItems="center"
          height="300px"
          src="https://media0.giphy.com/media/MC4HbutDfAePcTeBye/giphy.gif?cid=6c09b952hpt05ykl72aqb1qvdvwqgeprk43nfy0r3n5b8efi&rid=giphy.gif&ct=s"
        /> */}
      </Stack>
    </Flex>
  );
}

export default NoConversationSelected;
