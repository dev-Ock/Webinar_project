import React from "react";
import {Link, withRouter} from "react-router-dom";

import {makeStyles, withStyles} from "@material-ui/core/styles";
import {AppBar, Box, IconButton, Toolbar} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import OnTheLiveLogo from "../common/images/onthelive_logo.svg";
import clsx from "clsx";
import {Typography} from "@mui/material";
import {withSnackbar} from "notistack";
import {inject, observer} from "mobx-react";

const logoWidth = 120;

const useStyles = makeStyles((theme) => ({
    appBar: {
        display:'flex',
        justifyContent:'center',
        backgroundColor:'#fff',
        color:'#333',
        [theme.breakpoints.up('sm')]: {
            width:'100%',
        },
        '& *':{
            fontFamily:'Noto Sans KR',
        },
        '& img':{
            height: 35
        }
    },
    appBarLogin:{
        alignItems:'flex-end',
        width: `calc(100% - ${theme.drawerWidth}px)`,
        marginLeft: theme.drawerWidth,
    },
    appBarLoginMenuClose:{
        alignItems:'flex-end',
        width: `calc(100% - 68px)`,
        marginLeft: 68,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    title: {
        marginLeft: (theme.sideMenuWidth - logoWidth) / 2,
        paddingLeft: theme.spacing(3),
        flexGrow: 1,
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    userInfoStyle:{
        display:'flex',
        alignItems:'center',
        marginRight:40,
        fontSize:'1rem',
        color:'#333',
        letterSpacing:'-0.32px',
        '& > p:first-child':{
            marginRight:9,
            paddingRight:10,
            borderRight:'1px solid #d8d8d8',
            lineHeight:1,
        }
    },
    iconBtnStyle:{
        '&:hover':{
            background:'transparent',
        }
    },
}));

function TopBar(props) {
    const classes = useStyles();
    const { mobileOpen, setMobileOpen, isLoggedIn, doLogout, menuOpen, user} = props;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    const setLogout = () => {
        doLogout();
        return (
            window.location.href = "/"
        )
    }
    
    return (
        <AppBar position="fixed" className={isLoggedIn ? menuOpen ? clsx(classes.appBar, classes.appBarLogin) : clsx(classes.appBar, classes.appBarLoginMenuClose) : classes.appBar}>
            
            <Toolbar>
                {/*{!isLoggedIn ? (*/}
                {/*    <Link to='/'>*/}
                {/*        <img src={OnTheLiveLogo} alt="Onthelive" />*/}
                {/*    </Link>*/}
                {/*) : (*/}
                {/*    ''*/}
                {/*)}*/}

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                {/*{ props.roomStore.roomTitleAndPublisherName.title !== "" ?*/}
                {/*    <div style={{alignItems:'left'}}>*/}
                {/*        <h2> Title : { props.roomStore.roomTitleAndPublisherName.title} / Publisher : { props.roomStore.roomTitleAndPublisherName.publisherName }*/}
                {/*        </h2>*/}
                {/*    </div> :*/}
                {/*    ""*/}
                {/*}*/}
                
                {isLoggedIn ? <Typography variant="h6" noWrap className={classes.title}>
                    {user.name}님 환영합니다.
                </Typography>:''}

                {/* 로그아웃 이모티콘 */}
                {isLoggedIn ? (
                    <Box display='flex'>
                        <Box className={classes.userInfoStyle}>
                            <IconButton onClick={setLogout} className={classes.iconBtnStyle}>
                                <ExitToAppIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ) : (
                    ''
                )}
            </Toolbar>
        </AppBar>
    );
}

export default withSnackbar(withRouter(
            inject('roomStore', 'roomUserStore','authStore')(
                observer(TopBar)
            )
    )
);