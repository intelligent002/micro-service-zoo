import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'node-fetch';

// Set up the HTTP link and force POST requests
const httpLink = new HttpLink({
    uri: 'http://localhost:8001/graphql', // Replace with your GraphQL API endpoint
    fetch,
    method: 'POST', // Ensure POST requests
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default client;
