import React from "react";

import {Container} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {inject, observer} from "mobx-react";
import { withStyles, makeStyles } from '@material-ui/core/styles';

import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import RoomHistory from '../assets/images/history.png'

const styles = {
    roomMakeImg: {
        width: "100%",
        alignItems   : 'center'
    },
    roomMakeImgOutDiv:{
        paddingTop: 100,
        paddingLeft: 220,
        paddingRight: 220,
    }
}

class RoomMake extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            private: false,
            titleMessage: "",
            passwordMessage: "",
            linkMessage: "",
            startTimeMessage: "",
        };
    }

    componentDidMount () {
        const userId = this.props.authStore.loginUser.id;
        // console.log("새로고침해도 있나 확인 userId : ", userId, typeof (userId))
        const data = this.props.roomStore.getPublishedRoom(userId);
        console.log("PublishedRoom data : ",data)
    }



    // 세미나 만들기 폼 입력값 받는 함수


    render() {
        const { classes } = this.props;

        return(
            <Container component="main" maxWidth="sm">
                <div className={classes.roomMakeImgOutDiv}>
                    <img src={RoomHistory}  className={classes.roomMakeImg} />
                </div>

                <div> 현재 내가 만든 세미나 목록 : 'room' table select by userId === publisherId</div>
                <div> ====================================== </div>
                <div> 내가 만들었던 세미나 히스토리 : 'roomHistory' table select by Id === publisherId </div>
                <div> 내가 참여했던 세미나 히스토리 : 'roomUserHistory' table select by Id ===playerId </div>

                <TextField
                    id="title"
                    name="title"
                    type="text"
                    label="세미나 제목"
                    margin="normal"
                    onChange={this.handleChangeTitle}
                    inputProps={{
                        min: 5,
                        maxLength: 120
                    }}
                    fullWidth
                    required
                />
                <span style={{color:"red"}}> {this.state.titleMessage} </span>


                {
                    this.state.private ?
                        <div>

                            <TextField
                                id="room-password"
                                name="room-password"
                                label="패스워드"
                                type="password"
                                margin="normal"
                                onChange={this.handleChangeRoomPassword}
                                fullWidth
                                required
                            />
                        <span style={{color:"red"}}> {this.state.passwordMessage} </span>
                        </div>
                        : ''
                }

                <Stack direction="row" spacing={2} justifyContent="flex-start"
                       alignItems="flex-start" direction="row-reverse">

                    {/*<Button variant="contained" color="success" onClick={}>*/}
                    {/*    검색*/}
                    {/*</Button>*/}
                </Stack>
            </Container>
        );
    }
}

export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('roomStore', 'authStore')(
                observer(RoomMake)
            )
        )
    )
);