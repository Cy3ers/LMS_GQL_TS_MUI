import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from "./user-resolvers";
import taskResolvers from "./task-resolvers";

const resolvers = mergeResolvers([userResolvers, taskResolvers]);

export default resolvers;
