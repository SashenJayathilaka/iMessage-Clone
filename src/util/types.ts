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
  searchUser: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}
