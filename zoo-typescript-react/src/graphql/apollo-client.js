// src/apollo-client.js
import {ApolloClient, InMemoryCache} from '@apollo/client';
import {getConfig} from '../config/config.ts';

let client = null;

export const getApolloClient = async () => {
    if (!client) {
        // Wait for the config to be loaded asynchronously
        const config = await getConfig();
        client = new ApolloClient({
            uri: config.apiUrl,
            cache: new InMemoryCache(),
        });
    }
    return client;
};
