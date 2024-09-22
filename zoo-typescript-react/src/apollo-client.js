// src/apollo-client.js
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:82/graphql/graphql', // Replace with your GraphQL server URL
    cache: new InMemoryCache(),
});

export default client;
