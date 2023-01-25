import { SearchUserData, SearchUserInput } from "@/util/types";
import { useLazyQuery } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";

import UserOperation from "../../../../graphql/operations/user";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function ConversationsModal({ isOpen, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUserData,
    SearchUserInput
  >(UserOperation.Queries.searchUsers);

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
  };

  // console.log(data, error);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4} textColor="#fff">
          <ModalHeader color="#fff">Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  color="#fff"
                  placeholder="Enter a Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  color="#000"
                  type="submit"
                  disabled={!username}
                  onClick={onSearch}
                >
                  Search
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConversationsModal;
