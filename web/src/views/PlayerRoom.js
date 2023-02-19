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
import waitImage from '../assets/images/wait.png'

import {Button} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import SettingsIcon from "@mui/icons-material/Settings";
import ButtonGroup from "@mui/material/ButtonGroup";
import {EmptyRoomUserDetail} from "../stores/RoomUserStore";


const styles = theme => ({
    mainContainer: {
        // flex: '100%',
        height : '100vh',
        display: 'flex',
        // flexDirection: 'row',
        direction      : 'row',
        padding        : theme.spacing(3),
        backgroundColor: 'black',
        width          : 'calc(100%-appBarSpacer)'
    },
    
    appBarSpacer: theme.mixins.toolbar,
    toolbar     : {
        width: '100%',
    },
    body        : {
        margin: 0
    },
    
    gridContainer: {
        display                     : 'grid',
        gridTemplateColumns         : '4fr 1fr',
        gridTemplateRows            : '3fr 1fr 1fr 1fr',
        gridTemplateAreas           : `
                                'view1 view2'
                                'view3 view2'
                                'view4 view2'
                                'view5 view2'           
            `,
        [theme.breakpoints.up('xs')]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows   : '1fr 0.5fr 74px 1fr',
            gridTemplateAreas  : `
                                'view1'
                                'view3'
                                'view4'
                                'view2'
            `,
        },
        [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: '4fr 1fr',
            gridTemplateRows   : '800px 1fr 74px',
            gridTemplateAreas  : `
                                'view1 view2'
                                'view3 view2'
                                'view4 view2'
            `,
            height             : '100vh'
        },
    },
    gridView1    : {
        gridArea: 'view1',
        padding : '50px',
    },
    gridView2    : {
        gridArea : 'view2',
        padding  : '55px',
        textAlign: 'center'
    },
    gridView3    : {
        gridArea: 'view3',
        height  : '100%',
    },
    gridView4    : {
        gridArea: 'view4',
    }
    
    
});

