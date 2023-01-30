import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {withStyles} from "@material-ui/core/styles";
import {Box, CssBaseline} from "@material-ui/core";
import {styles} from './AppStyles';
import * as store from "./stores/AuthStore";
// components
import TopBar from "./components/TopBar";
import SideMenu from "./components/SideMenu";
import ScrollToTop from "./components/ScrollToTop";
// views
import Mypage from "./views/Mypage";
import Administration from "./views/Administration";
import SignUp from "./views/SignUp";
import Home from "./views/Home";
import SignIn from "./views/SignIn";
import Service from "./views/Service"
import Notfound from './views/Notfound'
import {AuthTokenStorageKey} from "./repositories/Repository";
// import 2


class App extends React.Component {
    constructor(props) {
        super(props);
        // state
        this.state = {
            mobileOpen: false,
            menuOpen  : true,
            signupOpen: false,
            interval : true,
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
    
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //
    // }
    
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
        // console.log('궁금',this.props.authStore.doLogout)
        // console.log("this.props(in App.js)",this.props)
        // console.log("store (in App.js",store)
        
        return (
            <>
            {
                this.state.interval === true
                ?
                    <div><h1>waiting...</h1></div>
                :
                    <Box className={classes.root} display="flex" flexDirection="row" justifyContent="center"
                         alignItems="stretch">
                        <Router>
                            <CssBaseline/>
                            {/*<Route path="/signup" render={()=> <SignUp typeState={store.typeState} />}/>*/}
                            <Route path="/" component={ScrollToTop}>
                                <TopBar mobileOpen={this.state.mobileOpen}
                                        menuOpen={this.state.menuOpen}
                                        setMobileOpen={this.setMobileOpen}
                                        user={loginUser}
                                        isLoggedIn={loginState === store.State.Authenticated}
                                        doLogout={() => this.props.authStore.doLogout()}/>
                                <SideMenu handleDrawerToggle={this.handleDrawerToggle}
                                          menuOpen={this.state.menuOpen}
                                          user={loginUser}
                                          isLoggedIn={loginState === store.State.Authenticated}/>
                    
                                { loginState === store.State.Authenticated ? (
                        
                                    <Switch>
                                        <Route path="/home" component={Home}/>
                                        <Route path="/service" component={Service}/>
                                        <Route path="/setting/mypage" component={Mypage}/>
                                        {/*{*/}
                                        {/*    loginUser.type === "Admin"*/}
                                        {/*        ?*/}
                                        {/*        <Route path="/setting/admin/management"*/}
                                        {/*               render={() =>*/}
                                        {/*                   <Administration*/}
                                        {/*                       typeState={store.typeState}/>}/>*/}
                                        {/*        : <Route path="/"></Route>*/}
                                        {/*}*/}
                                        <Route path="/setting/admin/management"
                                               render={() => {
                                                   return loginUser.type === "Admin" ? <Administration typeState={store.typeState}/> :
                                                       // <Forbidden />
                                                       <Redirect to={"/"} />
                                               }} />
                                        <Route path="/" component={Home}/>
                                        {/*<Route component={Notfound}/>*/}
                                    </Switch>
                    
                                ) : (
                                    this.state.signupOpen === false
                                        ?
                                        <Route path="/" render={() => <SignIn signupOpen={this.state.signupOpen}
                                                                              setSignupOpen={this.setSignupOpen}/>}/>
                                        :
                                        <Route path="/" render={() => <SignUp typeState={store.typeState}
                                                                              signupOpen={this.state.signupOpen}
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

