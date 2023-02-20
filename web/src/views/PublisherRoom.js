import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import * as Roomstore from "../stores/RoomStore"

import moonPicture from '../assets/images/moon.jpg'
import beforeStartImage from '../assets/images/notice.png'
import waitImage from '../assets/images/wait.png'
import viewLogo from '../assets/images/viewlogo.png'

import {RoomMakeRoomID} from "../repositories/Repository";
import {Box, Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow} from "@mui/material";
import PlayerList from "./PlayerList";
// import FormControlLabel from "@mui/material/FormControlLabel";
import Tab from '@mui/material/Tab';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import MicIcon from '@mui/icons-material/Mic';
import ButtonGroup from '@mui/material/ButtonGroup';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {useState} from "react";
import {styled} from '@mui/material/styles';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#b0bec5',
        // color: ,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        // color: #b0bec5,
    },
}));

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
    
    body         : {
        margin: 0
    },
    leftGrid     : {
        width: '80vw'
    },
    rightGrid    : {
        width: '20vw'
    },
    gridContainer: {
        display                     : 'grid',
        gridTemplateColumns         : '4fr 1fr',
        gridTemplateRows            : '3fr 1fr 1fr',
        gridTemplateAreas           : `
                                'view1 view2'
                                'view3 view2'
                                'view4 view2'
            `,
        [theme.breakpoints.up('xs')]: {
            gridTemplateColumns: '1fr',
            
            gridTemplateRows: '1fr 0.5fr 74px 1fr',
            
            gridTemplateAreas: `

                                'view1'
                                'view3'
                                'view4'
                                'view2'
            `,
        },
        [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: '4fr 1fr',
            
            gridTemplateRows: '800px 1fr 74px',
            
            gridTemplateAreas: `

                                'view1 view2'
                                'view3 view2'
                                'view4 view2'
            `,
            height           : '100vh'
        },
    },
    
    gridView1: {
        gridArea  : 'view1',
        paddingTop: '50px',
    },
    gridView2: {
        gridArea : 'view2',
        padding  : '55px',
        textAlign: 'center',
    },
    gridView3: {
        gridArea: 'view3',
        padding : '0 50px 10px 50px'
    },
    gridView4: {
        gridArea: 'view4'
    }
});


class PublisherRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room                : {},
            roomPlayerList      : {},
            playerList          : false,
            standBy             : true,
            view                : true,
            stream              : {},
            pause               : false,
            videoOn             : true,
            audioOff            : false,
            tabValue            : '1',
            publisherStreaming  : false,
            pannelRequestList   : [],
            pannelRequestListBar: false,
            pannelAddition      : false,
            pannelStreaming     : false
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
        this.props.roomStore.setRoom();
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
    
    // '방송 준비 완료' 버튼 누르면 -> '방송 시작' 버튼 으로 변경
    onStandBy() {
        this.setState({standBy: false});
        
    }
    
    // 방송시작 : SRS server-Publisher 연결
    async onServerPublisherConnection() {
        // room state : pending
        await this.props.roomStore.onPendingRoomState(this.props.roomStore.onRoom);
        // SRS server-Publisher 연결
        const streamUrl = sessionStorage.getItem(Repository.RoomMakeStreamUrl);
        await this.props.roomStore.serverPublisherConnection(streamUrl);
        // room state : progress & roomUser state : progress
        await this.props.roomStore.onProgressRoomState(this.props.roomStore.onRoom);
        if (this.state.roomPlayerList.length !== 0) {
            console.log("roomPlayerList : ", this.state.roomPlayerList)
            await this.props.roomUserStore.onProgressRoomUserAndHistoryByPublisher(this.props.roomStore.onRoom.id, this.state.roomPlayerList);
        }
        if (this.props.roomStore.onRoom.state === Roomstore.RoomStateType.Progress) {
            alert("방송이 시작되었습니다.")
            console.log("playerList : ", this.state.roomPlayerList);
            this.setState({view: false});
        }
        this.setState({publisherStreaming: true})
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
        const roomId = sessionStorage.getItem(RoomMakeRoomID);
        const selectPlayerList = this.props.roomUserStore.getRoomUserList(roomId);
        if (selectPlayerList !== undefined) {
            selectPlayerList
                .then((data) => {
                    this.state.roomPlayerList = data;
                    this.setState({playerList: true});
                })
        }
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
    async onComplete() {
        if (window.confirm("방송을 종료하시겠습니까?")) {
            console.log('onRoom', this.props.roomStore.onRoom);
            this.props.roomStore.onCompleteRoomState(this.props.roomStore.onRoom);
            // room state : complete & roomUser state : complete
            if (this.state.roomPlayerList !== []) {
                await this.props.roomUserStore.onCompleteRoomUserAndHistoryByPublisher(this.props.roomStore.onRoom.id, this.state.roomPlayerList);
            }
            await this.props.roomStore.onCompleteRoomState(this.props.roomStore.onRoom)
                .then(result => {
                    if (result === 1) {
                        console.log("onCompleteRoom 성공")
                        alert('세미나가 종료되었습니다.');
                        window.location.replace('/room-list');
                    } else {
                        // this.onFailedRoomState(roomData); // roomData.state = RoomStateType.Failed;
                        console.log("onCompleteRoom 실패")
                        alert('세미나가 종료되었습니다.');
                        window.location.replace('/room-list');
                    }
                })
        }
    }
    
    // 오른쪽 tab change
    handleChange = (e, value) => {
        this.setState({tabValue: value});
    };
    
    // display test
    // errorMsg(msg, error) {
    //     const errorElement = document.querySelector('#errorMsg');
    //     errorElement.innerHTML += `<p>${msg}</p>`;
    //     if (typeof error !== 'undefined') {
    //         console.error(error);
    //     }
    // }
    
    // 송출할 display 선택
    selectDisplayOption = async (e) => {
        e.preventDefault();
        await this.props.roomStore.onSelectDisplayOption();
    }
    
    // 화면 공유 정지
    endDisplaySharing = async (e) => {
        e.preventDefault();
        await this.props.roomStore.onEndDisplaySharing();
    }
    
    // 패널 추가
    addPannel = async (e, roomUser) => {
        if (!this.state.publisherStreaming) {
            alert("아직 방송 시작 전입니다.")
        } else {
            e.preventDefault();
            await this.props.roomStore.onAddPannel(roomUser);
            console.log("222111", this.props.roomStore.onPannelList);
            // pannel video에 stream 추가
            this.props.roomStore.onPannelList.map(user => {
                const videoTag = document.getElementById(`pannelVideo-${user.streamUrl}`);
                videoTag.srcObject = user.stream;
            })
        }
    }
    
    // pannel stream으로 송출 stream을 세팅
    onPannelSelection = async (e, user) => {
        e.preventDefault();
        await this.props.roomStore.setPannelStreamSelection(user);
        this.setState({pannelStreaming: true});
    }
    
    // publisher stream으로 송출 stream을 세팅
    onPublisherSelection = async (e) => {
        e.preventDefault();
        await this.props.roomStore.setPublisherStreamSelection();
        this.setState({pannelStreaming: false});
    }
// if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
//     startButton.disabled = false;
// } else {
//     errorMsg('getDisplayMedia is not supported');
// }
    
    
    render() {
        const {classes} = this.props;
        
        return (
            <div style={{marginTop: "64px", width: '100%', height: '100%', margin: '0px'}}>
                <div className={classes.gridContainer}>
                    <div className={classes.gridView1}>
                        <Box>
                            <div style={{textAlign: 'center', paddingTop: '20px'}}>
                                <div className="call">
                                    <div style={{textAlign: 'center'}}>
                                        <div>
                                            <video
                                                className={classes.myVideo}
                                                key={"myVideoTag"}
                                                id="myVideoTag"
                                                poster={waitImage}
                                                controls
                                                autoPlay
                                                playsInline
                                                style={{backgroundColor: 'black'}}
                                                width={960}
                                                height={720}
                                            >
                                            </video>
                                        
                                        
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                        
                        </Box>
                    </div>
                    <div className={classes.gridView3}>
                        
                        <h2>
                            [PUBLISHER ROOM] &nbsp;
                            Title : {this.props.roomStore.onRoom.title} &nbsp; / &nbsp;
                            Master : {this.props.roomStore.onRoom.name} &nbsp; / &nbsp;
                            State : {this.props.roomStore.onRoom.state}
                        </h2>
                        
                        <div style={{border: 'solid', height: '320px', overflow: 'auto', whiteSpace: 'nowrap'}}>
                            <div>
                                <h3 style={{display: 'inline-block', fontSize: '18px'}}>&nbsp;&nbsp;패널 대기 리스트</h3>
                                &nbsp;&nbsp;
                                {
                                    this.state.pannelStreaming ?
                                        <Button
                                            color="inherit"
                                            variant='outlined'
                                            style={{display: 'inline-block', fontSize: '18px'}}
                                            onClick={(e) => this.onPublisherSelection(e)}
                                        >publisher 영상으로 복귀
                                        </Button> :
                                        ""
                                }
                            </div>
                            
                            
                            {
                                
                                this.props.roomStore.onPannelList === undefined
                                    ?
                                    ""
                                    :
                                    this.props.roomStore.onPannelList.map((user, i) => {
                                        
                                        return (
                                            
                                            <div key={`pannelVideo-${i}`} style={{
                                                width: '250px',
                                                height: '250px',
                                                float: 'left',
                                                textAlign: 'center',
                                                margin: '0 20px 0 20px'
                                            }}>
                                                <video
                                                    id={`pannelVideo-${user.streamUrl}`}
                                                    controls
                                                    autoPlay
                                                    playsInline
                                                    width={250}
                                                    height={200}
                                                    style={{backgroundColor: 'black'}}
                                                >
                                                </video>
                                                <br/>
                                                <Button
                                                    color="inherit"
                                                    key={`pannelVideoButton-${i}`}
                                                    id={`pannelVideoButton-${user.streamUrl}`}
                                                    variant={"outlined"}
                                                    style={{height: '30px', fontSize: '18px'}}
                                                    onClick={(e) => this.onPannelSelection(e, user)}
                                                >
                                                    <h3> [{user.name}]</h3> 님을 패널로 선택
                                                </Button>
                                            </div>
                                        )
                                    })
                            }
                        
                        </div>
                        <br/>

                    
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
                                            <span>On</span></Button> :
                                        <Button style={{display: 'block'}} onClick={this.onAudioOnOff.bind(this)}>
                                            <div><MicOffIcon></MicOffIcon></div>
                                            <span>Off</span></Button>}
                                    {this.state.videoOn ?
                                        <Button onClick={this.onVideoOnOff.bind(this)} style={{display: 'block'}}>
                                            <div><VideocamIcon></VideocamIcon></div>
                                            <span>On</span></Button> :
                                        <Button style={{display: 'block'}} onClick={this.onVideoOnOff.bind(this)}>
                                            <div><VideocamOffIcon></VideocamOffIcon></div>
                                            <span>Off</span></Button>}
                                    {/*<Button startIcon={<SettingsIcon/>} style={{display: 'block'}}>*/}
                                    <Button style={{display: 'block', cursor: 'auto'}} disableTouchRipple disableRipple focusRipple>
                                        <fieldset id="options"
                                                  style={{display: 'block', marginTop: '-8px', marginBottom: '-3px'}}>
                                            <legend>송출할 화면 선택</legend>
                                            <div style={{marginTop: "-12px", marginBottom: "-12px"}}>
                                                <select id="displaySurface" defaultValue={"camera"}
                                                        onChange={this.selectDisplayOption}
                                                        style={{fontSize: "15px"}}
                                                >
                                                    <option value="camera">카메라</option>
                                                    <option value="browser">화면 공유</option>
                                                    {/*<option value="window">윈도우</option>*/}
                                                    {/*<option value="monitor">전체화면</option>*/}
                                                </select>
                                                <select
                                                    id="cameras"
                                                    hidden={false}
                                                    style={{
                                                        fontSize  : "15px",
                                                        color     : '#37474f',
                                                        width     : '120px',
                                                        marginLeft: '5px'
                                                    }}
                                                    onInput={this.onChangeVideoOption.bind(this)}
                                                ></select>
                                                <span id="endSharing" style={{
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
                                    
                                    {this.state.standBy
                                        ?
                                        <Button
                                            style={{fontSize: "25px"}}
                                            onClick={this.onStandBy.bind(this)}>
                                            방송 준비 완료
                                        </Button>
                                        
                                        :
                                        this.state.view
                                            ?
                                            <Button
                                                style={{backgroundColor: 'orange', fontSize: "25px"}}
                                                onClick={this.onServerPublisherConnection.bind(this)}>
                                                방송 시작
                                            </Button>
                                            :
                                            <>
                                                <Button
                                                    style={{fontSize: "25px"}}
                                                    id={'pause'}
                                                    onClick={this.onPause.bind(this)}
                                                >
                                                    방송 일시 정지
                                                </Button>
                                            
                                            </>
                                    }
                                    <Button
                                        style={{fontSize: "25px"}}
                                        id={'complete'}
                                        onClick={this.onComplete.bind(this)}
                                    >
                                        방송 종료
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className={classes.gridView2}>
                        <div style={{textAlign: 'center'}}>
                            <TabContext value={this.state.tabValue}>
                                <Box>
                                    <TabList onChange={(e, value) => this.handleChange(e, value)}>
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
                                                            pannelRequest={this.state.pannelRequestList}
                                                            addPannel={this.addPannel.bind(this)}
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