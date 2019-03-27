
import { gql } from 'apollo-server';

const typedef = gql`
type user {
    id: String
    name: String
    email: String
    friend: [String]
    chat: [object]
}

type object {
    to: String,
    from: String,
    message: String,
}

type Query {
    users: [user]
}
type Mutation {
    addUser(name: String!, email: String!): user
}
`;
export default typedef;