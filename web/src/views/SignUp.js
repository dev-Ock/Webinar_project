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
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {styles} from "./styles/SignInStyles";

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

const theme = createTheme();

function SignUp(props) {
    
    const {signupUser, onSignupUser, onSignupCheckUser} = props.authStore
    
    const [emailMessage, setEmailMessage] = React.useState("")
    const [pwMessage, setPwMessage] = React.useState("")
    const [phoneNumMessage, setPhoneNumMessage] = React.useState("")
    const [nameMessage, setNameMessage] = React.useState("")
    const [emailConfirm, setEmailConfirm] = React.useState(false)
    const [pwConfirm, setPwConfirm] = React.useState(false)
    const [nameConfirm, setNameConfirm] = React.useState(false)
    const [phoneNumConfirm, setPhoneNumConfirm] = React.useState(false)
    
    
    // 이메일 세팅 및 유효성 검사
    const checkEmail = (e) => {
        setEmailConfirm(false);
        onSignupUser('email', "");
        props.authStore.onSignupTempUser(e.target.id, e.target.value);
        
        let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        let validation = regExp.test(props.authStore.signupTempUser.email)
        // let validation = regExp.test(e.target.value)
        if (validation) {
            // 유효하다면
            onSignupCheckUser('email', props.authStore.signupTempUser.email);
            console.log("유효")
            // onSignupEmail('email', e.target.value);
            setEmailMessage("")
            return;
        } else {
            // 유효하지 않다면
            setEmailMessage("email을 형식에 맞게 입력해주세요")
            return;
        }
    }
    
    // 이메일 중복 검사
    const checkEmailDuplication = () => {
        if (!props.authStore.signupCheckUser.email) {
            return alert('email을 형식에 맞게 입력해주세요')
        }
        const result = props.authStore.onSignupDuplicationCheckEmail();
        result.then(result => {
            if (!result) {
                alert('사용 가능합니다')
                onSignupUser('email', props.authStore.signupCheckUser.email);
                setEmailConfirm(true);
                return;
            } else {
                alert('사용할 수 없습니다')
                return;
            }
        })
    }
    
    // password 세팅 및 유효성 검사(정규식)
    const checkPasswordReg = (e) => {
        setPwConfirm(false);
        props.authStore.onSignupTempUser('password', e.target.value);
        onSignupUser('password', "");
        
        const passwordRegEx = /^[A-Za-z0-9]{8,20}$/
        const password = e.target.value;
        if (password.match(passwordRegEx) === null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPwMessage('비밀번호는 영문 대소문자, 숫자를 혼합하여 8~20자로 입력해주세요')
            // console.log('비밀번호는 영문 대소문자, 숫자를 혼합하여 8~20자로 입력해주세요');
            return;
        } else { // 맞을 경우 출력
            onSignupCheckUser('password', props.authStore.signupTempUser.password);
            setPwMessage("")
            return;
            // console.log('비밀번호 형식이 맞아요');
            // setNewPW(e.target.value)
        }
    }
    
    // confirmPassword 세팅
    const setConfirmPassword = (e) => {
        setPwConfirm(false);
        return props.authStore.onSignupTempUser('confirmPassword', e.target.value);
    }
    
    
    // password와 confirmPassword 일치하는지 검사 및 등록
    const checkPassword = (e) => {
        console.log("pwMessage", pwMessage)
        // Password 유효성 검사를 통과하지 못한 경우
        if (!props.authStore.signupCheckUser.password) {
            return alert("Password를 형식에 맞게 입력해주세요")
        }
        // Confirm Password를 적지 않은 경우
        if (!props.authStore.signupTempUser.confirmPassword) {
            return alert("Confirm Password를 입력해주세요")
        }
        // 일치 여부 검사
        if (props.authStore.signupCheckUser.password === props.authStore.signupTempUser.confirmPassword) {
            // setPwMessage("일치합니다")
            alert("비밀번호가 일치합니다")
            onSignupUser('password', props.authStore.signupCheckUser.password)
            setPwConfirm(true);
        } else {
            // setPwMessage("비밀번호가 일치하지 않습니다")
            alert("비밀번호가 일치하지 않습니다")
        }
    }
    
    // name 세팅
    const changeName = (e) => {
        props.authStore.onSignupTempUser(e.target.id, e.target.value);
        setNameConfirm(false);
        if (e.target.value) {
            setNameMessage("");
        }
    }
    
    // name 등록
    const setName = (e) => {
        if (!e.target.value) {
            return setNameMessage("Name을 입력해주세요.");
        }
        onSignupUser(e.target.id, e.target.value)
        setNameMessage("");
        setNameConfirm(true);
        console.log("onSignupUser : ", signupUser)
    }
    
    // 전화번호 유효성 검사 및 등록
    const checkPhoneNum = (e) => {
        setPhoneNumConfirm(false);
        props.authStore.onSignupTempUser(e.target.id, e.target.value)
        let regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/
        // 형식에 맞는 경우 true 리턴
        let validation = regExp.test(e.target.value)
        if (validation) {
            // 유효하다면
            onSignupUser(e.target.id, e.target.value);
            setPhoneNumConfirm(true);
            setPhoneNumMessage("")
        } else {
            // 유효하지 않다면
            onSignupUser(e.target.id, "")
            setPhoneNumMessage("Phone Number를 자릿수에 맞게 -를 빼고 입력해주세요")
        }
    }
    
    // prevent KeyDown function
    const preventKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
        }
    }
    
    
    // By pushing enter key, 회원가입 최종 전보 확인 및 등록
    const handleSubmitByKey = (e) => {
        if (e.keyCode === 13) {
            const type = ['email', 'password', 'name', 'phoneNum']
    
            for (let i = 0; i < type.length; i++) {
                if (!signupUser[type[i]]) {
                    return alert(`${type[i]} 입력해주세요`);
                }
            }
            props.authStore.doSignup()
            alert("회원가입이 완료되었습니다. 로그인해 주세요.")
            props.setSignupOpen(!props.signupOpen)
        }
    }
    
    // By clicking 'SIGN UP' key, 회원가입 최종 정보 확인 및 등록
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("total_onSignupUser", signupUser)
        
        const type = ['email', 'password', 'name', 'phoneNum']
        
        for (let i = 0; i < type.length; i++) {
            if (!signupUser[type[i]]) {
                return alert(`${type[i]} 입력해주세요`);
            }
        }
        //
        // if (!signupUser.email) {
        //     return alert("Email을 적고 중복 확인을 해 주세요");
        // }
        // if (!signupUser.password) {
        //     return alert("Password를 적고 일치하는 지 확인해주세요");
        // }
        // if (!signupUser.name) {
        //     return alert("Name을 적어주세요");
        // }
        // if (!signupUser.phoneNum) {
        //     return alert("Phone Number를 자릿수에 맞게 -를 빼고 적어주세요");
        // }
        
        props.authStore.doSignup()
        alert("회원가입이 완료되었습니다. 로그인해 주세요.")
        props.setSignupOpen(!props.signupOpen)
    };
    
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 20,
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
                                    placeholder="example@onthelive.kr"
                                    name="email"
                                    type="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    value={props.authStore.signupTempUser.email}
                                    onChange={checkEmail}
                                    onKeyDown={preventKeyDown}
                                    
                                />
                                <span style={{color: "red"}}>{emailMessage}</span>
                                
                                {
                                    emailConfirm
                                        ?
                                        <Button style={{display: 'inline-block', float: 'right'}} disabled
                                        >Email 확인 완료</Button>
                                        :
                                        <Button style={{display: 'inline-block', float: 'right'}}
                                                onClick={checkEmailDuplication}>중복 확인하기</Button>
                                }
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="new-password"
                                    placeholder="영문 대소문자, 숫자 혼합 8~20자"
                                    name="password"
                                    type="password"
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    value={props.authStore.signupTempUser.password}
                                    onChange={checkPasswordReg}
                                    onKeyDown={preventKeyDown}
                                />
                                <span style={{color: "red"}}>{pwMessage}</span>
                            
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="rePassword"
                                    placeholder="Password를 다시 한 번 입력해주세요"
                                    name="rePassword"
                                    type="password"
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm password"
                                    value={props.authStore.signupTempUser.confirmPassword}
                                    onChange={setConfirmPassword}
                                    onKeyDown={preventKeyDown}
                                />
                                {
                                    pwConfirm
                                        ?
                                        <Button style={{display: 'inline-block', float: 'right'}} disabled
                                        >Password 확인 완료</Button>
                                        :
                                        <Button style={{display: 'inline-block', float: 'right'}}
                                                onClick={checkPassword}>일치 확인하기</Button>
                                }
                            
                            
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    value={props.authStore.signupTempUser.name}
                                    onChange={changeName}
                                    onBlur={setName}
                                    onKeyDown={preventKeyDown}
                                />
                                <span style={{color: "red"}}>{nameMessage}</span>
                                
                                {
                                    nameConfirm
                                        ?
                                        <Button style={{display: 'inline-block', float: 'right'}} disabled
                                        >Name 확인 완료</Button>
                                        :
                                        ""
                                    // <Button style={{display: 'inline-block', float: 'right'}}
                                    //         onClick={checkPassword}>일치 확인하기</Button>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="phoneNum"
                                    placeholder="-을 빼고 입력해주세요."
                                    name="phoneNum"
                                    required
                                    fullWidth
                                    id="phoneNum"
                                    label="Phone Number"
                                    value={props.authStore.signupTempUser.phoneNum}
                                    onChange={checkPhoneNum}
                                    onKeyUp={handleSubmitByKey}
                                />
                                <span style={{color: "red"}}>{phoneNumMessage}</span>
                                {
                                    phoneNumConfirm
                                        ?
                                        <Button style={{display: 'inline-block', float: 'right'}} disabled
                                        >Phone Number 확인 완료</Button>
                                        :
                                        ""
                                    // <Button style={{display: 'inline-block', float: 'right'}}
                                    //         onClick={checkPassword}>일치 확인하기</Button>
                                }
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
                                <Link href="/" variant="body2"
                                      style={{cursor: "pointer", backgroundColor: "lightyellow"}}>
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
        withStyles(styles)(
            inject('authStore')(
                observer(SignUp)
            )
        )
    )
);