import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const Get_FRIENDS = gql`
    {
        user {
            id
            name
        }
    }
`;
class Friends extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <Query query={Get_FRIENDS}>
                {({ loading, error, data }) => {
                    console.log(loading, error, data);
                    return null;
                }}
            </Query>
        );
    }
}
export default Friends;
