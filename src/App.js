import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { Login } from "./client";
import { Friends } from "./client";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/friends" component={Friends} />
          </Switch>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
