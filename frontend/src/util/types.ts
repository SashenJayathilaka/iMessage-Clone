import {
  ConversationPopulated,
  MessagePopulated,
} from "../../../backend/src/util/types";

// Users

export interface CreateUserData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUserInput {
  username: string;
}

export interface SearchUserData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}

// Conversation

export interface ConversationData {
  conversations: Array<ConversationPopulated>;
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantsIds: Array<string>;
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    /*     conversation: Omit<ConversationPopulated, "latestMessage"> & {
      latestMessage: MessagePopulated;
    }; */
    conversation: ConversationPopulated;
  };
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  };
}

// Messages

export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSentSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}
