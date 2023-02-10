import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import moonPicture from '../assets/images/moon.jpg'
import {RoomMakeRoomID} from "../repositories/Repository";
import { Grid, Box, Typography, Button, Paper } from "@mui/material";

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
            'cameraOn': true,
            'room': {},
            'view': true,
        }
    }
    
    componentDidMount() {
        this.props.handleDrawerToggle(); // SideMenu 최소화
        const roomId = sessionStorage.getItem(RoomMakeRoomID)
        console.log('roomId : ', roomId)
        this.state.room = this.props.roomStore.getSelectedRoomData(roomId);
        console.log('this.state.room : ',this.state.room)
        // console.log('주소 : ', window.location.pathname === '/publisher-room')
    }
    
    // SRS server-Publisher 연결
    async onServerPublisherConnection() {
        const streamUrl = sessionStorage.getItem(Repository.RoomMakeStreamUrl)
        await this.props.roomStore.serverPublisherConnection(streamUrl);
        this.setState({view: false})
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
    
    render() {
        return (
            <div style={{marginTop:"64px", width: '100%'}}>
                <Grid container direction='row'>
                    <Grid item sm>
                        <Grid item sm>
                            <Box bgcolor='secondary.main' color="info.contrastText" style={{height: '71vh', textAlign: 'center'}}>
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
                            <Box bgcolor='text.disabled' color="info.contrastText" style={{height: '22.8vh', textAlign:'center', verticalAlign:'middle'}}>
                                <div style={{textAlign: "center"}}>
                                    {this.state.view?
                                    <button
                                        style={{fontSize: "25px"}}
                                        onClick={this.onServerPublisherConnection.bind(this)}>
                                        방송 시작
                                    </button>:''}
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
                                </div>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box bgcolor='error.main' color="info.contrastText" style={{height: '93.8vh', boxSizing: 'border-box'}}>
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
            inject('roomStore', 'authStore')(
                observer(PublisherRoom)
            )
        )
    )
);