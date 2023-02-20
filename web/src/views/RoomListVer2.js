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
import {CardActionArea, CardActions, Tooltip} from "@mui/material";
import Pagination from "../components/Pagination";
import LockIcon from '@mui/icons-material/Lock';
import {UserId} from "../repositories/Repository";
import * as Roomstore from "../stores/RoomStore"
import RefreshIcon from "@mui/icons-material/Refresh";
import { makeObservable, observable, action } from "mobx"

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
        width    : '85%',
        textAlign: 'left'
    },
    card         : {
        display: 'grid',
        // gridTemplateColumns: 'repeat(auto-fill, 1fr)',
        // gridTemplateColumns: 'repeat(3, 1fr)',
        // gridTemplateRows   : 'repeat(auto-fill, 1fr)',
        // gap                : '1em',
        minWidth : '400px', // [변경후] 3개씩 보기
        maxWidth : '400px',
        minHeight: '260px',
        maxHeight: '260x',
        // minWidth : '300px', // [변경전] 4개씩 보기
        // maxWidth : '300px',
        // minHeight: '235px',
        // maxHeight: '235px'
    },
    cardHeader: {
        boxSizing: 'inherit',
        height: '88px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        // whiteSpace: 'nowrap', // 한줄만 표시할 경우 아래줄로 내려가는 것을 막음
    },
    cardContentDescription: {
        boxSizing: 'inherit',
        width: '300px',
        height: '26px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap', // 줄바꿈 방지
    },
    refreshBtn : {
        color: '#90a4ae',
        fontWeight: 'bolder',
        '&:hover': {
            color: '#ff5252',
            cursor: 'pointer',
            transform: 'translateY(-1px)'
        }
    },

    })


class RoomList extends React.Component {
    constructor(props) {
        super(props);
        // makeAutoObservable(this.props.roomList)
        this.state = {
            private : false,
            interval: true,
            pending : true,
            limit1   : 3, // [변경전] 4
            page1    : 1,
            length1  : 0,
            limit2   : 12,
            page2    : 1,
            length2  : 0,
        };
        this.offset1 = (this.state.page1 - 1) * this.state.limit1
        this.offset2 = (this.state.page2 - 1) * this.state.limit2
    }

