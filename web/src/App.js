import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {withStyles} from "@material-ui/core/styles";
import {CircularProgress} from "@material-ui/core";

import {Box, CssBaseline} from "@material-ui/core";
import {styles} from './AppStyles';
import * as store from "./stores/AuthStore";
// components
import TopBar from "./components/TopBar";
import SideMenu from "./components/SideMenu";
import ScrollToTop from "./components/ScrollToTop";
// views
import SignUp from "./views/SignUp";
import Home from "./views/Home";
import SignIn from "./views/SignIn";
import RoomMake from "./views/RoomMake";
import RoomList from "./views/RoomList";
import RoomListVer2 from "./views/RoomListVer2";
import RoomHistory from "./views/RoomHistory";
import Notfound from './views/Notfound'
import PublisherRoom from "./views/PublisherRoom";
import PlayerRoom from "./views/PlayerRoom";
// import {AuthTokenStorageKey} from "./repositories/Repository";


class App extends React.Component {
    constructor(props) {
        super(props);
        // state
        this.state = {
            mobileOpen: false,
            menuOpen  : true,
            signupOpen: false,
            interval : true
        };
        
        this.setMobileOpen = this.setMobileOpen.bind(this); // this를 명시적으로
    }
    
    // mount할 때 로그인 체크
    componentDidMount() {
        console.log("mount")
        setInterval(()=>{
            this.setState({interval : false})
        },50)
        this.props.authStore.checkLogin();
    }
    
    // setState
    setMobileOpen(mobileOpen) {
        this.setState({mobileOpen: mobileOpen});
    }
    
    setSignupOpen = (signupOpen) => {
        this.setState({signupOpen: signupOpen})
    }
    
    
    handleDrawerToggle = () => {
        this.setState({menuOpen: !this.state.menuOpen});
    }
    
    // render
    render() {
        const {classes} = this.props;
        const {loginState, loginUser, signupUser, doSignup} = this.props.authStore;
        return (
            <>
            {
                this.state.interval === true
                ?
                    <div><h1> waiting...</h1>
                        <CircularProgress size={22}/>
                    </div>
                :
                    <Box className={classes.root} display="flex" flexDirection="row" justifyContent="center"
                         alignItems="stretch">
                        <Router>
                            <CssBaseline/>
                            <Route path="/" component={ScrollToTop}>
                                <TopBar mobileOpen={this.state.mobileOpen}
                                        menuOpen={this.state.menuOpen}
                                        setMobileOpen={this.setMobileOpen}
                                        user={loginUser}
                                        isLoggedIn={loginState === store.State.Authenticated}
                                        doLogout={() => this.props.authStore.doLogout()}
                                        roomTitle={this.state.roomTitle}/>
                                <SideMenu handleDrawerToggle={this.handleDrawerToggle}
                                          menuOpen={this.state.menuOpen}
                                          user={loginUser}
                                          isLoggedIn={loginState === store.State.Authenticated}/>
                    
                                { loginState === store.State.Authenticated ? (
                        
                                    <Switch>
                                        <Route path="/home" component={Home}/>
                                        <Route exact path="/" component={Home}/>
                                        <Route path="/room-make" component={RoomMake}/>
                                        {/*<Route path="/room-list" component={RoomList}/>*/}
                                        <Route path="/room-list" component={RoomListVer2}/>
                                        <Route path="/room-history" component={RoomHistory}/>
                                        <Route path="/publisher-room" render={()=><PublisherRoom handleDrawerToggle={this.handleDrawerToggle}/>} />
                                        <Route path="/player-room" render={()=><PlayerRoom handleDrawerToggle={this.handleDrawerToggle}/>}/>
                                        <Route component={Notfound}/>
                                    </Switch>
                    
                                ) : (
                                    this.state.signupOpen === false
                                        ?
                                        <Route path="/" render={() => <SignIn signupOpen={this.state.signupOpen}
                                                                              setSignupOpen={this.setSignupOpen}/>}/>
                                        :
                                        <Route path="/" render={() => <SignUp signupOpen={this.state.signupOpen}
                                                                              setSignupOpen={this.setSignupOpen}/>}/>
                    
                                )}
                            </Route>
                        </Router>
                    </Box>
            }
            </>
        );
    }
};

export default withStyles(styles)( // 적용한 styles는 class내 return 구문에서 this.props.classes로 사용할 수 있다
    inject('authStore')(
        observer(App)
    )
);

