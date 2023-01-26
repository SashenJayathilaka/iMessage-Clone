import type { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";
import { ISODateString } from "next-auth";

import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";
import { messagePopulated } from "../graphql/resolvers/message";

export type GraphQLContext = {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
};

export type Session = {
  user: User;
  expires: ISODateString;
};

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export type User = {
  id: string;
  username: string;
  image: string;
  email: string;
  emailVerified: boolean;
  name: string;
};

export type CreateUsernameResponse = {
  success?: boolean;
  error?: string;
};

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export type ConversationUpdatedSubscriptionPayload = {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
};

export type ConversationDeletedSubscriptionPayload = {
  conversationDeleted: ConversationPopulated;
};

export type SendMessageArguments = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
};

export type MessageSentSubscriptionPayload = {
  messageSent: MessagePopulated;
};

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
