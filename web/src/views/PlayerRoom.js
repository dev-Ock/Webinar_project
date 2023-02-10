import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";


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
}

class PlayerRoom extends React.Component {
    
    
    componentDidMount() {
        this.props.handleDrawerToggle(); // SideMenu 최소화
    }
    
    // SRS server-Player 연결
    async onServerPlayerConnection(){
        const streamUrl = sessionStorage.getItem(Repository.RoomViewStreamUrl)
        
        await this.props.roomStore.serverPlayerConnection(streamUrl);
    }

    render() {
        return (
            <div>
                <div style={{textAlign:'center', marginTop:'100px' }}>
                    <h1 style={{ color: "green" }}>여기는 player</h1>
                </div>
                <div className="call">
                    <div className="myStream">
                        {/* <label>my video</label> */}
                        <video
                            id="myVideoTag"
                            autoPlay
                            playsInline
                            width={600}
                            height={500}
                            style={{ marginLeft: "20px" }}
                        ></video>
                        <br />
                        <div style={{ textAlign: "center" }}>
                            <button
                                style={{ fontSize: "25px" }}
                                onClick={this.onServerPlayerConnection.bind(this)}>
                                방송 시청
                            </button>
                            <br />
                            <br />
                            {/* <button id="mutedBtnTag" onClick={this.handleMuteClick.bind(this)}>
              Mute
            </button> */}
                            <br />
                            <br />
                            {/* <button
              id="cameraBtnTag"
              onClick={this.handleCameraClick.bind(this)}>
              Turn Camera Off
            </button> */}
                            <br />
                            <br />
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
            </div>
        );
    }
    
    
}

export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('roomStore', 'authStore')(
                observer(PlayerRoom)
            )
        )
    )
);