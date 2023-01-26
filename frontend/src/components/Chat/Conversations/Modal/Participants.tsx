import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { SearchedUser } from "../../../../util/types";

type Props = {
  participants: Array<SearchedUser>;
  removeParticipants: (userId: string) => void;
};

function Participants({ participants, removeParticipants }: Props) {
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map((participant) => (
        <Stack
          key={participant.id}
          direction="row"
          align="center"
          bg="whiteAlpha.200"
          borderRadius={4}
          p={2}
        >
          <Text>{participant.username}</Text>
          <AiOutlineCloseCircle
            size={20}
            cursor="pointer"
            onClick={() => removeParticipants(participant.id)}
          />
        </Stack>
      ))}
    </Flex>
  );
}

export default Participants;
