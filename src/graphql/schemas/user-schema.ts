const userSchema = `
  type User {
    id: ID!
    username: String!
    password: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    me: User
  }

  type Mutation {
    register(username: String!, password: String!, role: String!): User!
    login(username: String!, password: String!): AuthPayload!
    changePassword(currentPassword: String!, newPassword: String!, confirmPassword: String!): Boolean!
    deleteUser(id: ID!): Boolean!
  }
`;

export default userSchema;
