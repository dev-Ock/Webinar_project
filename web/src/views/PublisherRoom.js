import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import moonPicture from '../assets/images/moon.jpg'
import {RoomMakeRoomID} from "../repositories/Repository";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Button, Paper} from "@material-ui/core";
import { typography } from '@mui/system';

const styles = {
    
    // roomMakeImg: {
    //     width: "100%",
    //     alignItems   : 'center'
    // },
    // roomMakeImgOutDiv:{
    //     paddingTop: 70,
    //     paddingLeft: 110,
    //     paddingRight: 110,
    // }
    //
}

class PublisherRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // cameraOn: true,
            room : {},
            roomUser : {},
            playerList : false
        }
    }
    
    componentDidMount() {
        this.props.handleDrawerToggle(); // SideMenu 최소화
        // room 데이터 조회
        const roomId = sessionStorage.getItem(RoomMakeRoomID)
        this.state.room = this.props.roomStore.getSelectedRoom(roomId);
        console.log('this.state.room : ',this.state.room)
        // console.log('주소 : ', window.location.pathname === '/publisher-room')
    }
    
    // SRS server-Publisher 연결
    async onServerPublisherConnection() {
        const streamUrl = sessionStorage.getItem(Repository.RoomMakeStreamUrl)
        await this.props.roomStore.serverPublisherConnection(streamUrl);
    }
    
    // Camera on/off
    onVideoOnOff = () => {
        this.props.roomStore.setVideoOnOff();
    }
    
    // Audio on/off
    onAudioOnOff = () => {
        this.props.roomStore.setAudioOnOff();
    }
    
    async onChangeVideoOption() {
        await this.props.roomStore.setChangeVideoOption();
    }
    
    // player list 조회
    async onPlayerList() {
        const roomId = sessionStorage.getItem(RoomMakeRoomID)
        this.state.roomUser = await this.props.roomUserStore.getRoomUserList(roomId)
        await this.setState({playerList : !this.state.playerList})
    }
    
    // player List 조회 새로고침
    async onRefreshPlayerList(){
        console.log('111')
        const roomId = sessionStorage.getItem(RoomMakeRoomID)
        this.state.roomUser = await this.props.roomUserStore.getRoomUserList(roomId)
    }
    
    render() {
        return (
            <div>
                <div style={{textAlign: 'center', marginTop: '100px'}}>
                    <h1 style={{color: "red"}}>여기는 publisher</h1>
                </div>
                <div className="call">
                    <div className="myStream" style={{textAlign: 'center'}}>
                        <div>
                            <video
                                id="myVideoTag"
                                // poster={moonPicture}
                                autoPlay
                                playsInline
                                width={600}
                                height={500}
                            ></video>
                        </div>
                        <br/>
                        <div
                            id="BtnOptionBox"
                            style={{borderStyle: 'solid', padding: '25px', borderColor: 'red'}}
                            hidden={true}
                        >
                            <button
                                id="videoBtnTag"
                                style={{fontSize: "25px"}}
                                onClick={this.onVideoOnOff.bind(this)}
                            >
                                카메라 끄기
                            </button>
                            
                            <button
                                id="muteBtnTag"
                                style={{fontSize: "25px", marginLeft:'15px'}}
                                onClick={this.onAudioOnOff.bind(this)}
                            >
                                음소거
                            </button>
                            <br/>
                            <br/>
                            <select
                                id="cameras"
                                style={{fontSize: "25px"}}
                                onInput={this.onChangeVideoOption.bind(this)}
                            ></select>
                            <br/>
                            <br/>
                            <Button
                                variant="contained" color="primary"
                                onClick={this.onPlayerList.bind(this)}
                            >
                                player 명단
                            </Button>
    
                            {
                                this.state.playerList ?
                                    <PlayerList onRefreshPlayerList={this.onRefreshPlayerList.bind(this)} roomUserList={this.state.roomUser}  /> :
                                    ""
                            }
                            
                        </div>
                        <br/>
                        <br/>
                        <div style={{textAlign: "center"}}>
                            <button
                                style={{fontSize: "25px"}}
                                onClick={this.onServerPublisherConnection.bind(this)}>
                                방송 시작
                            </button>
                            
                            <br/>
                            <br/>
                            
                            
                            {/* <video
                                id="peerFace"
                                autoPlay
                                playsInline
                                width={400}
                                height={400}></video> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    
}

function PlayerList(props){
    // console.log("수 : ",props.roomUserList.length)
    return(
        <>
            <br/>
            <br/>
        <Button
            variant="outlined"
            onClick={props.onRefreshPlayerList}
        >
            refresh
        </Button>
            <br/>
            <br/>
        <div> Player 수 : {props.roomUserList.length} 명</div>
            <br/>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" >
                <TableHead>
                    <TableRow>
                        <TableCell align={"center"}> Player 이름 </TableCell>
                        <TableCell align={"center"} > 기능 </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.roomUserList.length !== 0
                        ?
                        props.roomUserList.map(roomUser => (
                                <TableRow key={roomUser.id}>
                                    <TableCell align={"center"}> {roomUser.name} </TableCell>
                                    <TableCell align={"center"}>
                                        <Button
                                            variant="contained"
                                        >
                                            강퇴 버튼 만들 예정
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        :
                        <TableRow>
                            <TableCell align={"center"}> 없습니다 </TableCell>
                            <TableCell align={"center"}>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}

export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'roomUserStore','authStore')(
                observer(PublisherRoom)
            )
        )
    )
);