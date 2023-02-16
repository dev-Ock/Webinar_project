import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import {Box, Container, Grid, Toolbar, useMediaQuery} from "@material-ui/core";
import {maxWidth} from "@mui/system";
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
    mainContainer   : {
        // flex: '100%',
        height : '100vh',
        display: 'flex',
        // flexDirection: 'row',
        direction      : 'row',
        padding        : theme.spacing(3),
        backgroundColor: 'black',
        width          : 'calc(100%-appBarSpacer)'
    },
    // subMainCon      : {
    //     height       : '80vh',
    //     maxWidth     : '100%',
    //     display      : 'flex',
    //     flexDirection: 'row',
    //     // direction: 'column',
    //     backgroundColor           : 'blue',
    //     padding                   : theme.spacing(1),
    //     flexWrap                  : 'wrap',
    //     '@media (max-width:760px)': {
    //         flexDirection: 'column',
    //     }
    // },
    // subMainConMobile: {
    //     flexDirection: 'column',
    // },
    
    appBarSpacer: theme.mixins.toolbar,
    toolbar     : {
        width: '100%',
    },
    body : {
        margin: 0
    },
    leftGrid    : {
        backgroundColor: 'white',
        // maxWidth: '100%',
        // minWidth: '70%',
        flexBasis: '70%'
        // padding: theme.spacing(1),
    },
    rightGrid   : {
        backgroundColor: 'yellow',
        display        : 'block',
        // maxWidth: '100%',
        // minWidth: '30%',
        flexBasis   : '30%',
        overflow    : 'hidden',
        textOverflow: 'ellipsis',
        flexWrap    : 'wrap'
        // padding: theme.spacing(1),
    },
    leftTop     : {
        flexDirection  : 'row',
        backgroundColor: 'red',
        height         : '80%'
    },
    leftBottom  : {
        flexDirection  : 'row',
        backgroundColor: 'purple',
        height         : '20%'
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
    
    // roomMakeImg: {
    //     width: "100%",
    //     alignItems   : 'center'
    // },
    // roomMakeImgOutDiv:{
    //     paddingTop: 70,
    //     paddingLeft: 110,
    //     paddingRight: 110,
    // }
});

