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
    
    constructor(props) {
        super(props);
        this.state = {
            connection: true
        }
    }
    
    componentDidMount() {
        this.props.handleDrawerToggle(); // SideMenu 최소화
        
    }
    
    // SRS server-Player 연결
    onServerPlayerConnection() {
        const streamUrl = sessionStorage.getItem(Repository.RoomViewStreamUrl);
        this.props.roomStore.serverPlayerConnection(streamUrl);
        this.setState({connection: false});
    }
    
    render() {
        return (
            <div>
                <div style={{textAlign: 'center', marginTop: '100px'}}>
                    <h1 style={{color: "green"}}>여기는 player</h1>
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
                            style={{marginLeft: "20px"}}
                        ></video>
                    </div>
                    <br/>
                    
                    {
                        this.state.connection
                            ?
                            <div style={{textAlign: "center"}}>
                                <button
                                    style={{fontSize: "25px"}}
                                    onClick={this.onServerPlayerConnection.bind(this)}>
                                    방송 시청
                                </button>
                            </div>
                            :
                            <div style={{textAlign: "center"}}>
                                <button
                                    style={{fontSize: "25px"}}
                                >
                                    화면 끄기
                                </button>
                                <button
                                    style={{marginLeft: '15px' ,fontSize: "25px"}}
                                >
                                    음소거
                                </button>
                            </div>
                    }
                    <br/>
                    <br/>
                    <div style={{textAlign: "center"}}>
                        <button
                            style={{fontSize: "25px"}}
                        >
                            세미나 나가기
                        </button>
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