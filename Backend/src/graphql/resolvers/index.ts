import merge from "lodash.merge";

import userResolvers from "./user";

const resolvers = merge({}, userResolvers);

export default resolvers;
