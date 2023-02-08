import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import axios from "axios";

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
    
    // SRS server 연결
    async onServerPublishConnection(){
        await this.props.roomStore.serverPublishConnection();
    }
    
    
    render() {
        return (
            <div>
                <h1 style={{ color: "green", marginLeft: "20px" }}>여기는 publisher</h1>
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
                                onClick={this.onServerPublishConnection.bind(this)}>
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