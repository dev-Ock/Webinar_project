import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import {Box, Container, Grid, Toolbar, useMediaQuery} from "@material-ui/core";
import {maxWidth} from "@mui/system";
import {RoomMakeRoomID, RoomViewRoomID} from "../repositories/Repository";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Tab from "@mui/material/Tab";
import PlayerList from "./PlayerList";

import {Button} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import SettingsIcon from "@mui/icons-material/Settings";
import ButtonGroup from "@mui/material/ButtonGroup";


const styles = theme => ({
    mainContainer: {
        // flex: '100%',
        height: '100vh',
        display: 'flex',
        // flexDirection: 'row',
        direction: 'row',
        padding: theme.spacing(3),
        backgroundColor: 'black',
        width: 'calc(100%-appBarSpacer)'
    },

    appBarSpacer: theme.mixins.toolbar,
    toolbar: {
        width: '100%',
    },
    body: {
        margin: 0
    },

    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '4fr 1fr',
        gridTemplateRows: '3fr 1fr 1fr 1fr',
        gridTemplateAreas: `
                                'view1 view2'
                                'view3 view2'
                                'view4 view2'
                                'view5 view2'           
            `,
        [theme.breakpoints.up('xs')]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: '600px 200px 200px 74px 1fr',
            gridTemplateAreas: `
                                'view1'
                                'view3'
                                'view4'
                                'view2'
            `,
        },
        [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: '4fr 1fr',
            gridTemplateRows: '3fr 1fr 74px',
            gridTemplateAreas: `
                                'view1 view2'
                                'view3 view2'
                                'view4 view2'
            `,
            height: '100vh'
        },
    },
    gridView1: {
        gridArea: 'view1',
        background: 'red',
        padding: '50px',
    },
    gridView2: {
        gridArea: 'view2',
        background: 'pink',
        padding: '55px',
        textAlign: 'center'
    },
    gridView3: {
        gridArea: 'view3',
        background: 'blue',
        padding: '50px'
    },
    gridView4: {
        gridArea: 'view4',
        background: 'grey',
    }


});

class PlayerRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connection: true,
            stream: "",
            videoOn: true,
            audioOff: false,
            tabValue: '1',
            playerList: false,
            room: {},
            roomPlayerList: {},
            view: true,//필요없음
            pause: false //일시정지라서 필요없을 듯
        }
    }

    componentDidMount() {
        this.props.handleDrawerToggle(); // SideMenu 최소화
        //발표참여
        const roomId = sessionStorage.getItem(RoomViewRoomID);
        console.log('id확인',roomId)
        this.state.room = this.props.roomStore.getSelectedRoom(roomId);
        console.log('this.state.room : ', this.state.room);
        //undefined 뜸
        // const onRoom = this.props.roomStore.setRoomTitleAndPublisherName();
        // console.log('플레이어룸정보확인',onRoom)
        // // 방송 기본 세팅 현재 충돌이 일어나는 듯
        // const handStream = this.props.roomStore.setRoom();
        // handStream.then(data => this.setState({handStream: data}));
        // console.log('스트림테스트',handStream)
        // const selectPlayerList = this.props.roomUserStore.getRoomUserList(roomId);
        // selectPlayerList
        //     .then((data) => {
        //         this.state.roomUser = data;
        //     })
        //     .then((data) => {
        //         this.setState({playerList: !this.state.playerList});
        //     })


    }

    handleSubmitHandsUp = async (e) => {
        e.preventDefault()
        const data = {
            playerId: this.props.authStore.loginUser.id,
            roomId: sessionStorage.getItem(RoomViewRoomID)
        }
        console.log('data check hands', data)
        const handsUp = await this.props.roomUserStore.handsUpUser(data)
        console.log('data check hands', handsUp)
    }


    // SRS server-Player 연결 //퍼블리셔와 함께 쓰면 에러가 난다.
    onServerPlayerConnection() {
        const streamUrl = sessionStorage.getItem(Repository.RoomViewStreamUrl);
        this.props.roomStore.serverPlayerConnection(streamUrl);
        this.setState({connection: false});
    }

    // SRS server-발표자 연결
    // async onServerPublisherConnection() {
    //     console.log("clk check")
    //     // room state : pending
    //     await this.props.roomStore.onPendingRoomState(this.props.roomStore.onRoom);
    //     const streamUrl = sessionStorage.getItem(Repository.RoomViewStreamUrl);
    //     // SRS server-Publisher 연결 재사용(스트림url은 생성하는 걸루 붙일 예정)
    //     await this.props.roomStore.serverPublisherConnection(streamUrl);
    //     // room state : progress
    //     await this.props.roomStore.onProgressRoomState(this.props.roomStore.onRoom);
    //     this.setState({view: false});
    // }

    onVideoOnOff2 = () => {
        this.props.roomStore.setVideoOnOff2();
    }
    onAudioOnOff2 = () => {
        this.props.roomStore.setAudioOnOff2();
    };

    async onChangeVideoOption() {
        await this.props.roomStore.setChangeVideoOption();
    };

    // player List 조회 새로고침
    async onRefreshPlayerList() {
        console.log('111')
        const roomId = sessionStorage.getItem(RoomMakeRoomID);
        this.state.roomUser = await this.props.roomUserStore.getRoomUserList(roomId);
    };

    // onPause() { //필요없을 듯. 발표자는 일시정지가 필요없는거 같다
    //     this.setState({pause: !this.state.pause});
    //     const pauseBtn = document.getElementById('pause');
    //     if (this.state.pause) {
    //         pauseBtn.innerText = '방송 일시정지';
    //     } else {
    //         pauseBtn.innerText = '방송 다시 시작';
    //     }
    // };
    // 오른쪽 tab change
    handleChange = (e, value) => {
        this.setState({tabValue: value})
    };

    render() {
        const {classes} = this.props;
        const {onRoom} = this.props.roomStore;
        return (
            <div style={{marginTop: "64px", width: '100%', height: '100%', margin: '0px'}}>
                <div className={classes.gridContainer}>
                    <div className={classes.gridView1}>
                        <Box>
                            <div style={{textAlign: 'center', paddingTop: '20px'}}>
                                <h2>세미나 제목 : {onRoom.title}</h2>
                                <div style={{textAlign: 'center'}}>
                                    <div>
                                        {/*온트랙에서 getElementById와 맞춘 곳으로 비디오가 재생된다*/}
                                        <video
                                            id="myVideoTag"
                                            autoPlay
                                            playsInline
                                            width={400}
                                            height={400}
                                            style={{marginLeft: "20px"}}
                                        >
                                        </video>
                                        {/*<video*/}
                                        {/*    id="peerFace"*/}
                                        {/*    // autoPlay*/}
                                        {/*    playsInline*/}
                                        {/*    width={400}*/}
                                        {/*    height={400}></video>*/}
                                    </div>
                                </div>

                            </div>

                        </Box>
                    </div>
                    <div className={classes.gridView3}>
                        참여자
                        <video
                            id="peerFace"
                            autoPlay
                            playsInline
                            width={150}
                            height={100}></video>
                        {/*<video*/}
                        {/*    id="myVideoTag"*/}
                        {/*    autoPlay*/}
                        {/*    playsInline*/}
                        {/*    width={250}*/}
                        {/*    height={200}*/}
                        {/*    style={{marginLeft: "20px"}}*/}
                        {/*>*/}
                        {/*</video>*/}

                    </div>
                    <div className={classes.gridView4}>
                        {/*<Box bgcolor='text.disabled' color="info.contrastText" style={{height: '43.8vh', textAlign:'center', verticalAlign:'middle'}}>*/}
                        <div style={{textAlign: 'center'}}>

                            <div
                                id="BtnOptionBox"
                            >
                                <ButtonGroup variant="outlined" aria-label="outlined primary button group" size="large" color="inherit">
                                    {this.state.audioOff ? <Button onClick={this.onAudioOnOff2.bind(this)} style={{display: 'block'}}><div><MicIcon></MicIcon></div><span>Mute</span></Button>:<Button style={{display: 'block'}} onClick={this.onAudioOnOff2.bind(this)}><div><MicOffIcon></MicOffIcon></div><span>Unmute</span></Button>}
                                    {this.state.videoOn ? <Button onClick={this.onVideoOnOff2.bind(this)} style={{display: 'block'}}><div><VideocamIcon></VideocamIcon></div><span>Start cam</span></Button>:<Button style={{display: 'block'}} onClick={this.onVideoOnOff2.bind(this)}><div><VideocamOffIcon></VideocamOffIcon></div><span>Stop cam</span></Button>}
                                    <Button
                                        style={{fontSize: "25px"}}
                                        onClick={this.onServerPlayerConnection.bind(this)}>
                                        방송 시청
                                    </Button>
                                    <Button
                                        style={{fontSize: "25px"}}
                                        onClick={(e)=>this.handleSubmitHandsUp(e)}
                                    > 요청
                                    </Button>
                                    <Button
                                        style={{fontSize: "25px"}}
                                        // onClick={this.onPause.bind(this)}
                                    >
                                        세팅
                                    </Button>
                                </ButtonGroup>


                            </div>
                        </div>
                    </div>

                    <div className={classes.gridView2}>
                        <div style={{textAlign: 'center'}}>
                            <TabContext value={this.state.tabValue}>
                                <Box>
                                    <TabList onChange={(e, value)=>this.handleChange(e, value)} >
                                        <Tab label="Player List" value="1" />
                                        <Tab label="Chat" value="2" />
                                    </TabList>
                                </Box>
                                <div style={{width: '430px', textAlign: 'center'}}>
                                    <TabPanel value= "1" style={{padding: '0px'}}>

                                        {
                                            this.state.playerList
                                                ?
                                                <PlayerList onRefreshPlayerList={this.onRefreshPlayerList.bind(this)}
                                                            roomUserList={this.state.roomUser}/>
                                                :
                                                ""
                                        }

                                    </TabPanel>
                                    <TabPanel value= "2" >
                                        <div style={{width: '380px', backgroundColor: 'white', height: '80vh'}}>채팅창</div>
                                        <div style={{textAlign: 'center'}}>
                                            <div style={{marginTop: '3px'}}><input placeholder="내용을 입력해주세요." style={{width: '300px', margin: '5px'}}></input><Button variant="contained">전송</Button></div>
                                        </div></TabPanel>
                                </div>
                            </TabContext>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


}

export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'authStore', 'roomUserStore')(
                observer(PlayerRoom)
            )
        )
    )
);