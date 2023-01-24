import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Date
  type Mutation {
    createConversation(participantsIds: [String]): CreateConversationResponse
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
    deleteConversation(conversationId: String!): Boolean
  }
  type CreateConversationResponse {
    conversationId: String
  }
  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }
  type Query {
    conversations: [Conversation]
  }
  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }
  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }
  type ConversationDeletedSubscriptionPayload {
    id: String
  }
  type Subscription {
    conversationCreated: Conversation
    conversationUpdated: ConversationUpdatedSubscriptionPayload
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }
`;

export default typeDefs;
