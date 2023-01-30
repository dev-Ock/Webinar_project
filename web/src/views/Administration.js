import React from "react";
import {inject, observer} from "mobx-react";
import moment from "moment";
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@material-ui/core";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import * as store from "../stores/AuthStore";


// [component] update dialog
function UpdateDialog(props) {
    
    const user = props.updateUser
    return (
        <Dialog
            // theman={user}
            open={props.dialogOpen}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            
            <DialogContent>
                <Box
                    sx={{
                        marginTop: 12,
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
                        Update user information
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
                                    defaultValue={user.email}
                                    // label="Email Address"
                                    onChange={props.mainHandleChange}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    defaultValue={user.name}
                                    label="Name"
                                    onChange={props.mainHandleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{minWidth: 120}}>
                                    <FormControl fullWidth>
                                        <InputLabel
                                            id="demo-simple-select-label">Type</InputLabel>
                                        <Select
                                            labelId="type"
                                            name="type"
                                            id="type"
                                            defaultValue={Number(props.typeValue(props.typeState, user.type))}
                                            // value={ 10 }
                                            label="Type"
                                            onChange={props.typeHandleChange}
                                        >
                                            <MenuItem
                                                value={10}>Admin</MenuItem>
                                            <MenuItem
                                                value={20}>Manager</MenuItem>
                                            <MenuItem
                                                value={30}>Operator</MenuItem>
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
                            onClick={props.handleSaveClose}
                        >
                            회원정보수정
                        </Button>
                    </Box>
                </Box>
            
            
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} autoFocus>
                    취소
                </Button>
            </DialogActions>
            // </Dialog>
    
    )
}

// [component] no date in userList
function Nothing() {
    return (
        <TableRow>
            <TableCell> nothing </TableCell>
            <TableCell> nothing </TableCell>
            <TableCell> nothing </TableCell>
            <TableCell> nothing </TableCell>
            <TableCell> nothing </TableCell>
        </TableRow>
    )
}

// [Main component] Administration
class Administration extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            person    : null
        }
        
    }
    
    
    // 전체 사용자 조회
    componentDidMount() {
        if(this.props.authStore.loginUser)
        this.props.authStore.getUsers()
    }
    
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(this.props.userList !== prevProps.userList){
    //         this.props.authStore.getUsers()}
    //
    // }
    
    
    // 회원정보수정 dialog 열기
    handleClickOpen = (e, user) => {
        e.preventDefault()
        
        console.log("user", user)
        this.props.authStore.person = user
        // this.setState({person : user})
        this.setState({dialogOpen: !this.state.dialogOpen});
        this.props.authStore.setUpdateUser(user)
        console.log("click-updateUser", this.props.authStore.updateUser)
    };
    
    
    // 회원정보 type default value 를 위한.
    typeValue = (obj, type) => {
        // console.log("typeState", store.typeState)
        // console.log("obj", obj)
        return Object.keys(obj).find(key => obj[key] === type);
    }

// 회원정보 email, password, name 수정
    mainHandleChange = (e) => {
        // console.log("onSignupUser : ",onSignupUser)
        // console.log(event.target.name, " : ", event.target.value)
        this.props.authStore.onUpdateUser(e.target.id, e.target.value)
        // onSignupUser[event.target.id]= event.target.value
        // console.log("onSignupUser : ", signupUser)
    }
    
    // 회원정보 type 수정
    typeHandleChange = (e) => {
        // setType(event.target.value);
        this.props.authStore.onUpdateUser(e.target.name, store.typeState[e.target.value])
        // console.log("onSignupUser", signupUser)
    };
    
    // 회원정보 수정 요청 후 disalog 닫기
    handleSaveClose = (e) => {
        e.preventDefault()
        let promiseResult = this.props.authStore.finalUpdateUser();
        promiseResult.then(data => {
                if (data === 1) {
                    this.props.authStore.getUsers();
                    this.setState({dialogOpen: !this.state.dialogOpen});
                } else {
                    if (alert("회원정보 수정에 실패했습니다. 다시 시도해주시기 바랍니다.") === undefined) {
                        this.props.authStore.getUsers();
                        this.setState({dialogOpen: !this.state.dialogOpen});
                    }
                }
            }
        )
    }
    
    // 수정 안 하고 dialog 닫기
    handleClose = (e) => {
        e.preventDefault()
        this.setState({dialogOpen: !this.state.dialogOpen});
    };
    
    // 사용자 삭제하고 다시 전체 사용자 조회
    onRemoveUser(e, id) {
        e.preventDefault();
        this.props.authStore.removeUser(id);
        // this.props.authStore.getUsers();
    }
    
    render() {
        const {userList} = this.props.authStore
        
        return (
            // <div>hello</div>
            <TableContainer component={Paper} style={{marginTop: '100px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">아이디</TableCell>
                            <TableCell align="center">이름</TableCell>
                            <TableCell align="center">email</TableCell>
                            <TableCell align="center">유형</TableCell>
                            <TableCell align="center">가입날짜</TableCell>
                            <TableCell align="center">수정 / 삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Array.isArray(userList) && userList.length ?
                                userList.map(user => {
                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell align="center">{user.id}</TableCell>
                                                <TableCell align="center">{user.name}</TableCell>
                                                <TableCell align="center">{user.email}</TableCell>
                                                <TableCell align="center">{user.type}</TableCell>
                                                <TableCell
                                                    align="center">{moment(user.createdDatetime).format('YYYY년 MM월 DD일')}</TableCell>
                                                <TableCell align="center">
                                                    <button onClick={(e) => {
                                                        this.handleClickOpen(e, user)
                                                    }}>수정
                                                    </button>
                                                    <UpdateDialog person={this.props.authStore.person}
                                                                  updateUser={this.props.authStore.updateUser} user={user}
                                                                  dialogOpen={this.state.dialogOpen}
                                                                  mainHandleChange={this.mainHandleChange}
                                                                  typeHandleChange={this.typeHandleChange}
                                                                  typeValue={this.typeValue}
                                                                  typeState={store.typeState}
                                                                  handleSaveClose={this.handleSaveClose}
                                                                  handleClose={this.handleClose}/>
                                                    <button onClick={(e) => this.onRemoveUser(e, user.id)}
                                                            style={{marginLeft: '10px'}}>삭제
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                )
                                :
                                <Nothing/>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default inject('authStore')(
    observer(Administration)
);
