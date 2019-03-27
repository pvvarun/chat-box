const users = [
    {
        id: "user0",
        name: "VARUN",
        email: "varun@gmail.com",
        friend: ["YOGESH"],
        chat: []
    },
    {
        id: "user1",
        name: "YOGESH",
        email: "yogesh@gmail.com",
        friend: ["VARUN"],
        chat: []
    }
];
let userCount = users.length;

const resolvers = {
    Query: {
        users: () => users
    },
    Mutation: {
        addUser: (parent, args) => {
            const user = {
                id: `user${userCount++}`,
                name: args.name,
                email: args.email,
                friend: []
            };
            users.forEach(element => {
                element.friend.push(args.name);
                user.friend.push(element.name);
            });
            users.push(user);
            return user;
        }
    }
};

export default resolvers;
