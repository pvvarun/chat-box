/* eslint-disable react/jsx-indent-props */
import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Link as RouterLink } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
import Lock from "@material-ui/icons/LockOutlined";
import { TraineeLoginSchema } from "../config/constants";
import { Mutation, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  },
  root: {
    width: 400,
    ...theme.mixins.gutters(),
    display: "block",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: "auto"
  },
  textField: {
    paddingRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  align: {
    display: "block",
    margin: "auto",
    textAlign: "center"
  }
});

const LOGIN_USER = gql`
  mutation addUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
    }
  }
`;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: "",
      name: "",
      disableButton: false,
      loading: false,
      errors: {},
      touch: {}
    };
  }

  addingTheUser = (name, emailAddress, addUser) => {
    console.log("---------user info------------", name, emailAddress);
    localStorage.setItem("nameOfLoginUser", name);
    addUser({ variables: { name: name, email: emailAddress } })
      .then(({ data }) => {
        console.log('data obtained from mutation of Login.jsx is----------', data.addUser);
        localStorage.setItem("idOfLoginUser", data.addUser.id)
      })
      .catch(({ error }) => {
        console.log("--------errors are------", error);
      });
  };

  handleBlur = field => () => {
    const { touch } = this.state;
    touch[field] = true;
    this.setState(
      {
        touch
      },
      () => this.handleValidate()
    );
  };

  loader = () => {
    this.setState(prevState => ({
      disableButton: !prevState.disableButton,
      loading: !prevState.loading
    }));
  };

  handleValidate = () => {
    const parsedErrors = {};
    const { emailAddress, name } = this.state;

    TraineeLoginSchema.validate(
      {
        emailAddress,
        name
      },
      { abortEarly: false }
    )
      .then(() => {
        this.setState({
          errors: parsedErrors
        });
      })
      .catch(errors => {
        // console.log('forEach for catch errors ', errors);
        // const { inner = [] } = errors;
        // if (inner.length) {
        //   parsedErrors[inner[0].path] = inner[0].message;
        // }
        errors.inner.forEach(error => {
          // console.log('forEach for catch errors.inner field ', error);
          parsedErrors[error.path] = error.message;
        });
        // console.log(parsedErrors, 'parsed error value is ');
        this.setState({
          errors: parsedErrors
        });
      });
  };

  getError = field => {
    const { errors, touch } = this.state;
    if (!touch[field]) {
      return null;
    }
    return errors[field] || "";
  };

  hasErrors = () => {
    const { errors } = this.state;
    return Object.keys(errors).length !== 0;
  };

  isTouched = () => {
    const { touch } = this.state;
    return Object.keys(touch).length !== 0;
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { errors, name, emailAddress } = this.state;
    return (
      <div>
        <Paper className={classes.root} elevation={2}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <div className={classes.align}>
                <Lock
                  position="right"
                  className={classes.avatar}
                  square={false}
                />
              </div>
              <div className={classes.align}>
                <h1 position="right">Login</h1>
              </div>
              <TextField
                fullWidth
                helperText={this.getError("name") ? errors.name : ""}
                onChange={this.handleChange("name")}
                onBlur={this.handleBlur("name")}
                error={this.getError("name")}
                required
                id="outlined-name"
                label="Name"
                defaultValue=""
                className={classes.textField}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                helperText={
                  this.getError("emailAddress") ? errors.emailAddress : ""
                }
                onChange={this.handleChange("emailAddress")}
                onBlur={this.handleBlur("emailAddress")}
                error={this.getError("emailAddress")}
                fullWidth
                required
                id="outlined-name"
                label="EmailAddress"
                defaultValue=""
                className={classes.textField}
                margin="auto"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Mutation mutation={LOGIN_USER}>
                {(addUser, { data, loading, error }) => (
                  <Link
                    color="inherit"
                    underline="none"
                    component={RouterLink}
                    to={`/friends/`}
                  >
                    <Button
                      style={{ marginTop: "10px" }}
                      fullWidth
                      color="primary"
                      variant="outlined"
                      disabled={
                        this.hasErrors() ||
                        !this.isTouched() ||
                        this.state.disableButton
                      }
                      onClick={() => this.addingTheUser(name, emailAddress, addUser)}
                    >
                      SIGN IN
                    </Button>
                  </Link>
                )}
              </Mutation>
            </Grid>
          </Grid>
        </Paper>
        <div className={classes.align}>
          <spam>&copy;</spam>
          Successive Technologies
        </div>
      </div>
    );
  }
}
Login.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Login);
