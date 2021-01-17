import React from 'react';
import App from './App'
import {setContext} from 'apollo-link-context'
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ApolloProvider,
    Int
} from '@apollo/client'
const authLink = setContext(()=> {
    const token = localStorage.getItem('jwtToken')
    return {
        headers:{
            Authorization:token ? `Bearer ${token}`:''
        }
    }
})

const httpLink = createHttpLink({
    uri:'https://mysterious-bastion-10479.herokuapp.com/'
})

const client = new ApolloClient({
    link:authLink.concat(httpLink),
    cache:new InMemoryCache()
})



export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);