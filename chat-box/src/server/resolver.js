import{ GraphQLScalarType} from 'graphql';
import { PubSub } from 'apollo-server';

const pubsub = new PubSub();

let users = [
    {
        id: "user0",
        name: "VARUN",
        email: "varun@successive.tech",
        friends: ["user1"],
    },
    {
        id: "user1",
        name: "YOGESH",
        email: "yogesh@successive.tech",
        friends: ["user0"],
    }
];

let messages = [];

let userCount = users.length;

const resolvers = {

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value; // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    }),

    Subscription: {
        userAdded: {
          // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([USER_ADDED]),
        },
    },

    Query: {
        user_friends: (root, { id }, context) => {
            // console.log('------id of user is ------', id);
            let friendsId, friendsName = [];
            users.forEach(element => {
                if (element.id === id) {
                    friendsId = element.friends;
                }
                else{
                    friendsName.push(element.name);
                }
            }
            );
            // console.log('-----------------------', friendsName, friendsId);
            friendsName = (friendsId) ? friendsName : [];
            // console.log('friends', friendsName, friendsId);
            return ({friend_Name_List: friendsName, friend_Id_List: friendsId});
        },
        chatHandle: ( root, { to, from }, context) => {
            let arrayOfChats = [];
            // console.log('users--', users);
            // messages.forEach(element => {
            //     if((element.to === to && element.from === from)|| (element.to === from && element.from === to)) {
            //         array.push({
            //             chat: {...element.messagesBetweenFriends},
            //             sentBy: element.from,
            //         });
            //     }
            // })
            //     console.log("-----array is-----", array);
            //     array.forEach(value => {
            //         arrayOfChats.push({message: value.chat.message,  sendAt: value.chat.sendAt, from: value.sentBy})
            //     })
            //     console.log('array of chats is--------', arrayOfChats);
            //     return arrayOfChats;
            // }
            let chatsByUser1 = messages.find(element => element.to === to && element.from === from);
            let chatsByUser2 = messages.find(element => element.to === from && element.from === to);
            if(chatsByUser1) {
                chatsByUser1.messagesBetweenFriends.forEach(element => 
                    {element.from = chatsByUser1.from
                arrayOfChats.push(element);
                    })
                // console.log('--------arrayOfChats---------', arrayOfChats);
            }
            if(chatsByUser2){ 
                chatsByUser2.messagesBetweenFriends.forEach(element => 
                    {element.from = chatsByUser2.from
                    arrayOfChats.push(element);                    
                    })
                // console.log('--------arrayOfChats---------', arrayOfChats);            
            }
            // console.log('--------modified array1---------', chatsByUser1);
            // console.log('--------modified array2---------', chatsByUser2);
            console.log('--------arrayOfChats1---------', arrayOfChats);
            arrayOfChats.sort((a, b) => {
                return new Date(a.sendAt) - new Date(b.sendAt);
                });
            console.log('--------arrayOfChats2---------', arrayOfChats);
            return arrayOfChats;
        }
    },
    Mutation: {
        addUser: (root, { name, email }, context) => {
            // console.log('name--', name);
            // console.log('email--', email);
            const newUser = {
                id: `user${userCount++}`,
                name: name,
                email: email,
                friends: [],
            };
            users.forEach(element => {
                element.friends.push(newUser.id);
                newUser.friends.push(element.id);
            });
            users.push(newUser);
            // console.log('-----new user details are------', newUser);
            // console.log('-----new user unique id is------', newUser.id);
            pubsub.publish(USER_ADDED, { userAdded: { name, email } });
            return {id: newUser.id};
        },
        chatWithFriend: (parent, { to, from, msg }, context) => {
            let flag = true;
            let date = new Date();
            console.log('----date-----', date);
            // console.log('-----from------', from);
            // console.log('-----message------', msg);
            messages.forEach(element => {
                if(element.to === to && element.from === from) {
                    element.messagesBetweenFriends.push({message: msg, sendAt: date});
                    flag = false;
                    // console.log('---------HURRAY--------');
                }
            });
            if (flag){
                messages.push({to: to, from: from, messagesBetweenFriends: [{message: msg, sendAt: date}]})
            }
            console.log('---MESSAGES----', messages);
            return {msg,  Date: date};
        }
    }
};

export default resolvers;
