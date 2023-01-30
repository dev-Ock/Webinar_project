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
                Ock's Website
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
        if(e.keyCode === 13) {
            this.props.authStore.doLogin();
        }
    }

    handleSubmitForm = (e) => {
        this.props.authStore.doLogin();
    }
    
    onSetSignupOpen = () => {
        this.props.setSignupOpen(!this.props.signupOpen)
    }
 
    
    render() {
    
        // console.log("##this.props",this.props) // classes와 autoStore이 들어있다.
        const { classes, setSignupOpen } = this.props; // import {styles} from "./styles/SignInStyles.js". Q) 그런데 어떻게 styles가 아니라 classes 라는 이름으로 this.props에 들어있는거지?

        const { loginState, login } = this.props.authStore;

        return (
            <div className={classes.root}>
                <Container component="main" maxWidth="sm">
                    {/*<div className={classes.appBarSpacer} />*/}
                        <div className={classes.paper}>
                            {/*<Avatar className={classes.lockOutAvatar}><LockOutlinedIcon/></Avatar>*/}
                            <Typography component="h1" variant="h5" className={classes.titleStyle}>
                                {/*{loginState === store.State.Failed ? 'Sign in failed.' : 'Please sign in.'}*/}
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
                                                       <UserIcon />
                                                   </InputAdornment>
                                               ),
                                           }}
                                           required fullWidth />
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
                                                       <KeyIcon />
                                                   </InputAdornment>
                                               ),
                                           }}
                                           required fullWidth />
                                <Button type="submit"
                                        className={classes.submit}
                                        // color="primary"
                                        variant="contained"
                                        disabled={loginState === store.State.Pending}
                                        onClick={this.handleSubmitForm}
                                        disableRipple
                                        fullWidth >
                                    {loginState === store.State.Pending ? <CircularProgress size={22}/> : 'Sign In'}
                                </Button>
                                <Grid container  justifyContent="flex-end" >
                                    <Grid item >
                                        <Button style={{cursor:"pointer", backgroundColor:"lightyellow"}} onClick={this.onSetSignupOpen}>
                                            Don't have an account? Sign Up
                                        </Button>
                                        {/*<Link to={"/signup"}   variant="body2" onClick={this.onSignUp} style={{cursor:"pointer", backgroundColor:"lightyellow"}}>*/}
                                        {/*<Link href="/signup"   variant="body2"  style={{cursor:"pointer", backgroundColor:"lightyellow"}}>*/}
                                        {/*    {"Don't have an account? Sign Up"}*/}
                                        {/*</Link>*/}
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    <Copyright sx={{mt: 5}} style={{marginTop:'20px'}}/>
                </Container>
            </div>
        );
    }
}

export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('authStore')(
                observer(SignIn)
            )
        )
    )
);