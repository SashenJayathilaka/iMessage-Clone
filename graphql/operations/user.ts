import { gql } from "@apollo/client";

export default {
  Queries: {},
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: string!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
};