    componentDidMount() {
        console.log("Room list mount")
        this.getRoomListAndPagination();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.page2 !== prevState.page2 || this.state.limit2 !== prevState.limit2 || this.state.page1 !== prevState.page1 || this.state.limit1 !== prevState.limit1) {
            this.offset1 = (this.state.page1 - 1) * this.state.limit1
            this.offset2 = (this.state.page2 - 1) * this.state.limit2
        }
    }


    setPage1 = (value) => {
        this.setState({page1: value})
    }
    setPage2 = (value) => {
        this.setState({page2: value})
    }

    getRoomListAndPagination = (e) => {
        const roomList = this.props.roomStore.selectRoomList();
        const userId = this.props.authStore.loginUser.id;
        roomList.then(rooms => {
                const publisherRoomListData = toJS(rooms).filter(room => room.publisherId === userId);
                this.state.length1 = publisherRoomListData.length;
                this.state.length2 = rooms.length >= publisherRoomListData.length ? (rooms.length - publisherRoomListData.length):(publisherRoomListData.length - rooms.length);
            }
        )
        this.props.roomUserStore.getAllRoomUsers();
    }

    // 방 입장, Passwor check
    enterRoom = async (e, room) => {
        e.preventDefault();
        const {roomStore, authStore, roomUserStore} = this.props;
        await roomStore.playerOrPublisherChoice(room, authStore.loginUser.id, () => authStore.checkLogin(), (param) => roomUserStore.onCreateRoomUser(param));

    }

     totalRoomList = this.props.roomStore.roomList.map((obj) => {
        let countParticipants = toJS(this.props.roomUserStore.roomUserList).filter((user) =>  obj.id === user.roomId )
        obj["participants"] = countParticipants.length
        return obj
    })

    render() {

        const {classes} = this.props
        const {roomList} = this.props.roomStore;
        const {roomUserList} = this.props.roomUserStore;

        const userId = this.props.authStore.loginUser.id;
        const userName = this.props.authStore.loginUser.name;

        const publisherRoomList = toJS(roomList).filter(room => room.publisherId === userId);
        const playerRoomList = toJS(roomList).filter(room => room.publisherId !== userId);

        const totalRooms = [...publisherRoomList, ...playerRoomList]

        const totalRoomList = totalRooms.map((obj) => {
            let countParticipants = toJS(this.props.roomUserStore.roomUserList).filter((user) =>  obj.id === user.roomId )
            obj["participants"] = countParticipants.length
            return obj
        })

        const publisherRoomList2 = totalRoomList.filter(room => room.publisherId === userId);
        const playerRoomList2 = totalRoomList.filter(room => room.publisherId !== userId);

        // console.log("totalRoomList : ", totalRoomList)

        return (
            <Container component="main" className={classes.mainContainer}>
                <div className={classes.appBarSpacer}/>
                <Toolbar>
                    <div className={classes.toolbar}>
                        <Typography variant="h3" component="h2" style={{color:'#37474f'}}>
                            Webinar List
                            &nbsp;
                            <RefreshIcon
                                className={classes.refreshBtn}
                                style={{fontSize:"var(--Icon-fontSize, 40px)"}}
                                onClick={(e) => {
                                    this.getRoomListAndPagination()
                                }}
                            />
                        </Typography>
                    </div>
                </Toolbar>
                <br/>
                {
                    publisherRoomList2.length === 0
                        ?
                        <div >
                            {/*<Toolbar>*/}
                            {/*    <div className={classes.toolbar}>*/}
                            {/*        <Typography variant="h4" component="h2" style={{color:'#78909c'}}>*/}
                            {/*            {userName}님이 현재 운영중인 웨비나는 없습니다.*/}
                            {/*        </Typography>*/}
                            {/*    </div>*/}
                            {/*</Toolbar>*/}
                        </div>
                        :
                        <div>

                            <div>
                                <Toolbar>
                                    <div className={classes.toolbar}>
                                        <Typography variant="h4" component="h2" style={{color:'#37474f'}}>
                                            {userName}님은 현재 아래의 웨비나를 운영중입니다.
                                        </Typography>
                                    </div>
                                </Toolbar>
                                <br/>

                            </div>
                            <Grid container spacing={3}>

                                {publisherRoomList2
                                    .slice(this.offset1, this.offset1 + this.state.limit1)
                                    .map(room =>
                                        <Grid item key={room.id} className={classes.card}>
                                            <Card>
                                                <CardActionArea variant='body1' onClick={(e) => {
                                                    this.enterRoom(e, room)
                                                }} >
                                                    <CardContent style={{paddingInline:'20px', boxSizing: 'inherit',
                                                        height: '88px', width: '370px', overflow: 'hidden', textOverflow: 'ellipsis',
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: '2',
                                                        WebkitBoxOrient: 'vertical',
                                                        paddingTop:'25px', paddingBottom:'10px'}} >
                                                        {/*{ room.password*/}
                                                        {/*    ?*/}
                                                        {/*    <Typography style={{marginRight:'1px', color: '#607d8b', display:'inline-block'}}> <LockIcon/>  </Typography>*/}
                                                        {/*    :*/}
                                                        {/*    <Typography style={{display:'inline-block'}}> </Typography> }*/}
                                                        {/*<Tooltip title={<h2> {room.title} </h2>} arrow >*/}
                                                        {/*    <Typography variant='body2' style={{color:'#455a64', fontWeight:'bolder', fontSize:'x-large', display:'inline-block'*/}
                                                        {/*    }}> {room.title} </Typography>*/}
                                                        {/*</Tooltip>*/}
                                                        <Tooltip title={<h2> {room.title} </h2>} arrow >
                                                            <Typography variant='body2' style={{color:'#455a64', fontWeight:'bolder', fontSize:'x-large'
                                                            }}> {room.title} </Typography>
                                                        </Tooltip>
                                                    </CardContent>
                                                    {/* 룸 서브타이틀 : 세미나 운영자 이름 */}
                                                    <CardContent style={{paddingInline:'50px', height:'30px', paddingTop:'4px', paddingBottom:'26px'}}>
                                                        <Typography variant='body2' style={{color:'#546e7a'}}>{room.name}</Typography>
                                                    </CardContent>
                                                    {/* 룸 상세설명 */}
                                                    <CardContent style={{paddingInline:'40px', paddingTop:'13px', paddingBottom:'8px'}}>
                                                        <Tooltip title={<h2> {room.description ? room.description : '상세설명 없음'} </h2>} arrow>
                                                            <Typography className={classes.cardContentDescription} variant='body1' component='div' style={{color:'#78909c'}}
                                                            >
                                                                {room.description ? room.description : '상세설명 없음'}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent>
                                                    {/* 룸 진행상 */}
                                                    <CardContent style={{paddingInline:'50px', height:'45px', paddingTop:'8px', paddingBottom:'20px'}}>
                                                        {
                                                            room.state === Roomstore.RoomStateType.Progress ?
                                                                <Typography variant='body2' style={{color:'#ef5350', fontWeight:'bolder', fontSize:'medium'}}> {room.state}</Typography> :
                                                                <Typography variant='body2' style={{color:'#546e7a', fontSize:'medium'}}> {room.state} </Typography>
                                                        }
                                                    </CardContent>
                                                </CardActionArea>

                                                {/* 룸 추가정보: 만든이, (공개여부), 인원현황 */}
                                                <CardActions style={{justifyContent: 'space-between', height:'44px', padding:'16px'}}>
                                                    {room.password
                                                        ?
                                                        <div style={{ color: '#607d8b'}}>
                                                            <div>
                                                                <LockIcon/>
                                                            </div>
                                                        </div>
                                                        :
                                                        ""
                                                    }
                                                    {room.publisherId === sessionStorage.getItem(UserId) ?
                                                        <div style={{color: '#607d8b', marginLeft:'0px'}}><h3> 내가 만든 세미나 </h3></div>
                                                        :
                                                        <div></div>
                                                    }
                                                    {
                                                        <div style={{color: '#607d8b', marginLeft:'7px'}}><h3> {room.participants}/{room.maximum} </h3></div>
                                                    }
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )}
                            </Grid>
                            {/*<br/>*/}
                            <footer>
                                <Pagination
                                    total={this.state.length1}
                                    limit={this.state.limit1}
                                    page={this.state.page1}
                                    setPage={this.setPage1}
                                />
                            </footer>
                        </div>
                }
                <br/><br/>
                <div>
                    <Toolbar>
                        <div className={classes.toolbar}>
                            <Typography variant="h4" component="h2" style={{color:'#37474f'}}>
                                {userName}님이 참여할 수 있는 웨비나는 다음과 같습니다.
                            </Typography>
                        </div>
                        <div style={{fontSize: '20px', textAlign: 'right', marginRight: '10px', color:'#546e7a'}}>
                            <label>
                                <select
                                    style={{fontSize: '20px', color:'#546e7a'}}
                                    value={this.state.limit2}
                                    onChange={({target: {value}}) => this.setState({limit2: Number(value)})}
                                >
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                    <option value={36}>36</option>
                                </select> 개씩 보기
                            </label>
                        </div>
                    </Toolbar>
                    <br/>
                    <br/>
                    {
                        playerRoomList2.length === 0
                            ?
                            <div className={classes.mainContainer}><h1>시청할 수 있는 웨비나가 없습니다.</h1></div>
                            :
                            <Grid container spacing={3}>

                                {playerRoomList2
                                    .slice(this.offset2, this.offset2 + this.state.limit2)
                                    .map(room =>
                                        <Grid item key={room.id} className={classes.card}>
                                            <Card>
                                                <CardActionArea variant='body1' onClick={(e) => {
                                                    this.enterRoom(e, room)
                                                }}>
                                                    {/*룸 타이틀 : 세미나 제목*/}
                                                    <CardContent style={{paddingInline:'20px', boxSizing: 'inherit',
                                                        height: '88px', width: '370px',overflow: 'hidden', textOverflow: 'ellipsis',
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: '2',
                                                        WebkitBoxOrient: 'vertical',
                                                        paddingTop:'25px', paddingBottom:'10px'}}>
                                                        {/*{ room.password*/}
                                                        {/*    ?*/}
                                                        {/*    <Typography style={{marginRight:'1px', color: '#607d8b', display:'inline-block'}}> <LockIcon/>  </Typography>*/}
                                                        {/*    :*/}
                                                        {/*    <Typography style={{display:'inline-block'}}> </Typography> }*/}
                                                        {/*<Tooltip title={<h2> {room.title} </h2>} arrow>*/}
                                                        {/*    <Typography variant='body2' style={{color:'#455a64', fontWeight:'bolder', fontSize:'x-large', display:'inline-block'*/}
                                                        {/*        }} > {room.title} </Typography>*/}
                                                        {/*</Tooltip>*/}
                                                        <Tooltip title={<h2> {room.title} </h2>} arrow>
                                                            <Typography variant='body2' style={{color:'#455a64', fontWeight:'bolder', fontSize:'x-large'
                                                            }} > {room.title} </Typography>
                                                        </Tooltip>
                                                    </CardContent>
                                                    {/*룸 서브타이틀 : 세미나 운영자 이름*/}
                                                    <CardContent style={{paddingInline:'50px', height:'30px', paddingTop:'4px', paddingBottom:'26px'}}>
                                                        <Typography variant='body2' style={{color:'#546e7a'}}>{room.name}</Typography>
                                                    </CardContent>
                                                    {/*룸 상세설명*/}
                                                    <CardContent style={{paddingInline:'40px', paddingTop:'13px', paddingBottom:'8px'}}>
                                                        <Tooltip title={<h2> {room.description} </h2>} arrow>
                                                            <Typography className={classes.cardContentDescription} variant='body1' component='div' style={{color:'#78909c'}}
                                                                        >
                                                                {room.description ? room.description : '상세설명 없음'}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent>
                                                    {/*룸 진행상태*/}
                                                    <CardContent style={{paddingInline:'50px', height:'45px', paddingTop:'8px', paddingBottom:'20px'}}>
                                                        {
                                                            room.state === Roomstore.RoomStateType.Progress ?
                                                                <Typography variant='body2' style={{color:'#ef5350', fontWeight:'bolder', fontSize:'medium'}}> {room.state}</Typography> :
                                                                <Typography variant='body2' style={{color:'#546e7a', fontSize:'medium'}}>{room.state}</Typography>
                                                        }
                                                    </CardContent>
                                                </CardActionArea>

                                                {/* 룸 추가정보: 만든이, (공개여부), 인원현황 */}
                                                <CardActions style={{justifyContent: 'space-between', height:'44px', padding:'16px'}}>
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
                                                    <div></div>
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
                    <footer>
                        <Pagination
                            total={this.state.length2}
                            limit={this.state.limit2}
                            page={this.state.page2}
                            setPage={this.setPage2}
                        />
                    </footer>
                </div>

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


