import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import moonPicture from '../assets/images/moon.jpg'
import {RoomMakeRoomID} from "../repositories/Repository";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {typography} from '@mui/system';
import {Grid, Box, Typography, Button, Paper} from "@mui/material";
import PlayerList from "./PlayerList";

const styles = theme => ({
    mainContainer: {
        flexGrow: 1,
        padding : theme.spacing(3),
        
    },
    appBarSpacer : theme.mixins.toolbar,
    mainContent  : {
        marginTop    : theme.spacing(2),
        display      : 'flex',
        flexDirection: 'column',
        alignItems   : 'center',
    },
    toolbar      : {
        width: '100%',
        
    },
});

class PublisherRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // cameraOn: true,
            room      : {},
            roomUser  : {},
            playerList: false,
            standBy   : true,
            view      : true,
            stream    : "",
            pause     : false
        }
    }
    
    componentDidMount() {
        this.props.handleDrawerToggle(); // SideMenu 최소화
        // room 데이터 조회
        const roomId = sessionStorage.getItem(RoomMakeRoomID);
        this.state.room = this.props.roomStore.getSelectedRoom(roomId);
        console.log('this.state.room : ', this.state.room);
        // console.log('주소 : ', window.location.pathname === '/publisher-room')
        const stream = this.props.roomStore.setRoom(); // 방송 기본 세팅
        stream.then(data => this.setState({stream, data}));
    }
    
    // 방송 준비
    onStandBy() {
        this.setState({standBy: false});
    }
    
    // SRS server-Publisher 연결
    async onServerPublisherConnection() {
        const streamUrl = sessionStorage.getItem(Repository.RoomMakeStreamUrl);
        await this.props.roomStore.serverPublisherConnection(streamUrl);
        this.setState({view: false});
    }
    
    // Camera on/off
    onVideoOnOff = () => {
        this.props.roomStore.setVideoOnOff();
    }
    
    // Audio on/off
    onAudioOnOff = () => {
        this.props.roomStore.setAudioOnOff();
    }
    
    // camera change
    async onChangeVideoOption() {
        await this.props.roomStore.setChangeVideoOption();
    }
    
    // player list 조회
    async onPlayerList() {
        const roomId = sessionStorage.getItem(RoomMakeRoomID);
        this.state.roomUser = await this.props.roomUserStore.getRoomUserList(roomId);
        await this.setState({playerList: !this.state.playerList});
    }
    
    // player List 조회 새로고침
    async onRefreshPlayerList() {
        console.log('111')
        const roomId = sessionStorage.getItem(RoomMakeRoomID);
        this.state.roomUser = await this.props.roomUserStore.getRoomUserList(roomId);
    }
    
    // 방송 일시정지
    onPause() {
        this.setState({pause: !this.state.pause});
        const pauseBtn = document.getElementById('pause');
        if (this.state.pause) {
            pauseBtn.innerText = '방송 일시정지';
        } else {
            pauseBtn.innerText = '방송 다시 시작';
        }
    }
    
    render() {
        return (
            <div style={{marginTop: "64px", width: '100%'}}>
                <Grid container direction='row'>
                    <Grid item sm>
                        <Grid item sm>
                            <Box bgcolor='lightgray' color="info.contrastText"
                                 style={{height: '50vh', textAlign: 'center'}}>
                                <div>
                                    {/*<div style={{textAlign: 'center', padding:'0px'}}>*/}
                                    {/*    <h1 style={{color: "red"}}>여기는 publisher</h1>*/}
                                    {/*</div>*/}
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
                                            {/* <video
                                id="peerFace"
                                autoPlay
                                playsInline
                                width={400}
                                height={400}></video> */}
                                        </div>
                                    </div>
                                
                                </div>
                            
                            </Box>
                        </Grid>
                        <Grid item sm>
                            {/*<Box bgcolor='text.disabled' color="info.contrastText" style={{height: '43.8vh', textAlign:'center', verticalAlign:'middle'}}>*/}
                            <Box color="info.contrastText"
                                // style={{height: '43.8vh', textAlign: 'center'}}>
                                 style={{textAlign: 'center'}}>
                                
                                <div
                                    id="BtnOptionBox"
                                    style={{
                                        borderStyle: 'solid',
                                        borderColor: 'red',
                                        float      : 'left',
                                        width      : '70%',
                                        height     : '250px'
                                    }}
                                    // hidden={true}
                                >
                                    <h1 style={{color: 'black'}}> 방송 세팅 </h1>
                                    <button
                                        id="videoBtnTag"
                                        style={{fontSize: "25px"}}
                                        onClick={this.onVideoOnOff.bind(this)}
                                    >
                                        카메라 끄기
                                    </button>
                                    
                                    <button
                                        id="muteBtnTag"
                                        style={{fontSize: "25px", marginLeft: '15px'}}
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
                                </div>
                                
                                
                                <div style={{
                                    borderStyle: 'solid',
                                    borderColor: 'blue',
                                    textAlign  : "center",
                                    float      : 'left',
                                    width      : '30%',
                                    height     : '250px',
                                    display    : 'flex'
                                }}>
                                    {this.state.standBy
                                        ?
                                        <div
                                            style={{margin: 'auto'}}
                                        >
                                            <button
                                                style={{fontSize: "25px"}}
                                                onClick={this.onStandBy.bind(this)}>
                                                방송 준비 완료
                                            </button>
                                        </div>
                                        
                                        :
                                        this.state.view
                                            ?
                                            <div
                                                style={{margin: 'auto'}}
                                            >
                                                <button
                                                    style={{fontSize: "25px", margin: 'auto'}}
                                                    onClick={this.onServerPublisherConnection.bind(this)}>
                                                    방송 시작
                                                </button>
                                            </div>
                                            :
                                            <div style={{margin: 'auto'}}>
                                                <button
                                                    id={'pause'}
                                                    style={{fontSize: "25px"}}
                                                    onClick={this.onPause.bind(this)}
                                                >
                                                    방송 일시정지
                                                </button>
                                                <button
                                                    style={{marginLeft: '15px', fontSize: "25px"}}
                                                >
                                                    방송 끝내기
                                                </button>
                                            </div>
                                    }
                                
                                
                                </div>
                            </Box>
                        </Grid>
                        
                        <Grid item sm>
                            {
                                this.state.playerList
                                    ?
                                    <div>
                                        <PlayerList onRefreshPlayerList={this.onRefreshPlayerList.bind(this)}
                                                    roomUserList={this.state.roomUser}/>
                                    </div>
                                    :
                                    ""
                            }
                        </Grid>
                    
                    
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box bgcolor='lightslategray' color="info.contrastText"
                             style={{height: '93.8vh', boxSizing: 'border-box'}}>
                            {/*<div>안녕하세요.</div>*/}
                            {/*<div>lerumsssssssdfdsfsdflerumslerumsssssssdfdsfsdflerumslerumsssssssdfdsfsdflerumslerumsssssssdfdsfsdflerums</div>*/}
                        </Box>
                    </Grid>
                </Grid>
            </div>
        );
    }
    
    
}


export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'roomUserStore', 'authStore')(
                observer(PublisherRoom)
            )
        )
    )
);