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

import { withStyles } from '@material-ui/core/styles';

import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";


const styles = {
    media: {
        margin: 400,
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

    //form 관련 함수

    handleChangeTitle = (e) => {
        this.props.roomStore.changeTitle(e.target.value);
    }

    handleChangeDescriptions = (e) => {
        this.props.roomStore.changeDescriptions(e.target.value);
    }

    handleChangeRoomPassword = (e) => {
        this.props.roomStore.changePassword(e.target.value);
    };

    handleSubmitRoomForm = (e) => {
        this.props.roomStore.doMakeRoom();
    };

    render() {
        const { classes } = this.props;
        return(
            <Container component="main" maxWidth="sm">
                <div className={classes.media}></div>
                <TextField
                    id="title"
                    name="title"
                    label="방제목"
                    margin="normal"
                    onChange={this.handleChangeTitle}
                    fullWidth
                    required
                />
                <TextField
                    id="descriptions"
                    name="descriptions"
                    label="방설명"
                    multiline
                    rows={4}
                    margin="normal"
                    onChange={this.handleChangeDescriptions}
                    fullWidth
                    required
                />
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">방설정</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="female" control={<Radio />} label="공개방"onClick={this.openInput.bind(this)}/>
                        <FormControlLabel value="male" control={<Radio />} label="비공개방" onClick={this.privateInput.bind(this)}/>
                    </RadioGroup>
                </FormControl>
                {this.state.private?<TextField
                    id="room-password"
                    name="room-password"
                    label="비밀번호"
                    margin="normal"
                    onChange={this.handleChangeRoomPassword}
                    fullWidth
                    required
                /> : ''}
                <Stack direction="row" spacing={2} justifyContent="flex-start"
                       alignItems="flex-start" direction="row-reverse">
                    <Button variant="contained" color="primary" onClick={this.handleSubmitRoomForm.bind(this)}>
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

export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('roomStore')(
                observer(RoomMake)
            )
        )
    )
);