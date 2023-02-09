import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import moonPicture from '../assets/images/moon.jpg'
import {RoomMakeRoomID} from "../repositories/Repository";

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
            'cameraOn': true,
            'room': {}
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

export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'authStore')(
                observer(PublisherRoom)
            )
        )
    )
);