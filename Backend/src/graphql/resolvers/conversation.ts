import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";

import { userIsConversationParticipant } from "../../util/functions";
import {
  ConversationDeletedSubscriptionPayload,
  ConversationPopulated,
  ConversationUpdatedSubscriptionPayload,
  GraphQLContext,
} from "../../util/types";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { prisma, session } = context;
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }
      const {
        user: { id: userId },
      } = session;

      try {
        const conversations = await prisma.conversation.findMany({
          include: conversationPopulated,
        });
        return conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === userId)
        );
      } catch (error: any) {
        console.log("conversations error:", error);
        throw new GraphQLError(error?.messages);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantsIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { participantsIds } = args;
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantsIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id == userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });
        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });
        return {
          conversationId: conversation.id,
        };
      } catch (error: any) {
        console.error("createConversation error: ", error);
        throw new GraphQLError("Error Creating Conversation");
      }
    },
    markConversationAsRead: async (
      _: any,
      args: { userId: string; conversationId: string },
      context: GraphQLContext
    ) => {
      const { session, prisma } = context;
      const { userId, conversationId } = args;
      if (!session?.user) throw new GraphQLError("Not authorized");
      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });
        if (!participant)
          throw new GraphQLError("Participant entity not found");
        await prisma.conversationParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });
        return true;
      } catch (error: any) {
        console.log("makeConversationAsRead error:", error);
        throw new GraphQLError(error?.message);
      }
    },
    deleteConversation: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = context;

      const { conversationId } = args;

      if (!session?.user) throw new GraphQLError("Not authorized");

      try {
        const [deletedConversation] = await prisma.$transaction([
          prisma.conversation.delete({
            where: {
              id: conversationId,
            },
            include: conversationPopulated,
          }),
          prisma.conversationParticipant.deleteMany({
            where: {
              conversationId,
            },
          }),
          prisma.message.deleteMany({
            where: {
              conversationId,
            },
          }),
        ]);
        pubsub.publish("CONVERSATION_DELETED", {
          conversationDeleted: deletedConversation,
        });
      } catch (error: any) {
        console.log("deleteConversation error:", error);
        throw new GraphQLError("Failed to delete conversation");
      }

      return true;
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: ConversationCreateSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) throw new GraphQLError("Not authorized");
          const {
            conversationCreated: { participants },
          } = payload;

          const userIsParticipant = userIsConversationParticipant(
            participants,
            session?.user?.id
          );
          return userIsParticipant;
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
        },
        (
          payload: ConversationUpdatedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) throw new GraphQLError("Not authorized");

          const { id: userId } = session.user;
          const {
            conversationUpdated: { conversation },
          } = payload;
          return userIsConversationParticipant(
            conversation.participants,
            userId
          );
        }
      ),
    },
    conversationDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_DELETED"]);
        },
        (
          payload: ConversationDeletedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;
          if (!session?.user) throw new GraphQLError("Not authorized");

          const {
            user: { id: userId },
          } = session;

          const {
            conversationDeleted: { participants },
          } = payload;

          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
  },
};

export type ConversationCreateSubscriptionPayload = {
  conversationCreated: ConversationPopulated;
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default resolvers;
