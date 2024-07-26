const taskSchema = `
  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    priority: String!
    userId: ID!
  }

  type Notification {
    message: String!
  }

  type Query {
    tasks: [Task!]!
  }

  type Mutation {
    createTask(title: String!, description: String!, status: String!, priority: String!): Task!
    updateTask(id: ID!, title: String, description: String, status: String, priority: String): Task!
    deleteTask(id: ID!): Boolean!
  }

  type Subscription {
    taskAdded: Notification!
  }
`;

export default taskSchema;
