import resolvers from "./resolver";
import typeDefs from "./schema";
import { ApolloServer } from "apollo-server";
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 6000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
