import userSchema from "./user-schema";
import taskSchema from "./task-schema";

const typeDefs = `
  ${userSchema}
  ${taskSchema}
`;

export default typeDefs;
