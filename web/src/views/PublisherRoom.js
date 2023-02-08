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

class PublisherRoom extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // SRS server-Publisher 연결
    async onServerPublisherConnection(){
        const streamUrl = sessionStorage.getItem(Repository.RoomMakeStreamUrl)
        await this.props.roomStore.serverPublisherConnection(streamUrl);
    }
    
    
    render() {
        return (
            <div>
                <div style={{textAlign:'center', marginTop:'100px' }}>
                    <h1 style={{ color: "red" }}>여기는 publisher</h1>
                </div>
                <div className="call">
                    <div className="myStream">
                        {/* <label>my video</label> */}
                        <video
                            id="myVideoTag"
                            autoPlay
                            playsInline
                            width={400}
                            height={400}
                            style={{ marginLeft: "20px" }}></video>
                        <br />
                        
                        <div style={{ textAlign: "center" }}>
                            <button
                                style={{ fontSize: "25px" }}
                                onClick={this.onServerPublisherConnection.bind(this)}>
                                    방송 시작
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
                observer(PublisherRoom)
            )
        )
    )
);