class PlayerRoom extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            connection          : true,
            stream              : "",
            publishingVideoOn             : true,
            publishingAudioOff            : false,
            playingVideoOn            : true,
            playingAudioOff           : false,
            tabValue            : '1',
            playerList          : false,
            room                : {},
            roomPlayerList      : {},
            // playerUrl           : '',
            pannelRequestList   : [], //명단 용
            pannelRequestListBar: false,
            view                : true,//필요없음
            pause               : false //일시정지라서 필요없을 듯
        }
    }
    
    componentDidMount() {
        // SideMenu 최소화
        this.props.handleDrawerToggle();
        
        // room 데이터 조회
        const roomId = sessionStorage.getItem(RoomViewRoomID);
        this.state.room = this.props.roomStore.getSelectedRoom(roomId);
        console.log('this.state.room : ', this.state.room);
        // 방송 기본 세팅
        this.props.roomStore.playerSetRoom();
        // const stream = this.props.roomStore.setRoom();
        // stream.then(data => this.setState({stream: data}));
        // 세미나 참여한 player 조회
        const selectPlayerList = this.props.roomUserStore.getRoomUserList(roomId);
        if (selectPlayerList !== undefined) {
            selectPlayerList
                .then((data) => {
                    this.state.roomPlayerList = data;
                    this.setState({playerList: true});
                })
        }
    }
    
    // self Camera on/off
    onVideoOnOff = () => {
        this.state.videoOn = this.props.roomStore.setVideoOnOff(this.state.videoOn);
    }
    
    // self Audio on/off
    onAudioOnOff = () => {
        this.state.audioOff = this.props.roomStore.setAudioOnOff(this.state.audioOff);
    }
    
    // self camera change
    async onChangeVideoOption() {
        await this.props.roomStore.setChangeVideoOption();
    }
    
    // self 송출할 display 선택
    selectDisplayOption = async (e) => {
        e.preventDefault();
        await this.props.roomStore.onSelectDisplayOption();
    }
    
    // self 화면 공유 정지
    endDisplaySharing = async (e) => {
        e.preventDefault();
        await this.props.roomStore.onEndDisplaySharing();
    }
    
    // 발표 요청
    handleSubmitHandsUp = async (e) => {
        e.preventDefault()
        const data = {
            playerId: this.props.authStore.loginUser.id,
            roomId  : sessionStorage.getItem(RoomViewRoomID)
        }
        console.log('data check hands', data)
    
        //pannel 요청 : roomUser DB player 데이터에 streamUrl 추가
        const handsUp = await this.props.roomUserStore.handsUpUser(data)
        // this.setState({playerUrl: handsUp.streamUrl})
        // console.log('data check hands', handsUp.streamUrl)
        const streamUrl = handsUp.streamUrl;
        // console.log('같은지 테스트',streamUrl) 같음확인
        // SRS server-발표자 연결
        await this.props.roomStore.pServerPublisherConnection(streamUrl);
    }
    
    
    
    // handleSubmitHandsUp = async (e) => {
    //     e.preventDefault()
    //     const data = {
    //         playerId: this.props.authStore.loginUser.id,
    //         roomId  : sessionStorage.getItem(RoomViewRoomID)
    //     }
    //     console.log('data check hands', data)
    //
    //     //pannel 요청 : roomUser DB player 데이터에 streamUrl 추가
    //     const handsUp = await this.props.roomUserStore.handsUpUser(data)
    //     // this.setState({playerUrl: handsUp.streamUrl})
    //     // console.log('data check hands', handsUp.streamUrl)
    //     const streamUrl = handsUp.streamUrl;
    //     // console.log('같은지 테스트',streamUrl) 같음확인
    //     // SRS server-발표자 연결
    //     await this.props.roomStore.pServerPublisherConnection(streamUrl);
    // }
    //
    //
    //
    //
    // // 방송 종료
    // async handelComplete() {
    //     // window.confirm("방송에서 나가시겠습니까?");
    //     const data = {
    //         playerId: this.props.authStore.loginUser.id,
    //         roomId  : sessionStorage.getItem(RoomViewRoomID),
    //         state   : 'Complete'
    //     }
    //     console.log('나가기 테스트', data)
    //     await this.props.roomUserStore.onCreateRoomUserHistory(data)
    //     // await this.props.roomStore.onDeleteRoomUser()
    //     // await this.props.roomUserStore.playerOut()
    //     window.location.replace('/room-list');
    // };

    //
    //
    // // SRS server-Player 연결 방송시청
    // onServerPlayerConnection() {
    //     const streamUrl = sessionStorage.getItem(Repository.RoomViewStreamUrl);
    //     this.props.roomStore.serverPlayerConnection(streamUrl);
    //     this.setState({connection: false});
    // }
    //
    //
    // onVideoOnOff2 = () => {
    //     this.props.roomStore.setVideoOnOff2();
    // }
    // onAudioOnOff2 = () => {
    //     this.props.roomStore.setAudioOnOff2();
    // };
    // //송출용
    // pOnVideoOnOff = () => {
    //     // this.props.roomStore.playerSetVideoOnOff();
    //     this.state.pVideoOn = this.props.roomStore.playerSetVideoOnOff(this.state.pVideoOn);
    // }
    // pOnAudioOnOff = () => {
    //     // this.props.roomStore.playerSetAudioOnOff2();
    //     this.state.pAudioOff = this.props.roomStore.playerSetAudioOnOff(this.state.pAudioOff)
    // };
    
    // async onChangeVideoOption() {
    //     await this.props.roomStore.playerSetChangeVideoOption();
    // };
    
    // player List 조회 새로고침
    async onRefreshPlayerList() {
        const roomId = sessionStorage.getItem(RoomViewRoomID);
        const selectPlayerList = this.props.roomUserStore.getRoomUserList(roomId);
        console.log('player room selectPlayerList', roomId)
        if (selectPlayerList !== undefined) {
            selectPlayerList
                .then((data) => {
                    this.state.roomPlayerList = data;
                    this.setState({playerList: true});
                })
        }
    }
    
    // 오른쪽 tab change
    handleChange = (e, value) => {
        this.setState({tabValue: value})
    };
    
    // 플레이어가 송출할 display 선택
    // selectDisplayOption = async (e) => {
    //     e.preventDefault();
    //     await this.props.roomStore.playerOnSelectDisplayOption();
    // }
    
    // camera change
    // async onChangeVideoOption() {
    //     await this.props.roomStore.playerSetChangeVideoOption();
    // };
    
    pSelectDislayOption = async (e) => {
        e.preventDefault();
        await this.props.roomStore.playerOnSelectDisplayOption()
    };
    pEndDeisplaySharing = async (e) => {
        e.preventDefault();
        await this.props.roomStroe.playerOnEndDisplaySharing();
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
                                <h2>PLAYER ROOM &nbsp; / &nbsp; Title
                                    : {onRoom.title} &nbsp; / &nbsp; Master: {onRoom.name}</h2>
                                <div style={{textAlign: 'center'}}>
                                    <div style={{overflowY: 'hidden'}}>
                                        {/*온트랙에서 getElementById와 맞춘 곳으로 비디오가 재생된다*/}
                                        <video
                                            id="playingVideoTag"
                                            autoPlay
                                            controls
                                            playsInline
                                            style={{backgroundColor: 'black'}}
                                            width={900}
                                            height={600}
                                        >
                                        
                                        </video>
                                    </div>
                                </div>
                            
                            </div>
                        
                        </Box>
                    </div>
                    <div className={classes.gridView3}>
                        <video
                            key={"playerVideoTag"}
                            id="playerVideoTag"
                            poster={waitImage}
                            autoPlay
                            controls
                            playsInline
                            width={250}
                            height={200}
                            style={{marginLeft: "20px", backGroundColor: 'black'}}
                        >
                        </video>
                    
                    </div>
                    <div className={classes.gridView4}>
                        {/*<Box bgcolor='text.disabled' color="info.contrastText" style={{height: '43.8vh', textAlign:'center', verticalAlign:'middle'}}>*/}
                        <div style={{textAlign: 'center'}}>
                            
                            <div
                                id="BtnOptionBox"
                            >
                                <br/>
                                <ButtonGroup variant="outlined" aria-label="outlined primary button group" size="large"
                                             color="inherit">
                                    {this.state.audioOff ?
                                        <Button onClick={this.onAudioOnOff.bind(this)} style={{display: 'block'}}>
                                            <div><MicIcon></MicIcon></div>
                                            <span></span></Button> :
                                        <Button style={{display: 'block'}} onClick={this.onAudioOnOff.bind(this)}>
                                            <div><MicOffIcon></MicOffIcon></div>
                                            <span></span></Button>}
                                    {this.state.videoOn ?
                                        <Button onClick={this.onVideoOnOff.bind(this)} style={{display: 'block'}}>
                                            <div><VideocamIcon></VideocamIcon></div>
                                            <span></span></Button> :
                                        <Button style={{display: 'block'}} onClick={this.onVideoOnOff.bind(this)}>
                                            <div><VideocamOffIcon></VideocamOffIcon></div>
                                            <span></span></Button>}
                                    {/*<Button startIcon={<SettingsIcon/>} style={{display: 'block'}}>*/}
                                    <Button style={{display: 'block'}}>
                                        <fieldset id="options"
                                                  style={{display: 'block', marginTop: '-8px', marginBottom: '-3px'}}>
                                            <legend>송출할 화면 선택</legend>
                                            <div style={{marginTop: "-12px", marginBottom: "-12px"}}>
                                                <select id="playerDisplaySurface" defaultValue={"camera"}
                                                        onChange={this.selectDisplayOption}
                                                        style={{fontSize: "15px"}}
                                                >
                                                    <option value="camera">카메라</option>
                                                    <option value="browser">화면 공유</option>
                                                    {/*<option value="window">윈도우</option>*/}
                                                    {/*<option value="monitor">전체화면</option>*/}
                                                </select>
                                                <select
                                                    id="playerCameras"
                                                    hidden={false}
                                                    style={{
                                                        fontSize  : "15px",
                                                        color     : '#37474f',
                                                        width     : '120px',
                                                        marginLeft: '5px'
                                                    }}
                                                    onInput={this.onChangeVideoOption.bind(this)}
                                                ></select>
                                                <span id="endPlayerSharing" style={{
                                                    fontSize       : "15px",
                                                    color          : '#37474f',
                                                    backgroundColor: 'white',
                                                    paddingLeft    : '5px',
                                                    paddingRight   : '5px',
                                                    // width     : '120px',
                                                    marginLeft: '5px'
                                                }} hidden={true} onClick={this.endDisplaySharing}>공유 중지
                                        </span>
                                            </div>
                                        </fieldset>
                                    </Button>
                                    <Button
                                        style={{fontSize: "25px"}}
                                        onClick={(e) => this.handleSubmitHandsUp(e)}
                                    > 발표요청
                                    </Button>
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
                                    {/*            style={{backgroundColor: 'orange'}}*/}
                                    {/*            onClick={this.onServerPublisherConnection.bind(this)}>*/}
                                    {/*            방송 시작*/}
                                    {/*        </Button>*/}
                                    {/*        :*/}
                                    {/*        <>*/}
                                    {/*            <Button*/}
                                    {/*                id={'pause'}*/}
                                    {/*                onClick={this.onPause.bind(this)}*/}
                                    {/*            >*/}
                                    {/*                방송 일시 정지*/}
                                    {/*            </Button>*/}
                                    
                                    {/*        </>*/}
                                    {/*}*/}
                                    {/*<Button*/}
                                    {/*    id={'complete'}*/}
                                    {/*    onClick={this.onComplete.bind(this)}*/}
                                    {/*>*/}
                                    {/*    방송 종료*/}
                                    {/*</Button>*/}
                                </ButtonGroup>
                            </div>
                            
                            
                            {/*<div*/}
                            {/*    id="BtnOptionBox"*/}
                            {/*>*/}
                            {/*    <ButtonGroup variant="outlined" aria-label="outlined primary button group" size="large"*/}
                            {/*                 color="inherit">*/}
                            {/*        {this.state.audioOff ?*/}
                            {/*            <Button*/}
                            {/*                onClick={this.onAudioOnOff2.bind(this)}*/}
                            {/*                style={{display: 'block'}}>*/}
                            {/*                <div><MicIcon></MicIcon></div>*/}
                            {/*                <span>Mute</span>*/}
                            {/*            </Button>*/}
                            {/*            :*/}
                            {/*            <Button*/}
                            {/*                style={{display: 'block'}}*/}
                            {/*                onClick={this.onAudioOnOff2.bind(this)}>*/}
                            {/*                <div><MicOffIcon></MicOffIcon></div>*/}
                            {/*                <span>Unmute</span>*/}
                            {/*            </Button>}*/}
                            {/*        */}
                            {/*        {this.state.videoOn ?*/}
                            {/*            <Button*/}
                            {/*                onClick={this.onVideoOnOff2.bind(this)}*/}
                            {/*                style={{display: 'block'}}>*/}
                            {/*                <div><VideocamIcon></VideocamIcon></div>*/}
                            {/*                <span>Start cam</span>*/}
                            {/*            </Button>*/}
                            {/*            :*/}
                            {/*            <Button*/}
                            {/*                style={{display: 'block'}}*/}
                            {/*                onClick={this.onVideoOnOff2.bind(this)}>*/}
                            {/*                <div><VideocamOffIcon></VideocamOffIcon></div>*/}
                            {/*                <span>Stop cam</span>*/}
                            {/*            </Button>}*/}
                            {/*        */}
                            {/*        <Button*/}
                            {/*            style={{fontSize: "25px"}}*/}
                            {/*            onClick={this.onServerPlayerConnection.bind(this)}>*/}
                            {/*            방송 시청*/}
                            {/*        </Button>*/}
                            {/*        */}
                            {/*        <Button*/}
                            {/*            style={{display: 'block'}}>*/}
                            {/*            <fieldset*/}
                            {/*                id="playerOptions"*/}
                            {/*                style={{display: 'block', marginTop: '-8px', marginBottom: '-3px'}}>*/}
                            {/*                <legend>송출할 화면 선택</legend>*/}
                            {/*                <div style={{marginTop: "-12px", marginBottom: "-12px"}}>*/}
                            {/*                    <select*/}
                            {/*                        id="displaySurface"*/}
                            {/*                        defaultValue={"playerCamera"}*/}
                            {/*                        onChange={this.selectDisplayOption}*/}
                            {/*                        style={{fontSize: "15px"}}*/}
                            {/*                    >*/}
                            {/*                        <option value="camera">카메라</option>*/}
                            {/*                        <option value="browser">화면 공유</option>*/}
                            {/*                    </select>*/}
                            {/*                    <select*/}
                            {/*                        id="playerCameras"*/}
                            {/*                        hidden={false}*/}
                            {/*                        style={{*/}
                            {/*                            fontSize  : "15px",*/}
                            {/*                            color     : '#37474f',*/}
                            {/*                            width     : '120px',*/}
                            {/*                            marginLeft: '5px'*/}
                            {/*                        }}*/}
                            {/*                        onInput={this.onChangeVideoOption.bind(this)}*/}
                            {/*                    >*/}
                            {/*                    </select>*/}
                            {/*                    */}
                            {/*                    <span*/}
                            {/*                        id="endSharing"*/}
                            {/*                        style={{*/}
                            {/*                            fontSize       : "15px",*/}
                            {/*                            color          : '#37474f',*/}
                            {/*                            backgroundColor: 'white',*/}
                            {/*                            paddingLeft    : '5px',*/}
                            {/*                            paddingRight   : '5px',*/}
                            {/*                            // width     : '120px',*/}
                            {/*                            marginLeft: '5px'*/}
                            {/*                        }}*/}
                            {/*                        hidden={true}*/}
                            {/*                        onClick={this.pEndDeisplaySharing}>*/}
                            {/*                        공유 중지*/}
                            {/*                    </span>*/}
                            {/*                </div>*/}
                            {/*            </fieldset>*/}
                            {/*        </Button>*/}
                            {/*        */}
                            {/*        <Button*/}
                            {/*            style={{fontSize: "25px"}}*/}
                            {/*            onClick={(e) => this.handleSubmitHandsUp(e)}*/}
                            {/*        > 발표요청*/}
                            {/*        </Button>*/}
                            {/*        */}
                            {/*        {this.state.audioOff ?*/}
                            {/*            <Button*/}
                            {/*                onClick={this.pOnAudioOnOff.bind(this)}*/}
                            {/*                style={{display: 'block'}}>*/}
                            {/*                <div><MicIcon></MicIcon></div>*/}
                            {/*                <span>Mute</span>*/}
                            {/*            </Button>*/}
                            {/*            :*/}
                            {/*            <Button*/}
                            {/*                style={{display: 'block'}}*/}
                            {/*                onClick={this.pOnAudioOnOff.bind(this)}>*/}
                            {/*                <div><MicOffIcon></MicOffIcon></div>*/}
                            {/*                <span>Unmute</span>*/}
                            {/*            </Button>}*/}
                            {/*        */}
                            {/*        {this.state.videoOn ?*/}
                            {/*            <Button*/}
                            {/*                onClick={this.pOnVideoOnOff.bind(this)}*/}
                            {/*                style={{display: 'block'}}>*/}
                            {/*                <div><VideocamIcon></VideocamIcon></div>*/}
                            {/*                <span>Start cam</span>*/}
                            {/*            </Button>*/}
                            {/*            :*/}
                            {/*            <Button*/}
                            {/*                style={{display: 'block'}}*/}
                            {/*                onClick={this.pOnVideoOnOff.bind(this)}>*/}
                            {/*                <div><VideocamOffIcon></VideocamOffIcon></div>*/}
                            {/*                <span>Stop cam</span>*/}
                            {/*            </Button>}*/}
                            {/*        */}
                            {/*        <Button*/}
                            {/*            onClick={this.handelComplete.bind(this)}>*/}
                            {/*            나가기*/}
                            {/*        </Button>*/}
                            {/*    */}
                            {/*    </ButtonGroup>*/}
                            
                            
                            {/*</div>*/}
                        </div>
                    </div>
                    
                    <div className={classes.gridView2}>
                        <div style={{textAlign: 'center'}}>
                            <TabContext value={this.state.tabValue}>
                                <Box>
                                    <TabList
                                        onChange={(e, value) => this.handleChange(e, value)}>
                                        <Tab label="Player List" value="1"/>
                                        <Tab label="Chat" value="2"/>
                                    </TabList>
                                </Box>
                                <div style={{width: '430px', textAlign: 'center'}}>
                                    <TabPanel value="1" style={{padding: '0px'}}>
                                        
                                        {
                                            this.state.playerList
                                                ?
                                                <PlayerList onRefreshPlayerList={this.onRefreshPlayerList.bind(this)}
                                                            roomUserList={this.state.roomPlayerList}
                                                            roomMaximum={this.props.roomStore.onRoom.maximum}
                                                    // pannelRequest={this.state.pannelRequestList}
                                                    // addPannel={this.addPannel.bind(this)}
                                                />
                                                :
                                                ""
                                        }
                                    
                                    </TabPanel>
                                    
                                    <TabPanel value="2">
                                        <div style={{width: '380px', backgroundColor: 'white', height: '80vh'}}>채팅창
                                        </div>
                                        <div style={{textAlign: 'center'}}>
                                            <div style={{marginTop: '3px'}}><input placeholder="내용을 입력해주세요." style={{
                                                width : '300px',
                                                margin: '5px'
                                            }}></input><Button variant="contained">전송</Button></div>
                                        </div>
                                    </TabPanel>
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