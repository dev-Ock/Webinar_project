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
    leftGrid : {
        width : '80vw'
    },
    rightGrid : {
        width : '20vw'
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
        this.props.roomStore.getSelectedRoom(roomId)
        // 방송 기본 세팅
        const stream = this.props.roomStore.setRoom();
        stream.then(data => this.setState({stream : data}));
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
            pauseBtn.innerText = '방송 일시정지';
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
            <div style={{marginTop: "64px", width: '100%'}}>
                <Grid container direction='row'>
                    <Grid item xs className={classes.leftGrid}>
                        <Grid item sm>
                            <Box bgcolor='black' color="info.contrastText"
                                 style={{height: '52vh', textAlign: 'center'}}>
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
                                                    width={700}
                                                    // height='100%'
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
                                        width      : '20%',
                                        height     : '300px',
                                        // backgroundColor:'black'
                                    }}
                                >
                                    <h1 style={{color: '#455a64'}}> 방송 세팅 </h1>
                                    <div>
                                    <Box style={{textAlign: 'center'}}>
                                        <FormControlLabel
                                            sx={{
                                                display: 'block',
                                                
                                            }}
                                            style={{color: '#37474f'}}
                                            label="Video"
                                            control={
                                                <Switch
                                                    style={{color: '#455a64'}}
                                                    checked={this.state.videoOn}
                                                    onChange={this.onVideoOnOff.bind(this)}
                                                    name="loading"
                                                    color="primary"
                                                />
                                            }
                                        />
                                        
                                        <FormControlLabel
                                            sx={{
                                                display: 'block',
                                                
                                            }}
                                            style={{color: '#37474f'}}
                                            label="Audio"
                                            control={
                                                <Switch
                                                    style={{color: '#455a64'}}
                                                    checked={this.state.audioOff}
                                                    onChange={this.onAudioOnOff.bind(this)}
                                                    name="loading"
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </Box>
                                    </div>
                                    <br/>
                                    <select
                                        id="cameras"
                                        style={{fontSize: "16px", color: '#37474f', width:'200px'}}
                                        onInput={this.onChangeVideoOption.bind(this)}
                                    ></select>
                                    <br/>
                                    <br/>
                                    {this.state.standBy
                                        ?
                                        <div
                                            style={{margin: 'auto'}}
                                        >
                                            <Button
                                                style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '4px', borderColor:"#90a4ae", color:"#546e7a" }}
                                                variant="outlined"
                                                onClick={this.onStandBy.bind(this)}>
                                                방송 준비 완료
                                            </Button>
                                        </div>
                                        
                                        :
                                        this.state.view
                                            ?
                                            <div
                                                style={{margin: 'auto'}}
                                            >
                                                <Button
                                                    style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '2px', borderColor:"#90a4ae", color:"white",backgroundColor: "#90a4ae"}}
                                                    variant="contained"
                                                    onClick={this.onServerPublisherConnection.bind(this)}>
                                                    방송 시작
                                                </Button>
                                            </div>
                                            :
                                            <div style={{margin: 'auto'}}>
                                                <Button
                                                    id={'pause'}
                                                    style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '2px', borderColor:"#90a4ae", color:"white",backgroundColor: "#90a4ae"}}
                                                    variant="contained"
                                                    onClick={this.onPause.bind(this)}
                                                >
                                                    방송 일시정지
                                                </Button>
                                                &nbsp;
                                                <Button
                                                    style={{fontSize: "17px", fontWeight:"bolder", borderStyle:'solid',borderWidth : '2px', borderColor:"#90a4ae", color:"white",backgroundColor: "#90a4ae"}}
                                                    variant="contained"
                                                    onClick={this.onComplete.bind(this)}
                                                >
                                                    방송 끝내기
                                                </Button>
                                            </div>
                                    }
                                    <br/>
                                    {/*<Button*/}
                                    {/*    variant="contained" color="primary"*/}
                                    {/*    onClick={this.onPlayerList.bind(this)}*/}
                                    {/*>*/}
                                    {/*    player 명단*/}
                                    {/*</Button>*/}
                                </div>
                                
                                
                                <div style={{
                                    borderStyle: 'solid',
                                    borderColor: 'blue',
                                    textAlign  : "center",
                                    float      : 'left',
                                    width      : '80%',
                                    height : '300px',
                                    display: 'flex'
                                }}>
                                    <h1>hello</h1>
                                
                                
                                </div>
                            </Box>
                        </Grid>
                    
                    
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box bgcolor='white' color="info.contrastText" sx={{ typography: 'body1' }}
                             style={{height: '93vh', boxSizing: 'border-box', color: 'black'}}>
    
                            <TabContext value={this.state.tabValue}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={(e, value)=>this.handleChange(e, value)} >
                                        <Tab label="Player List" value="1" />
                                        <Tab label="Chat" value="2" />
                                    </TabList>
                                </Box>
                               
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
                                <TabPanel value= "2" > preparing </TabPanel>
                            </TabContext>
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