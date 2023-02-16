import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import * as Roomstore from "../stores/RoomStore"
import moonPicture from '../assets/images/moon.jpg'
import {RoomMakeRoomID} from "../repositories/Repository";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {typography} from '@mui/system';
import {Grid, Box, Typography, Button, Paper, Switch} from "@mui/material";
import PlayerList from "./PlayerList";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tab from '@mui/material/Tab';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import MicIcon from '@mui/icons-material/Mic';
import ButtonGroup from '@mui/material/ButtonGroup';
import VideocamIcon from '@mui/icons-material/Videocam';
import SettingsIcon from '@mui/icons-material/Settings';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const styles = (theme) => ({
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
    body : {
        margin: 0
    },
    leftGrid : {
        width : '80vw'
    },
    rightGrid : {
        width : '20vw'
    },
    gridContainer : {
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
                                'view5'
                                'view2'
            `,
        },
        [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: '4fr 1fr',
            gridTemplateRows: '3fr 0.5fr 1fr 74px',
            gridTemplateAreas: `
                                'view1 view2'
                                'view3 view2'
                                'view4 view2'
                                'view5 view2'
            `,
            height: '100vh'
        },
    },
    gridView1 : {
        gridArea: 'view1',
        background: 'red',
        padding: '50px',
    },
    gridView2 : {
        gridArea: 'view2',
        background: 'pink',
        padding: '55px',
        textAlign: 'center'
    },
    gridView3 : {
        gridArea: 'view3',
        background: 'orange',
        padding: '50px'
    },
    gridView4 : {
        gridArea: 'view4',
        background: 'blue',
        padding: '50px'
    },
    gridView5 : {
        gridArea: 'view5',
        background: 'grey',
    }
});


class PublisherRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room      : {},
            roomPlayerList  : {},
            playerList: false,
            standBy   : true,
            view      : true,
            stream    : "",
            pause     : false,
            videoOn   : true,
            audioOff  : false,
            tabValue : '1'
        }
    }

    componentDidMount() {
        // SideMenu 최소화
        this.props.handleDrawerToggle();
        // room 데이터 조회
        const roomId = sessionStorage.getItem(RoomMakeRoomID);
        this.state.room = this.props.roomStore.getSelectedRoom(roomId);
        console.log('this.state.room : ', this.state.room);
        // 방송 기본 세팅
        const stream = this.props.roomStore.setRoom();
        stream.then(data => this.setState({stream : data}));
        console.log('퍼블리셔',stream);
        // 세미나 참여한 player 조회
        const selectPlayerList = this.props.roomUserStore.getRoomUserList(roomId);
        selectPlayerList
            .then((data) => {
                this.state.roomPlayerList = data;
            })
            .then((_) => {
                this.setState({playerList: !this.state.playerList});
            })
    }

    // 방송 준비
    onStandBy() {
        this.setState({standBy: false});
    }

    // SRS server-Publisher 연결
    async onServerPublisherConnection() {
        // room state : pending
        await this.props.roomStore.onPendingRoomState(this.props.roomStore.onRoom);
        const streamUrl = sessionStorage.getItem(Repository.RoomMakeStreamUrl);
        // SRS server-Publisher 연결
        await this.props.roomStore.serverPublisherConnection(streamUrl);
        // room state : progress
        await this.props.roomStore.onProgressRoomState(this.props.roomStore.onRoom);
        this.setState({view: false});
    }

    // Camera on/off
    onVideoOnOff = () => {
        this.state.videoOn = this.props.roomStore.setVideoOnOff(this.state.videoOn);
    }

    // Audio on/off
    onAudioOnOff = () => {
        this.state.audioOff = this.props.roomStore.setAudioOnOff(this.state.audioOff);
    }

    // camera change
    async onChangeVideoOption() {
        await this.props.roomStore.setChangeVideoOption();
    }

    // player List 조회 새로고침
    async onRefreshPlayerList() {
        console.log('111')
        const roomId = sessionStorage.getItem(RoomMakeRoomID);
        this.state.roomPlayerList = await this.props.roomUserStore.getRoomUserList(roomId);
    }

    // 방송 일시정지
    onPause() {
        this.setState({pause: !this.state.pause});
        const pauseBtn = document.getElementById('pause');
        if (this.state.pause) {
            pauseBtn.innerText = '방송 일시 정지';
        } else {
            pauseBtn.innerText = '방송 다시 시작';
        }
    }

    // 방송 종료
    onComplete() {
        console.log('onRoom', this.props.roomStore.onRoom)
        this.props.roomStore.onCompleteRoomState(this.props.roomStore.onRoom);
    }

    // 오른쪽 tab change
    handleChange = (e, value) => {
        this.setState({tabValue : value})
    };

    render() {
        const {classes} = this.props;

        return (
            <div style={{marginTop: "64px", width: '100%', height: '100%', margin: '0px'}}>
                <div className={classes.gridContainer}>
                    <div className={classes.gridView1}>
                        <Box>
                            <div style={{textAlign: 'center', paddingTop: '20px'}}>
                                <h2>세미나 제목 : { this.props.roomStore.roomTitle}</h2>
                                <div className="call">
                                    <div style={{textAlign: 'center'}}>
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
                    </div>

                    <div className={classes.gridView3}>
                        <div>화면 구성</div>
                    </div>
                    <div className={classes.gridView4}>
                        참여자
                    </div>

                    <div className={classes.gridView5}>
                        {/*<Box bgcolor='text.disabled' color="info.contrastText" style={{height: '43.8vh', textAlign:'center', verticalAlign:'middle'}}>*/}
                        <div style={{textAlign: 'center'}}>

                            <div
                                id="BtnOptionBox"
                            >
                                <ButtonGroup variant="outlined" aria-label="outlined primary button group" size="large" color="inherit">
                                    {this.state.audioOff ? <Button onClick={this.onAudioOnOff.bind(this)} style={{display: 'block'}}><div><MicIcon></MicIcon></div><span>Mute</span></Button>:<Button style={{display: 'block'}} onClick={this.onAudioOnOff.bind(this)}><div><MicOffIcon></MicOffIcon></div><span>Unmute</span></Button>}
                                    {this.state.videoOn ? <Button onClick={this.onVideoOnOff.bind(this)} style={{display: 'block'}}><div><VideocamIcon></VideocamIcon></div><span>Start cam</span></Button>:<Button style={{display: 'block'}} onClick={this.onVideoOnOff.bind(this)}><div><VideocamOffIcon></VideocamOffIcon></div><span>Stop cam</span></Button>}
                                    <Button startIcon={<SettingsIcon />} style={{display: 'block', cursor: 'auto'}} disableTouchRipple disableRipple focusRipple>
                                        <select
                                            id="cameras"
                                            style={{fontSize: "16px", color: '#37474f', width:'200px'}}
                                            onInput={this.onChangeVideoOption.bind(this)}
                                        ></select></Button>
                                    {this.state.standBy
                                        ?
                                        <Button
                                            onClick={this.onStandBy.bind(this)}>
                                            방송 준비 완료
                                        </Button>

                                        :
                                        this.state.view
                                            ?
                                            <Button
                                                onClick={this.onServerPublisherConnection.bind(this)}>
                                                방송 시작
                                            </Button>
                                            :
                                            <Button
                                                id={'pause'}
                                                onClick={this.onPause.bind(this)}
                                            >
                                                방송 일시 정지
                                            </Button>

                                    }
                                </ButtonGroup>
                                {/*<div style={{display: "inline-block"}}>*/}
                                {/*    <FormControlLabel*/}
                                {/*        style={{color: '#37474f'}}*/}
                                {/*        label="Video"*/}
                                {/*        control={*/}
                                {/*            <Switch*/}
                                {/*                style={{color: '#455a64'}}*/}
                                {/*                checked={this.state.videoOn}*/}
                                {/*                onChange={this.onVideoOnOff.bind(this)}*/}
                                {/*                name="loading"*/}
                                {/*                color="primary"*/}
                                {/*            />*/}
                                {/*        }*/}
                                {/*    />*/}

                                {/*    <FormControlLabel*/}
                                {/*        style={{color: '#37474f'}}*/}
                                {/*        label="Audio"*/}
                                {/*        control={*/}
                                {/*            <Switch*/}
                                {/*                style={{color: '#455a64'}}*/}
                                {/*                checked={this.state.audioOff}*/}
                                {/*                onChange={this.onAudioOnOff.bind(this)}*/}
                                {/*                name="loading"*/}
                                {/*                color="primary"*/}
                                {/*            />*/}
                                {/*        }*/}
                                {/*    />*/}
                                {/*</div>*/}


                                {/*{this.state.standBy*/}
                                {/*    ?*/}
                                {/*    <div*/}
                                {/*        style={{margin: 'auto', display: 'block'}}*/}
                                {/*    >*/}
                                {/*        <Button*/}
                                {/*            style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '4px', borderColor:"#90a4ae", color:"#546e7a"}}*/}
                                {/*            variant="outlined"*/}
                                {/*            onClick={this.onStandBy.bind(this)}>*/}
                                {/*            방송 준비 완료*/}
                                {/*        </Button>*/}
                                {/*    </div>*/}

                                {/*    :*/}
                                {/*    this.state.view*/}
                                {/*        ?*/}
                                {/*        <div*/}
                                {/*            style={{margin: 'auto'}}*/}
                                {/*        >*/}
                                {/*            <Button*/}
                                {/*                style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '2px', borderColor:"#90a4ae", color:"white",backgroundColor: "#90a4ae"}}*/}
                                {/*                variant="contained"*/}
                                {/*                onClick={this.onServerPublisherConnection.bind(this)}>*/}
                                {/*                방송 시작*/}
                                {/*            </Button>*/}
                                {/*        </div>*/}
                                {/*        :*/}
                                {/*        <div style={{margin: 'auto'}}>*/}
                                {/*            <Button*/}
                                {/*                id={'pause'}*/}
                                {/*                style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '2px', borderColor:"#90a4ae", color:"white",backgroundColor: "#90a4ae"}}*/}
                                {/*                variant="contained"*/}
                                {/*                onClick={this.onPause.bind(this)}*/}
                                {/*            >*/}
                                {/*                방송 일시정지*/}
                                {/*            </Button>*/}
                                {/*            &nbsp;*/}
                                {/*            <Button*/}
                                {/*                style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '2px', borderColor:"#90a4ae", color:"white",backgroundColor: "#90a4ae"}}*/}
                                {/*                variant="contained"*/}
                                {/*            >*/}
                                {/*                방송 끝내기*/}
                                {/*            </Button>*/}
                                {/*        </div>*/}
                                {/*}*/}
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
                                                            roomUserList={this.state.roomPlayerList}/>
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