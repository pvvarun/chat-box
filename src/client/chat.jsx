import React, { Component } from "react";
import gql from "graphql-tag";
import { Query, Mutation, ApolloConsumer } from "react-apollo";
import Send from "@material-ui/icons/Send";
import * as moment from "moment";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
// import Grey from "@material-ui/core/colors/grey";

const CHAT_WITH_FRIEND = gql`
  mutation chatWithFriend($to: String!, $from: String!, $msg: String!) {
    chatWithFriend(to: $to, from: $from, msg: $msg) {
      msg
    }
  }
`;

const CHAT_HANDLE = gql`
  query chatHandle($to: String!, $from: String!) {
    chatHandle(to: $to, from: $from) {
      message
      from
      sendAt
    }
  }
`;

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    textField2: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
        color: "gray"
    },
    divOfTextField: {
        marginTop: "400px"
    },
    pointer: {
        cursor: "pointer"
    },
    header: {
        backgroundColor: 'blue',
        color: 'white',
        textAlign: "center",
    },
    right: {
        textAlign: "right",
        color: 'black',
    },
    textFieldOfQuery: {
        backgroundColor: "lightBlue"
    }
});

const nameOfFriendSelected = localStorage.getItem("nameOfFriendSelected");
const idOfFriendSelected = localStorage.getItem("idOfFriendSelected");
const nameOfLoginUser = localStorage.getItem("nameOfLoginUser");
const idOfLoginUser = localStorage.getItem("idOfLoginUser");

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        };
    }

    handleChange = event => {
        this.setState({ message: event.target.value });
        // console.log("---------------------event value-----------", this.state);
    };

    resetState = () => {
        this.setState({ message: "" });
    };

    chatDetail = (chatWithFriend, { to, from, msg }) => {
        console.log("-to-", to, "-from-", from, "-message", msg);
        chatWithFriend({ variables: { to, from, msg } })
            .then(({ data }) => {
                console.log(
                    "data obtained from mutation of chat.jsx---------- ",
                    data.chatWithFriend.msg
                );
            })
            .catch(error => {
                console.log("--------errors inside chat.jsx------", error);
            });
    };

    render() {
        let position;
        const { classes } = this.props;
        const { message } = this.state;
        console.log("Rendered ::::::::::");
        return (
            <div>
                <h1 className={classes.header}>You are now connected to {nameOfFriendSelected}</h1>
                <Query
                    fetchPolicy="none"
                    query={CHAT_HANDLE}
                    variables={{ to: idOfFriendSelected, from: idOfLoginUser }}
                >
                    {({ data, loading, error }) => {
                        if (loading) console.log("loading");
                        if (error) return <p>ERROR</p>;
                        if (data.chatHandle) {
                            console.log("data obtained from query of chat is", data);
                            return data.chatHandle.map(element => {
                                position = (element.from === idOfLoginUser) ? 'right' : 'left';
                                console.log('---------position is ', position, );
                                return (
                                <div 
                                className={classes[position]}
                                >
                                    <TextField
                                        disabled
                                        defaultValue={element.message}
                                        className={classes.textFieldOfQuery}
                                        margin="normal"
                                        variant="outlined"
                                        label={position === 'right' ? nameOfLoginUser : nameOfFriendSelected}
                                        multiline
                                    />
                                    <div>{moment(element.sendAt).fromNow()}</div>
                                </div>
                            )});
                        }
                        return null;
                    }}
                </Query>
                <div className={classes.divOfTextField}>
                    <Mutation mutation={CHAT_WITH_FRIEND}>
                        {(chatWithFriend, { data, loading, error }) => (
                            <TextField
                                onChange={this.handleChange}
                                fullWidth
                                id="standard-with-placeholder"
                                placeholder={`Say Hello to ${nameOfFriendSelected}`}
                                className={classes.textField}
                                margin="normal"
                                value={message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Send
                                                className={classes.pointer}
                                                onClick={() => {
                                                    this.chatDetail(chatWithFriend, {
                                                        to: idOfFriendSelected,
                                                        from: idOfLoginUser,
                                                        msg: message
                                                    });
                                                    this.resetState();
                                                    // this.runQuery();
                                                }}
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                    </Mutation>
                </div>
            </div>
        );
    }
}
export default withStyles(styles)(Chat);
