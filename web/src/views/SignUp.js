import * as React from 'react';
import {inject, observer} from "mobx-react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "./styles/SignInStyles";
import {typeState} from "../stores/AuthStore";

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

const theme = createTheme();

function SignUp(props) {
    
    const {typeState, signupOpen, setSignupOpen} = props
    const {signupUser, onSignupUser, doSignup} = props.authStore
    
    const [type, setType] = React.useState('');
    
    // 회원가입 email, password, name 등록
    const mainHandleChange = (event) => {
        // console.log("onSignupUser : ",onSignupUser)
        // console.log(event.target.name, " : ", event.target.value)
        onSignupUser(event.target.id, event.target.value)
        // onSignupUser[event.target.id]= event.target.value
        console.log("onSignupUser : ", signupUser)
    }
    
    // 회원가입 type 등록
    const typeHandleChange = (event) => {
        setType(event.target.value);
        onSignupUser(event.target.name, typeState[event.target.value])
        // onSignupUser[event.target.name] = typeState[event.target.value]
        // console.log(event.target.name, " : ", typeState[event.target.value])
        console.log("onSignupUser", signupUser)
    };
    
    // 회원가입 최종 정보 등록
    let handleSubmit = (e) => {
        e.preventDefault()
        console.log("total_onSignupUser", signupUser)
        props.authStore.doSignup()
        props.setSignupOpen(!props.signupOpen)
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 30,
                        // marginRight :'auto',
                        display      : 'flex',
                        flexDirection: 'column',
                        alignItems   : 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="email"
                                    name="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    onChange={mainHandleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="new-password"
                                    name="password"
                                    type="password"
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    onChange={mainHandleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    onChange={mainHandleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{minWidth: 120}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                        <Select
                                            labelId="type"
                                            name="type"
                                            id="type"
                                            value={type}
                                            label="Type"
                                            onChange={typeHandleChange}
                                        >
                                            <MenuItem value={10}>Admin</MenuItem>
                                            <MenuItem value={20}>Manager</MenuItem>
                                            <MenuItem value={30}>Operator</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </ThemeProvider>
    );
}

export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('authStore')(
                observer(SignUp)
            )
        )
    )
);