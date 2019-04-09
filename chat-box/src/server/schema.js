
import { gql } from 'apollo-server';

const typedef = gql`

scalar Date

type object {
    to: String
    from: String
    msg: String
}

type user {
    id: String
    name: String
    email: String
    friends: [String]
}

type Friends {
    friend_Name_List: [String]
    friend_Id_List: [String]
}

type chats {
    message: String
    sendAt: Date
    from: String
}

type ObjectOfAddFriendMutation{
    id: String
}

type ObjectOfChatWithFriendMutation{
    msg: String
    sendAt: Date
}

type Query {
    user_friends(id: String!): Friends
    chatHandle(to: String!, from: String!): [chats]
}

type Mutation {
    addUser(name: String!, email: String!): ObjectOfAddFriendMutation
    chatWithFriend(to: String!, from: String!, msg: String!): ObjectOfChatWithFriendMutation
}

type Subscription {
    userAdded: Friends
}

`;
export default typedef;