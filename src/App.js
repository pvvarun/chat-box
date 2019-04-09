import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Friends, Chat } from "./client";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";
import { WebSocketLink } from 'apollo-link-ws';

const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/`,
  options: {
    reconnect: true
  }
});


const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/'
})
const client = new ApolloClient({
  cache,
  link
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/friends/" component={Friends} />
            <Route exact path="/chat/" component={Chat} />
          </Switch>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
