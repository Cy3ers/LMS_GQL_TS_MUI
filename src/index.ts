import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import typeDefs from "./graphql/schemas";
import resolvers from "./graphql/resolvers";
import { getUserFromToken, Context } from "./context/auth-context";
import cors from "cors";
import { applyMiddleware } from "graphql-middleware";
import requireRole from "./middleware/authMiddleware";
import { roles } from "./constants/roles";

dotenv.config();

const port = process.env.PORT || 4000;

// Apply middleware to specific resolvers
const permissions = {
  Query: {
    users: requireRole(roles.ADMIN)
  },
  Mutation: {
    register: requireRole(roles.ADMIN),
    deleteUser: requireRole(roles.ADMIN),
    createTask: requireRole(roles.ADMIN),
    updateTask: requireRole(roles.ADMIN),
    deleteTask: requireRole(roles.ADMIN)
  }
};

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, permissions);

const startServer = async () => {
  // Create an Express application
  const app = express();
  app.use(cors());

  // Create an HTTP server
  const httpServer = createServer(app);

  // Create a WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql"
  });

  // Set up WebSocket server with GraphQL
  const serverCleanup = useServer(
    {
      schema: schemaWithMiddleware,
      context: async (ctx) => {
        const token = (ctx.connectionParams?.authorization || "") as string;
        const user = await getUserFromToken(token);
        return { user };
      }
    },
    wsServer
  );

  // Create Apollo Server instance
  const server = new ApolloServer<Context>({
    schema: schemaWithMiddleware,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }
    ]
  });

  await sequelize.sync();
  console.log("Models synchronized successfully.");

  await server.start();

  // Apply Apollo Server middleware to Express app
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const user = await getUserFromToken(token);
        return { user };
      }
    })
  );

  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
};

startServer().catch((err) => {
  console.error("Unable to start the server:", err);
});