class PlayerRoom extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            connection: true,
            view      : true,
            pause     : false,
            videoOn   : true,
            audioOff  : false,
            tabValue : '1',
            standBy   : true,
            playerList: false,
        }
    }
    
    componentDidMount() {
        this.props.handleDrawerToggle(); // SideMenu 최소화
        
    }
    
    // componentDidUpdate(prevProps) {
    //     if (useMediaQuery("(max-width: 600px)") !== prevProps.location.pathname) {
    //         window.scrollTo(0, 0);
    //     }
    // }
    
    // SRS server-Player 연결
    onServerPlayerConnection() {
        const streamUrl = sessionStorage.getItem(Repository.RoomViewStreamUrl);
        this.props.roomStore.serverPlayerConnection(streamUrl);
        this.setState({connection: false});
    }
    
    onVideoOnOff = () => {
        this.props.roomStore.setVideoOnOff2();
    }
    onAudioOnOff = () => {
        this.props.roomStore.setAudioOnOff2();
    }
    
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
        const {classes} = this.props
        // const isMobile = useMediaQuery("(max-width:600px)");
        return (
            //         <div>
            //             <div style={{textAlign: 'center', marginTop: '100px'}}>
            //                 <h1 style={{color: "green"}}>여기는 player</h1>
            //             </div>
            //             <div className="call">
            //                 <div className="myStream">
            //                     {/* <label>my video</label> */}
            //                     <video
            //                         id="myVideoTag"
            //                         autoPlay
            //                         playsInline
            //                         width={600}
            //                         height={500}
            //                         style={{marginLeft: "20px"}}
            //                     ></video>
            //                 </div>
            //                 <br/>
            //
            //                 {
            //                     this.state.connection
            //                         ?
            //                         <div style={{textAlign: "center"}}>
            //                             <button
            //                                 style={{fontSize: "25px"}}
            //                                 onClick={this.onServerPlayerConnection.bind(this)}>
            //                                 방송 시청
            //                             </button>
            //                         </div>
            //                         :
            //                         <div style={{textAlign: "center"}}>
            //                             <button
            //                                 style={{fontSize: "25px"}}
            //                             >
            //                                 화면 끄기
            //                             </button>
            //                             <button
            //                                 style={{marginLeft: '15px' ,fontSize: "25px"}}
            //                             >
            //                                 음소거
            //                             </button>
            //                         </div>
            //                 }
            //                 <br/>
            //                 <br/>
            //                 <div style={{textAlign: "center"}}>
            //                     <button
            //                         style={{fontSize: "25px"}}
            //                     >
            //                         세미나 나가기
            //                     </button>
            //                 </div>
            //             </div>
            //         </div>
            <div style={{marginTop: "64px", width: '100%', height: '100%', margin: '0px'}}>
                <div className={classes.gridContainer}>
                    <div className={classes.gridView1}>
                        <Box>
                            <div style={{textAlign: 'center', paddingTop: '20px'}}>
                                <h2>세미나 제목 : { this.props.roomStore.roomTitle}</h2>
                                <div style={{textAlign: 'center'}}>
                                    <div>
                                        <video
                                            id="myVideoTag"
                                            autoPlay
                                            playsInline
                                            width={600}
                                            height={500}
                                            // style={{marginLeft: "20px"}}
                                        ></video>
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
                                    {/*<Button startIcon={<SettingsIcon />} style={{display: 'block', cursor: 'auto'}} disableTouchRipple disableRipple focusRipple>*/}
                                    {/*    <select*/}
                                    {/*        id="cameras"*/}
                                    {/*        style={{fontSize: "16px", color: '#37474f', width:'200px'}}*/}
                                    {/*        onInput={this.onChangeVideoOption.bind(this)}*/}
                                    {/*    ></select></Button>*/}
                                    {/*{this.state.standBy*/}
                                    {/*    ?*/}
                                    {/*    <Button*/}
                                    {/*        onClick={this.onStandBy.bind(this)}>*/}
                                    {/*        방송 준비 완료*/}
                                    {/*    </Button>*/}

                                    {/*    :*/}
                                    {/*    this.state.view*/}
                                    {/*        ?*/}
                                    {/*        <Button*/}
                                    {/*            onClick={this.onServerPlayerConnection.bind(this)}>*/}
                                    {/*            방송 시작*/}
                                    {/*        </Button>*/}
                                    {/*        :*/}
                                    {/*        <Button*/}
                                    {/*            id={'pause'}*/}
                                    {/*            onClick={this.onPause.bind(this)}*/}
                                    {/*        >*/}
                                    {/*            방송 일시 정지*/}
                                    {/*        </Button>*/}

                                    {/*}*/}
                                </ButtonGroup>


                            {/*    <button*/}
                            {/*        style={{fontSize: "25px"}}*/}
                            {/*        onClick={this.onServerPlayerConnection.bind(this)}>*/}
                            {/*        방송 시청*/}
                            {/*    </button>*/}
                            {/*<button*/}
                            {/*    id="muteBtnTag"*/}
                            {/*    style={{fontSize: "25px", marginLeft: '15px'}}*/}
                            {/*    // onClick={this.onAudioOnOff.bind(this)}*/}
                            {/*>*/}
                            {/*    나가기*/}
                            {/*</button>*/}
                                    
                                    {/* <button

                                <br/>
                                <br/>
                                {/* <select
              id="cameras"
              onInput={this.handleCameraChange.bind(this)}></select> */}
                                    {/* <video
            id="peerFace"
            autoPlay
            playsInline
            width={400}
            height={400}></video> */}
                            </div>
                        </div>
                    </div>

                    <div className={classes.gridView2}>
                        <div style={{textAlign: 'center'}}>
                            {/*<TabContext value={this.state.tabValue}>*/}
                            {/*    <Box>*/}
                            {/*        <TabList onChange={(e, value)=>this.handleChange(e, value)} >*/}
                            {/*            <Tab label="Player List" value="1" />*/}
                            {/*            <Tab label="Chat" value="2" />*/}
                            {/*        </TabList>*/}
                            {/*    </Box>*/}
                            {/*    <div style={{width: '430px', textAlign: 'center'}}>*/}
                            {/*        <TabPanel value= "1" style={{padding: '0px'}}>*/}

                            {/*            {*/}
                            {/*                this.state.playerList*/}
                            {/*                    ?*/}
                            {/*                    <PlayerList onRefreshPlayerList={this.onRefreshPlayerList.bind(this)}*/}
                            {/*                                roomUserList={this.state.roomPlayerList}/>*/}
                            {/*                    :*/}
                            {/*                    ""*/}
                            {/*            }*/}

                            {/*        </TabPanel>*/}
                            {/*        <TabPanel value= "2" >*/}
                            {/*            <div style={{width: '380px', backgroundColor: 'white', height: '80vh'}}>채팅창</div>*/}
                            {/*            <div style={{textAlign: 'center'}}>*/}
                            {/*                <div style={{marginTop: '3px'}}><input placeholder="내용을 입력해주세요." style={{width: '300px', margin: '5px'}}></input><Button variant="contained">전송</Button></div>*/}
                            {/*            </div></TabPanel>*/}
                            {/*    </div>*/}
                            {/*</TabContext>*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    
}

export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'authStore')(
                observer(PlayerRoom)
            )
        )
    )
);