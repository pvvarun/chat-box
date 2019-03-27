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

  // sendData = async openSnackBar => {
  //   const { history } = this.props;
  //   const { emailAddress, name } = this.state;
  //   this.loader();
  //   const apiData = await callApi(
  //     "https://express-training.herokuapp.com/api/user/login",
  //     "post",
  //     { email: emailAddress, name: name }
  //   );
  //   console.log("---------api Data is-------", apiData, apiData.data.data);
  //   this.loader();
  //   localStorage.setItem("token", apiData.data.data);
  //   apiData.data
  //     ? openSnackBar("success", apiData.data.message)
  //     : openSnackBar("error", apiData.message);
  //   history.push("/trainee");
  // };

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
    const { errors } = this.state;
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
              <Link
                color="inherit"
                underline="none"
                component={RouterLink}
                to="/friends"
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
                  // onClick={() => }
                >
                  SIGN IN
                </Button>
              </Link>
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
