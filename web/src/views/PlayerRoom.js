import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import {Box, Container, Grid, Toolbar} from "@material-ui/core";


const styles = theme => ({
    mainContainer: {
        // flex: '100%',
        height: '100vh',
        // flexDirection: 'row',
        direction : 'row',
        padding: theme.spacing(1),
        backgroundColor: 'black'
    },
    subMainCon: {
        height: '80vh',
        maxWidth : '100%',
        // flexDirection: 'column',
        direction : 'column',
        backgroundColor: 'blue',
        padding: theme.spacing(1),
    },
    appBarSpacer: theme.mixins.toolbar,
    toolbar: {
        width: '100%',
    },
    leftGrid: {
        backgroundColor: 'white',
        maxWidth: '80%',
        minWidth: '60%',
        // padding: theme.spacing(1),
    },
    rightGrid: {
        backgroundColor: 'yellow',
        maxWidth:'80%',
        minWidth: '40%',
        // padding: theme.spacing(1),
    },
    leftTop: {
        flexDirection: 'row',
        backgroundColor: 'red',
        height : '80%'
    },
    leftBottom: {
        flexDirection: 'row',
        backgroundColor: 'purple',
        height : '20%'
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
    onVideoOnOff = () => {
        this.props.roomStore.setVideoOnOff();
    }
    onAudioOnOff = () => {
        this.props.roomStore.setAudioOnOff();
    }

    render() {
        const {classes} = this.props
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
            <Grid container  className={classes.mainContainer}>
                <Box>
                    <div className={classes.appBarSpacer}/>
                    <h1 style={{color: "green"}}>여기는 player</h1>
                </Box>
                <Grid container spacing={1} className={classes.subMainCon}>
                    <Grid item  className={classes.leftGrid}>
                        <div className={classes.leftTop}>
                            <label>여기가 비디오자리</label>
                            <video
                                id="myVideoTag"
                                autoPlay
                                playsInline
                                // width={400}
                                // height={400}
                                // style={{ marginLeft: "20px" }}
                            >
                            </video>
                            <br/>


                        </div>
                        <div  className={classes.leftBottom}  > {/* style={{ textAlign: "center" }} */}
                            <span>
                                <button
                                    // style={{ fontSize: "25px" }}
                                    onClick={this.onServerPlayerConnection.bind(this)}>
                                    방송 시청
                                </button>
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
                                <button
                                    id="muteBtnTag"
                                    style={{fontSize: "25px", marginLeft:'15px'}}
                                    // onClick={this.onAudioOnOff.bind(this)}
                                >
                                나가기
                            </button>

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
                                    </span>
                        </div>
                    </Grid>
                    <Grid item  className={classes.rightGrid}>
                        <div>여기가 채팅자리</div>
                    </Grid>
                </Grid>
            </Grid>
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