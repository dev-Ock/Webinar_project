import React from "react";
import {Link} from "react-router-dom";


import {
    Box, Collapse,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";

import {ReactComponent as ArrowLineLeftIcon} from "../common/images/ArrowLineLeftIcon.svg";
import {ReactComponent as GearSixGrayIcon} from "../common/images/GearSixGrayIcon.svg";
import OnTheLiveLogo from "../common/images/onthelive_logo.svg";
import Logo from "../common/images/logo.png";
import clsx from "clsx";
import HomeIcon from '@mui/icons-material/Home';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles((theme) => ({
    root:{
        '& *':{
            fontFamily:'Noto Sans KR',
        },
    },
    drawerOpen: {
        width: theme.drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: 68,
    },
    toolbar: {
        width: theme.drawerWidth,
        height: 64,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'#000',
        paddingLeft: 15,
        paddingRight: 15,
        boxSizing: 'border-box'
    },
    toolbarClose:{
        width: 68,
        justifyContent: 'center',
    },
    menu: {
        height: '100%',
        backgroundColor:'#000',
        overflow:'auto',
        '& .MuiListItemIcon-root':{
            minWidth:20,
        },
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
        '& .MuiListItem-button:hover, .MuiCollapse-root:hover':{
            backgroundColor:'#242424',
        },
        '& 	.Mui-selected':{
            backgroundColor:'#242424',
        },
        '& .MuiListItem-button':{
            display:'flex',
            justifyContent:'center',
            alignItems: 'center'
        },
        '& .MuiListItemText-primary':{
            color: '#fff',
            fontWeight:300,
            fontSize:'0.938rem',
            marginLeft: 16
        },
    },
    iconBtnStyle:{
        padding: 0,
        '&:hover':{
            background:'transparent',
        }
    },
    logo : {
        width: 'calc(100% - 29px)',
    }
}));

// export const UserType = {
//     ADMIN : "Admin",
//     MANAGER : "Manager",
//     OPERATOR : "Operator",
// }

export default function SideMenu(props) {
    const classes = useStyles();
    useTheme();
    const { menuOpen, isLoggedIn, handleDrawerToggle, user} = props;
    const [settingOpen, setSettingOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);


    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };
    const handleSettingOpen = () => {
        setSettingOpen(!settingOpen);
    }


    const drawer = (
        <div className={classes.menu}>
            <List>
                {/*<ListSubheader inset>관리</ListSubheader>*/}
                <Link to="/room-list" className={classes.link}>
                    <ListItem button disableRipple onClick={ () => handleListItemClick(1) }  selected={selectedIndex === 1}  >
                        <ListItemIcon>
                            <ListAltIcon sx={{ color: grey[50] }}/>
                        </ListItemIcon>
                        <ListItemText primary="세미나 목록" />
                    </ListItem>
                    {/*{user.type === UserType.ADMIN &&*/}
                    {/*<ListItem button disableRipple onClick={() => handleListItemClick(3)} selected={selectedIndex === 3}>*/}
                    {/*    <ListItemIcon>*/}
                    {/*        /!*<ComputerIcon/>*!/*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="통합관리자"/>*/}
                    {/*</ListItem>}*/}
                </Link>

                <Link to="/room-make" className={classes.link}>
                    <ListItem button disableRipple onClick={() => handleListItemClick(2)} selected={selectedIndex === 2}>
                        <ListItemIcon>
                            <AddIcon sx={{ color: grey[50] }}/>
                        </ListItemIcon>
                        <ListItemText primary="세미나 만들기" />
                    </ListItem>
                </Link>

                <Link to="/room-history" className={classes.link}>
                    <ListItem button disableRipple onClick={() => handleListItemClick(3)} selected={selectedIndex === 3}>
                        <ListItemIcon>
                            <HistoryIcon sx={{ color: grey[50] }} />
                        </ListItemIcon>
                        <ListItemText primary="세미나 히스토리" />
                    </ListItem>
                </Link>
            </List>
        </div>
    );

    const drawerIcon = (
        <div className={classes.menu}>
            <List>
                <Tooltip title="홈으로 가기" followCursor>
                <Link to="/home" className={classes.link}>
                    <ListItem button style={{padding: 0}}>
                        <ListItemIcon><HomeIcon sx={{ color: grey[50] }} style={{height: '59.8611px'}}/></ListItemIcon>
                    </ListItem>
                </Link>
                </Tooltip>
                <Tooltip title="세미나 리스트" followCursor>
                <Link to="/room-list" className={classes.link}>
                    <ListItem button style={{padding: 0}}>
                        <ListItemIcon><ListAltIcon sx={{ color: grey[50] }} style={{height: '59.8611px'}}/></ListItemIcon>
                    </ListItem>
                </Link>
                </Tooltip>
                <Tooltip title="세미나 만들기" followCursor>
                <Link to="/room-make" className={classes.link}>
                    <ListItem button style={{padding: 0}}>
                        <ListItemIcon><AddIcon sx={{ color: grey[50] }} style={{height: '59.8611px'}}/></ListItemIcon>
                    </ListItem>
                </Link>
                </Tooltip>
                <Tooltip title="세미나 히스토리" followCursor>
                <Link to="/room-history" className={classes.link}>
                    <ListItem button style={{padding: 0}}>
                        <ListItemIcon><HistoryIcon sx={{ color: grey[50] }} style={{height: '59.8611px'}}/></ListItemIcon>
                    </ListItem>
                </Link>
                </Tooltip>
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            {isLoggedIn ?
                menuOpen ?
                <Drawer variant={"permanent"}
                        open={menuOpen}
                        className={classes.drawerOpen}
                >
                    <Box className={classes.toolbar}>
                        <Link to='/home'  className={classes.link} style={{width: '100%'}}>
                            <img src={Logo} alt="OnTheLive" className={classes.logo}/>
                        </Link>
                        <IconButton
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            edge="start"
                            className={classes.iconBtnStyle}
                            disableRipple><ArrowLineLeftIcon/></IconButton>
                    </Box>
                    {drawer}
                </Drawer>
                    :
                    <Drawer variant="permanent"
                            className={classes.drawerClose}
                            open={true}
                    >
                        <Box className={clsx(classes.toolbar, classes.toolbarClose)}>
                            <IconButton
                                aria-label="open drawer"
                                onClick={handleDrawerToggle}
                                edge="start"
                                className={classes.iconBtnStyle}
                                disableRipple><ArrowLineLeftIcon style={{transform: 'scaleX(-1)'}}/></IconButton>
                        </Box>
                        {drawerIcon}
                    </Drawer>
                :
                ''
            }
        </div>
    );
};