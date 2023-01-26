import { MessagesData } from "@/util/types";
import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { ObjectID } from "bson";
import { Session } from "next-auth";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { SendMessageArguments } from "../../../../../../backend/src/util/types";
import MessageOPrations from "../../../../graphql/operations/message";

type Props = {
  session: Session;
  conversationId: string;
};

function MessageInput({ session, conversationId }: Props) {
  const [messageBody, setMessageBody] = useState("");
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageArguments
  >(MessageOPrations.Mutations.sendMessage);

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { id: senderId } = session.user;
      const messageId = new ObjectID().toString();

      const newMessage: SendMessageArguments = {
        id: messageId,
        conversationId: conversationId,
        senderId: senderId,
        body: messageBody,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cash) => {
          const existing = cash.readQuery<MessagesData>({
            query: MessageOPrations.Queries.messages,
            variables: { conversationId },
          }) as MessagesData;

          cash.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOPrations.Queries.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId: conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing?.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Failed to send Message");
      }

      setMessageBody("");
    } catch (error: any) {
      console.log(error?.message, "call message error");
      toast.error(error?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100">
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          size="md"
          placeholder="New Message"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
        />
      </form>
    </Box>
  );
}

export default MessageInput;
