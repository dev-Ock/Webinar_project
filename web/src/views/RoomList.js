import React, {Component} from 'react';
import {makeAutoObservable, toJS} from "mobx";

import {withStyles} from "@material-ui/core/styles";
import {
    Grid,
    Paper,
    Toolbar,
    Typography,
    ListItem,
    Container,
    Card,
    CardHeader,
    CardContent,
    Button
} from "@material-ui/core";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {CardActionArea, CardActions, cardHeaderClasses, gridClasses} from "@mui/material";
import Pagination from "../components/Pagination";
import LockIcon from '@mui/icons-material/Lock';
import {UserId} from "../repositories/Repository";
import * as Roomstore from "../stores/RoomStore"


const styles = theme => ({
    
    mainContainer: {
        flexGrow : 1,
        padding  : theme.spacing(5),
        textAlign: 'center'
    },
    appBarSpacer : theme.mixins.toolbar,
    mainContent  : {
        marginTop    : theme.spacing(2),
        display      : 'flex',
        flexDirection: 'column',
        alignItems   : 'center',
    },
    toolbar      : {
        width    : '100%',
        textAlign: 'center'
    },
    card         : {
        display: 'grid',
        // gridTemplateColumns: 'repeat(auto-fill, 1fr)',
        // gridTemplateColumns: 'repeat(3, 1fr)',
        // gridTemplateRows   : 'repeat(auto-fill, 1fr)',
        // gap                : '1em',
        minWidth : '300px',
        maxWidth : '300px',
        minHeight: '235px',
        maxHeight: '235px'
    },
    
})

class RoomList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            private : false,
            interval: true,
            pending : true,
            limit   : 12,
            page    : 1,
            length  : 0,
            // allROOMUSER : [],
        };
        this.offset = (this.state.page - 1) * this.state.limit
    }
    
    componentDidMount() {
        console.log("Room list mount")
        const roomList = this.props.roomStore.selectRoomList();
        roomList.then(rooms => {
                this.state.length = rooms.length;
                // console.log("roomList", this.state.length)
            }
        )
        this.props.roomUserStore.getAllRoomUsers();
        // const data = this.props.roomUserStore.getAllRoomUsers();
        // this.state.allROOMUSER.push(data);
        // console.log("data나나 : ", toJS(data));
        // console.log("allROOMUSER나나 : ", toJS(this.state.allROOMUSER));
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.page !== prevState.page || this.state.limit !== prevState.limit) {
            this.offset = (this.state.page - 1) * this.state.limit
        }
    }
    
    
    setPage = (value) => {
        this.setState({page: value})
    }
    
    
    // 방 입장, Passwor check
    enterRoom = async (e, room) => {
        e.preventDefault();
        const {roomStore, authStore, roomUserStore} = this.props;
        await roomStore.playerOrPublisherChoice(room, authStore.loginUser.id, () => authStore.checkLogin(), (param) => roomUserStore.onCreateRoomUser(param));
    }


    render() {
        
        const {classes} = this.props
        const {roomList} = this.props.roomStore;
        const {roomUserList} = this.props.roomUserStore;

        const userId = this.props.authStore.loginUser.id;
        const publisherRoomList = toJS(roomList).filter(room => room.publisherId === userId);
        const playerRoomList = toJS(roomList).filter(room => room.publisherId !== userId);

        const totalRooms = [...publisherRoomList, ...playerRoomList]

        const totalRoomList = totalRooms.map((obj) => {
            let countParticipants = toJS(roomUserList).filter((user) =>  obj.id === user.roomId )
            obj["participants"] = countParticipants.length
            return obj
        })
        // console.log("하하호호호 : ", totalRoomList)
        // 토탈 룸리스트의 하나하나에 '키 인원수 : 현재 들어가있는 인원' 이렇게 넣어줘야 함.

        // console.log("publisherRoomList : ", publisherRoomList)
        // console.log("playerRoomList : ", playerRoomList)

        return (
            <Container component="main" className={classes.mainContainer}>
                <div className={classes.appBarSpacer}/>
                <Toolbar>
                    <div className={classes.toolbar}>
                        <Typography variant="h2" component="h2" style={{color:'#37474f'}}>
                            Webinar
                        </Typography>
                    </div>
                </Toolbar>
                <br/><br/>
                <div style={{fontSize: '20px', textAlign: 'right', marginRight: '100px', color:'#546e7a'}}>
                    <label>
                        한 페이지에 표시할 player 수 :
                        &nbsp;
                        <select
                            style={{fontSize: '20px', color:'#546e7a'}}
                            value={this.state.limit}
                            onChange={({target: {value}}) => this.setState({limit: Number(value)})}
                        >
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={36}>36</option>
                        </select>
                    </label>
                </div>
                <br/>
                <br/>
                {
                    totalRoomList.length === 0
                        ?
                        <div className={classes.mainContainer}><h1>시청할 수 있는 웨비나가 없습니다.</h1></div>
                        :
                        <Grid container spacing={3}>
                            
                            {totalRoomList
                                .slice(this.offset, this.offset + this.state.limit)
                                .map(room =>
                                    <Grid item key={room.id} className={classes.card}>
                                        <Card>
                                            <CardActionArea variant='body1' onClick={(e) => {
                                                this.enterRoom(e, room)
                                            }}>
                                                <CardHeader className={cardHeaderClasses.title} style={{color:'#455a64'}} title={room.title}
                                                            subheader={room.name} />
                                                <CardContent>
                                                    <Typography variant='body1' component='div' style={{color:'#78909c'}}>
                                                        {room.description ? room.description : '입력한 내용이 없습니다.'}
                                                    </Typography>
                                                        {
                                                            room.state === Roomstore.RoomStateType.Progress ?
                                                                <Typography variant='body2' style={{color:'#ef5350', fontWeight:'bolder'}}> {room.state}</Typography> :
                                                                <Typography variant='body2' style={{color:'#546e7a'}}>{room.state}</Typography>
                                                        }
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions style={{justifyContent: 'space-between', marginTop:'-8px'}}>

                                                {room.publisherId === sessionStorage.getItem(UserId) ?
                                                    <div style={{color: '#607d8b', marginLeft:'7px'}}><h3> 내가 만든 세미나 </h3></div>
                                                    :
                                                    <div></div>
                                                }


                                                {room.password
                                                    ?
                                                    <div style={{marginRight:'7px', color: '#607d8b'}}>
                                                        <div>
                                                            <LockIcon/>
                                                        </div>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                                {
                                                    <div style={{color: '#607d8b', marginLeft:'7px'}}><h3> {room.participants}/{room.maximum} </h3></div>
                                                }


                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                        </Grid>
                }
                <br/>
                <br/>

                
                <footer>
                    <Pagination
                        total={this.state.length}
                        limit={this.state.limit}
                        page={this.state.page}
                        setPage={this.setPage}
                    />
                </footer>
            
            </Container>
        
        )
        
    }
    
    
};
export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'authStore', 'roomUserStore')(
                observer(RoomList)
            )
        )
    )
);


