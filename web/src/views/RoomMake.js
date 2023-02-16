import React from "react";

import {Container} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import {inject, observer} from "mobx-react";
import { withStyles, makeStyles } from '@material-ui/core/styles';

import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import ConferenceRoom from '../assets/images/conferenceRoom.png'
import {RoomMakeStreamUrl} from "../repositories/Repository";
import {RoomMakeState} from "../stores/RoomStore";
import PublisherRoom from "./PublisherRoom";

const styles = {
    roomMakeImg: {
        width: "100%",
        alignItems   : 'center'
    },
    roomMakeImgOutDiv:{
        paddingTop: 70,
        paddingLeft: 110,
        paddingRight: 110,
    }
}

class RoomMake extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            private: false,
            titleMessage: "",
            passwordMessage: "",
            passwordCheck: false,
            // linkMessage: "",
            // startTimeMessage: "",
        };
    }

    //비밀번호 input
    privateInput(){
        this.setState({
            private : true
        })
    }
    //비밀번호 input
    openInput(){
        this.setState({
            private : false
        })
    }
    //초기화 함수
    reload(){
        window.location.replace("/room-make")
    }



    // 세미나 만들기 폼 입력값 받는 함수
    handleChangeTitle = (e) => {

        const inputTitle = e.target.value.trim().length;
        // console.log("입력값 확인",e.target.value, inputTitle)
        if(inputTitle >= 3 && inputTitle <= 120 ){
            this.props.roomStore.changeTitle(e.target.value.trim());
            this.setState({
                titleMessage : ""
            })
        } else {
            this.setState({
                titleMessage : "세미나 제목은 3자이상 120자 이하로 작성해주세요."
            })
        }
    };

    handleChangeDescription = (e) => {
        this.props.roomStore.changeDescription(e.target.value);
    };

    handleChangeMaximum = (e) => {
        this.props.roomStore.changeMaximum(e.target.value);
    };
    handleChangeStartTime = (e) => {
        this.props.roomStore.changeStartTime(e.target.value);
    };
    handleChangeLink = (e) => {
        this.props.roomStore.changeLink(e.target.value);
    };

    preventSpacebar = (e) => {
        if(e.keyCode === 32) {
            e.preventDefault()
        }
    };

    handleChangeRoomPassword = (e) => {
        const inputPassword = e.target.value.toString().replace(/\s/g, "").length;
        // .replace(/\s/g, "") :복붙을 하는 경우에도 공백 입력 걸러냄

        this.props.roomStore.changePassword(e.target.value.replace(/ /g, ""));

        if(inputPassword >= 4){
            this.setState({
                passwordMessage : "",
                passwordCheck : true
            })
        }else {
            this.setState({
                passwordMessage : "패스워드는 공백 미포함 4자리 이상으로 설정해주세요.",
                passwordCheck : false
            })
        }
    };

    // '세미나 만들기' 클릭 시 폼 내용 검사 후 등록
    handleSubmitRoomForm = (e) => {
        e.preventDefault()
        const nowPublisherId = this.props.authStore.loginUser.id
        const inputCheck = ((id) => { return document.getElementById(id).value.trim().length});
        // 필수항목 체크 (세미나 제목, 최대인원수, 세미나 설정)
        if(inputCheck("title")<3){
            return alert("세미나 제목은 3자이상 120자 이하로 작성해주세요!")
        }else if(!inputCheck("maximum")){
            return alert("최대 참여인원 수를 입력해 주세요! (숫자만 입력)")
        }else if(this.state.private){
            console.log("this.state.private", this.state.private)
            if( this.state.passwordCheck !== true ){
                return alert("패스워드를 입력해 주세요! 패스워드는 공백 미포함 4자리 이상으로 작성해야 합니다.")
            }
        }

        // nowPublisherId 유효성 체크
        if(nowPublisherId <= 0){
            return alert('잘못된 접근입니다. 새로고침 후 다시시도 해 주세요.')
        }
    
        // room 정보 백으로 보냄
        const room = this.props.roomStore.doMakeRoom(this.props.authStore.loginUser.id);
        room
            .then((room) => {
                console.log("result", room)
                // this.props.roomStore.doSetRoomHistory(room);
                let enterRoomMessage = window.confirm("바로 입장하시겠습니까? 취소를 누르면 세미나 목록으로 이동합니다.")
                if(enterRoomMessage){
                    this.props.roomStore.setRoomData(room);
                    return window.location.replace('/publisher-room')

                }else{
                    this.props.roomStore.removeRoomData();
                    return window.location.replace('/room-list')
                }
            })
            .catch((e) => {
                console.log("error", e);
                this.props.roomStore.removeRoomData();
                alert( "세미나 만들기에 실패하였습니다. 잠시후 다시 시도 해주세요! " )
                return window.location.replace('/home')
            })
    };

    render() {
        const { classes } = this.props;
        // const { roomMakeState } = this.props.roomStore

        return(
            <Container component="main" maxWidth="sm">
                <div className={classes.roomMakeImgOutDiv}>
                    <img src={ConferenceRoom}  className={classes.roomMakeImg} />
                </div>
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
                <TextField
                    id="description"
                    name="description"
                    type="text"
                    label="세미나 설명(최대250자)"
                    multiline
                    margin="normal"
                    onChange={this.handleChangeDescription}
                    inputProps={{
                        maxLength: 250
                    }}
                    fullWidth
                    rows={3}
                    required
                />
                <TextField
                    id="maximum"
                    name="maximum"
                    label="최대 참여인원 수"
                    margin="normal"
                    type="number"
                    // defaultValue="6"
                    className={classes.textField}
                    onChange={this.handleChangeMaximum}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 1,
                        min: 0,
                        max: 1000
                    }}
                    fullWidth
                    required
                />

                <div>
                    <TextField
                        id="time"
                        label="(선택) 세미나 시작 시간"
                        margin="normal"
                        type="time"
                        className={classes.textField}
                        onChange={this.handleChangeStartTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        fullWidth
                    />
                    <TextField
                        id="link"
                        name="link"
                        type="url"
                        label="(선택) 공유하려는 콘텐츠 링크"
                        multiline
                        margin="normal"
                        onChange={this.handleChangeLink}
                        fullWidth
                        rows={2}
                    />
                </div>

                <FormControl>
                    <FormLabel id="passwordOption">세미나 설정</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue="public"
                    >
                        <FormControlLabel id="public" value="public" control={<Radio />} label="공개"onClick={this.openInput.bind(this)}/>
                        <FormControlLabel id="private" value="private" control={<Radio />} label="비공개" onClick={this.privateInput.bind(this)}/>
                    </RadioGroup>
                </FormControl>

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
                                onKeyDown={this.preventSpacebar}
                                fullWidth
                                required
                            />
                        <span style={{color:"red"}}> {this.state.passwordMessage} </span>
                        </div>
                        : ''
                }
                <div></div>

                <Stack direction="row" spacing={2} justifyContent="flex-start"
                       alignItems="flex-start" direction="row-reverse">
                    <Button variant="contained" color="primary" onClick={(e) => this.handleSubmitRoomForm(e)}>
                        세미나 만들기
                    </Button>
                    <Button variant="contained" color="success" onClick={this.reload.bind(this)}>
                        초기화
                    </Button>
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