import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import * as Repository from "../repositories/Repository";
import {Box, Container, Grid, Toolbar, useMediaQuery} from "@material-ui/core";
import {maxWidth} from "@mui/system";


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
    subMainCon      : {
        height       : '80vh',
        maxWidth     : '100%',
        display      : 'flex',
        flexDirection: 'row',
        // direction: 'column',
        backgroundColor           : 'blue',
        padding                   : theme.spacing(1),
        flexWrap                  : 'wrap',
        '@media (max-width:760px)': {
            flexDirection: 'column',
        }
    },
    subMainConMobile: {
        flexDirection: 'column',
    },
    
    appBarSpacer: theme.mixins.toolbar,
    toolbar     : {
        width: '100%',
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
            pause     : false
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
            <Grid container className={classes.mainContainer}>
                
                <Box>
                    <div className={classes.appBarSpacer}/>
                    
                    <h1 style={{color: "green"}}>여기는 player</h1>
                
                </Box>
                <Toolbar className={classes.toolbar}>
                    <Grid container spacing={1} className={classes.subMainCon}>
                        <Grid item className={classes.leftGrid}>
                            <div className={classes.leftTop}>
                                <label>여기가 비디오자리</label>
                                <video
                                    id="myVideoTag"
                                    autoPlay
                                    playsInline
                                    width={400}
                                    height={400}
                                    style={{marginLeft: "20px"}}
                                >
                                </video>
                                <br/>
                            
                            
                            </div>
                            <div className={classes.leftBottom}> {/* style={{ textAlign: "center" }} */}
                                <span>
                                <button
                                    style={{fontSize: "25px"}}
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
                                   style={{fontSize: "25px", marginLeft: '15px'}}
                                   onClick={this.onAudioOnOff.bind(this)}
                               >
                                음소거
                            </button>
                                                                     <button
                                                                         id={'pause'}
                                                                         style={{fontSize: "25px"}}
                                                                         onClick={this.onPause.bind(this)}
                                                                     >
                                                    방송 일시정지
                                                </button>
                            <button
                                id="muteBtnTag"
                                style={{fontSize: "25px", marginLeft: '15px'}}
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
                        <Grid item className={classes.rightGrid}>
                            <div>여기가 채팅자리</div>
                            <div>testestestestestestesetestestestestestestesetestestestestestestesetstestestestestestestesetstestestestestestestesets</div>
                        </Grid>
                    </Grid>
                </Toolbar>
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