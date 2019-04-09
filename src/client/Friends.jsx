import React, { Component, Fragment } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import People from "@material-ui/icons/People";
// import { Link as RouterLink } from "react-router-dom";
// import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const Get_FRIENDS = gql`
    query user_friends($id: String!) {
    user_friends(id: $id) {
        friend_Name_List
        friend_Id_List
    }
}
`;
const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    }
});
class Friends extends Component {
    constructor(props) {
        super(props);
    }

    chatWithFriend = (nameOfFriendSelected, friendSelectedIndex, data) => {
        const idOfFriendSelected = data.user_friends.friend_Id_List[friendSelectedIndex];
        console.log('----------friend selected for chat is-----------', nameOfFriendSelected, idOfFriendSelected);
        const { history } = this.props;
        localStorage.setItem("idOfFriendSelected", idOfFriendSelected);
        localStorage.setItem("nameOfFriendSelected", nameOfFriendSelected);
        history.push(`/chat/`);
    }

    render() {
        let t = 0;
        const { classes } = this.props;
        const idOfLoginUser = localStorage.getItem("idOfLoginUser");
        console.log(
            "-----------id of the login user---------",
            idOfLoginUser
        );
        return (
            <Query query={Get_FRIENDS} variables={{ id: idOfLoginUser }}>
                {({ data, loading, error }) => {
                    console.log("---------data is-------------", data);
                    if (loading) {
                        console.log("loading------------------");
                        return <h1>Loading</h1>;
                    }
                    if (error) return <h1>Error</h1>;
                    console.log("---------data in Query of friend.jsx is-------------", data);
                    return (
                        <div>
                            <h1>Friend list</h1>
                            {data.user_friends.friend_Name_List.map((currentValue, index)  => (
                                <div className={classes.root}>
                                    <List>
                                        <ListItem 
                                        button
                                        onClick={() => this.chatWithFriend(currentValue, index, data)}
                                        >
                                            <ListItemIcon>
                                                <People />
                                            </ListItemIcon>
                                            <ListItemText primary={currentValue} />
                                        </ListItem>
                                    </List>
                                </div>
                            ))}
                        </div>
                    );
                }}
            </Query>
        );
    }
}
export default withStyles(styles)(Friends);
