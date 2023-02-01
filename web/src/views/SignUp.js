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
    
    const {signupUser, onSignupUser, onSignupEmail, signupEmail} = props.authStore
    
    const [emailMessage, setEmailMessage] = React.useState("")
    const [emailConfirm, setEmailConfirm] = React.useState(false)
    const [phoneNumMessage, setPhoneNumMessage] = React.useState("")
    const [newPW, setNewPW] = React.useState("")
    const [pwMessage, setPwMessage] = React.useState("")
    const [confirmPW, setConfirmPW] = React.useState("")
    
    // 이메일 유효성 검사
    const checkEmail = (e) => {
            setEmailConfirm(false);
            let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
            // 형식에 맞는 경우 true 리턴
            let validation = regExp.test(e.target.value)
             // console.log('이메일 유효성 검사 :: ', validation)
            if(validation){
                // 유효하다면
                onSignupEmail('email', e.target.value);
                // setIncorrectEmail(false);
                setEmailMessage("")
                //
            }else{
                // 유효하지 않다면
                // setIncorrectEmail(true);
                setEmailMessage("이메일 형식에 맞게 적어주세요")
            }
        }
        
    // 이메일 중복 검사
    const checkEmailDuplication = () => {
        // console.log("signup",signupEmail.email)
        if(signupEmail.email===""){
            return alert ('email을 입력해주세요')
        }
        const result = props.authStore.onCheckEmail();
        console.log('result ',result)
        result.then(result => {
                if(!result){
                    alert('사용 가능합니다')
                    // console.log('signupEmail', signupEmail.email)
                    onSignupUser('email', signupEmail.email );
                    setEmailConfirm(true);
                }else{
                    alert('사용할 수 없습니다')
                }
        })
    }
    
    // password 유효성 검사(정규식)
    const checkPasswordReg = (e) => {
        
        const passwordRegEx = /^[A-Za-z0-9]{8,20}$/
        const password = e.target.value;
        if(password.match(passwordRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPwMessage('비밀번호는 영문 대소문자, 숫자를 혼합하여 8~20자로 입력해주세요')
            console.log('비밀번호는 영문 대소문자, 숫자를 혼합하여 8~20자로 입력해주세요');
            return;
        }else{ // 맞을 경우 출력
            setPwMessage("")
            console.log('비밀번호 형식이 맞아요');
            setNewPW(e.target.value)
        }
    }
    
    
    // password 일치하는지 검사 및 등록
    const checkPassword = (e) => {
        console.log(confirmPW)
        if(confirmPW){
            if(confirmPW == newPW){
                // setPwMessage("일치합니다")
                alert("비밀번호가 일치합니다~^^")
                onSignupUser('password',newPW)
            }else{
                // setPwMessage("비밀번호가 일치하지 않습니다")
                alert("비밀번호가 일치하지 않습니다 ㅠㅠ")
            }
        }
    }
    
    // name 등록
    const setName = (e) => {
        onSignupUser(e.target.id, e.target.value)
        console.log("onSignupUser : ", signupUser)
    }
    
    // 전화번호 유효성 검사 및 등록
    const checkPhonenumber = (e) => {
        let regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/
        // 형식에 맞는 경우 true 리턴
        let validation = regExp.test(e.target.value)
        if(validation){
            // 유효하다면
            onSignupUser(e.target.id, e.target.value);
            setPhoneNumMessage("")
        }else{
            // 유효하지 않다면
            onSignupUser(e.target.id, "")
            setPhoneNumMessage("Phone Number를 자릿수에 맞게 -를 빼고 적어주세요")
        }
    }
    
    // 회원가입 최종 정보 확인 및 등록
    let handleSubmit = (e) => {
        e.preventDefault()
        console.log("total_onSignupUser", signupUser)
        if(!signupUser.email){
            return alert("Email을 적고 중복 확인을 해 주세요");
        }
        if(!signupUser.password){
            return alert("Password를 적고 일치하는 지 확인해주세요");
        }
        if(!signupUser.name){
            return alert("Name을 적어주세요");
        }
        if(!signupUser.phoneNum){
            return alert("Phone Number를 자릿수에 맞게 -를 빼고 적어주세요");
        }
        
        props.authStore.doSignup()
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
                                    // onBlur={checkEmail}
                                    onChange={checkEmail}
                                    
                                />
                                <span style={{color:"red"}}>{emailMessage}</span>
    
                                {
                                    emailConfirm
                                        ?
                                        <Button style={{display:'inline-block', float:'right'}} disabled onClick={checkEmailDuplication}>확인 완료</Button>
                                        :
                                        <Button style={{display:'inline-block', float:'right'}} onClick={checkEmailDuplication}>중복 확인하기</Button>
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
                                    onChange={checkPasswordReg}
                                />
                                <span style={{color:"red"}}>{pwMessage}</span>
                                
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="rePassword"
                                    placeholder="Password를 다시 한 번 입력해주세요"
                                    name="rePassword"
                                    type="password"
                                    required
                                    fullWidth
                                    id="rePassword"
                                    label="Confirm password"
                                    onChange={e => setConfirmPW(e.target.value)}
                                />
                                {/*<span style={{color:"red"}}>{pwMessage}</span>*/}
                                <Button style={{display:'inline-block', float:'right'}} onClick={checkPassword}>일치 확인하기</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    onChange={setName}
                                />
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
                                    onChange={checkPhonenumber}
                                />
                                <span style={{color:"red"}}>{phoneNumMessage}</span>
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
                                <Link href="/" variant="body2"  style={{cursor:"pointer", backgroundColor:"lightyellow"}} >
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