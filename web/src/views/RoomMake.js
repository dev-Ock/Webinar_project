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


const styles = {
    media: {
        margin: 100,
    }
}


class RoomMake extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            private: false,
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

    // 방 만들기 폼 입력값 받는 함수
    handleChangeTitle = (e) => {
        this.props.roomStore.changeTitle(e.target.value);
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


    handleChangeRoomPassword = (e) => {
        this.props.roomStore.changePassword(e.target.value);
    };

    handleSubmitRoomForm = () => {
        const nowPublisherId = this.props.authStore.loginUser.id
        console.log(nowPublisherId);

        //nowPublisherId 유효성 체크
        if(nowPublisherId > 0){
        this.props.roomStore.doMakeRoom(this.props.authStore.loginUser.id);
        } else {
            alert('잘못된 접근입니다.')
        }
    };

    render() {
        const { classes } = this.props;

        return(
            <Container component="main" maxWidth="sm">
                <div className={classes.media}></div>
                <TextField
                    id="title"
                    name="title"
                    type="text"
                    label="방제목(최소 5자 최대 120자)"
                    margin="normal"
                    onChange={this.handleChangeTitle}
                    inputProps={{
                        min: 5,
                        maxLength: 120
                    }}
                    fullWidth
                    required
                />
                <TextField
                    id="description"
                    name="description"
                    type="text"
                    label="방설명(최대250자)"
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
                        label="(선택) 회의 시작 시간"
                        margin="normal"
                        type="time"
                        defaultValue="10:00"
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
                    <FormLabel id="demo-row-radio-buttons-group-label">방설정</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="public" control={<Radio />} label="공개방"onClick={this.openInput.bind(this)}/>
                        <FormControlLabel value="private" control={<Radio />} label="비공개방" onClick={this.privateInput.bind(this)}/>
                    </RadioGroup>
                </FormControl>
                {
                    this.state.private ?
                            <TextField
                                id="room-password"
                                name="room-password"
                                label="비밀번호"
                                type="password"
                                margin="normal"
                                onChange={this.handleChangeRoomPassword}
                                fullWidth
                                required
                            /> : ''
                }
                <div></div>

                <Stack direction="row" spacing={2} justifyContent="flex-start"
                       alignItems="flex-start" direction="row-reverse">
                    <Button variant="contained" color="primary" onClick={() => this.handleSubmitRoomForm()}>
                        방만들기
                    </Button>
                    <Button variant="contained" color="success" onClick={this.reload.bind(this)}>
                        초기화
                    </Button>
                </Stack>

            </Container>
        );
    }
};
// publisherId,

export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('roomStore', 'authStore')(
                observer(RoomMake)
            )
        )
    )
);