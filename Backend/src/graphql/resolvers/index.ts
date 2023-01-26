import merge from "lodash.merge";

import conversationResolvers from "./conversation";
import messageResolvers from "./message";
import userResolvers from "./user";
import scalarResolvers from "./scalars";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers,
  scalarResolvers
);

export default resolvers;
