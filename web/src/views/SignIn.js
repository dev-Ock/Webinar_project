import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {styles} from "./styles/SignInStyles.js";
import {inject, observer} from "mobx-react";

import {Button, CircularProgress, Container, InputAdornment, TextField, Typography} from "@material-ui/core";

import {ReactComponent as UserIcon} from "../common/images/UserIcon.svg";
import {ReactComponent as KeyIcon} from "../common/images/KeyIcon.svg";

import * as store from "../stores/AuthStore";


function Copyright(props) {
    return (
        <Typography variant="body2" color="primary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="../components#">
                Nani's Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


class SignIn extends React.Component {
    handleChangeId = (e) => {
        this.props.authStore.changeLoginId(e.target.value);
    }
    
    handleChangePassword = (e) => {
        this.props.authStore.changeLoginPassword(e.target.value);
    }
    
    handleKeyUpPassword = (e) => {
        if (e.keyCode === 13) {
            if (!this.props.authStore.login.id) {
                return alert("ID를 입력해주세요.")
            }
            if (!this.props.authStore.login.password) {
                return alert("Password를 입력해주세요.")
            }
            this.props.authStore.doLogin();
        }
    }
    
    handleSubmitForm = (e) => {
        if (!this.props.authStore.login.id) {
            return alert("ID를 입력해주세요.")
        }
        if (!this.props.authStore.login.password) {
            return alert("Password를 입력해주세요.")
        }
        this.props.authStore.doLogin();
    }
    
    onSetSignupOpen = () => {
        this.props.setSignupOpen(!this.props.signupOpen)
    }
    
    
    render() {
        const {classes, setSignupOpen} = this.props;
        const {loginState, login} = this.props.authStore;
        
        return (
            <div className={classes.root}>
                <Container component="main" maxWidth="sm">
                    {/*<div className={classes.appBarSpacer} />*/}
                    <div className={classes.paper}>
                        {/*<Avatar className={classes.lockOutAvatar}><LockOutlinedIcon/></Avatar>*/}
                        <Typography component="h1" variant="h5" className={classes.titleStyle}>
                            Login
                        </Typography>
                        <div className={classes.form}>
                            <TextField id="id"
                                       name="id"
                                       label="ID"
                                       variant="outlined"
                                       margin="normal"
                                       value={login.id}
                                       onChange={this.handleChangeId}
                                       className={classes.inputStyle}
                                       InputProps={{
                                           startAdornment: (
                                               <InputAdornment position="start">
                                                   <UserIcon/>
                                               </InputAdornment>
                                           ),
                                       }}
                                       required fullWidth/>
                            <TextField id="password"
                                       name="password"
                                       label="Password"
                                       type="password"
                                       variant="outlined"
                                       margin="normal"
                                       value={login.password}
                                       onChange={this.handleChangePassword}
                                       onKeyUp={this.handleKeyUpPassword}
                                       className={classes.inputStyle}
                                       InputProps={{
                                           startAdornment: (
                                               <InputAdornment position="start">
                                                   <KeyIcon/>
                                               </InputAdornment>
                                           ),
                                       }}
                                       required fullWidth/>
                            <Button type="submit"
                                    className={classes.submit}
                                // color="primary"
                                    variant="contained"
                                    disabled={loginState === store.State.Pending}
                                    onClick={this.handleSubmitForm}
                                    disableRipple
                                    fullWidth>
                                {loginState === store.State.Pending ? <CircularProgress size={22}/> : 'Sign In'}
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Button style={{cursor: "pointer", backgroundColor: "lightyellow"}}
                                            onClick={this.onSetSignupOpen}>
                                        Don't have an account? Sign Up
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <Copyright sx={{mt: 5}} style={{marginTop: '20px'}}/>
                </Container>
            </div>
        );
    }
}

export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('authStore')(
                observer(SignIn)
            )
        )
    )
);