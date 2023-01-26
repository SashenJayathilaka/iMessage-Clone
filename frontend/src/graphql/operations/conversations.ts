import { gql } from "@apollo/client";

const ConversationFelids = `
  id
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
    latestMessage {
      id
      sender {
        id
        username
      }
    body
    createdAt
    }
  updatedAt
        
`;

export default {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations  {
        ${ConversationFelids}         
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantsIds: [String]!) {
        createConversation(participantsIds: $participantsIds) {
          conversationId
        }
      }
    `,

    deleteConversation: gql`
      mutation DeleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,

    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
    subscription conversationCreated {
      conversationCreated {
        ${ConversationFelids}
      }
    }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversation {
            ${ConversationFelids}
          }
        }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};

/*      conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `, */
