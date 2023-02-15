import React, {Component} from 'react';
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
            length  : 0
        };
        this.offset = (this.state.page - 1) * this.state.limit
    }
    
    componentDidMount() {
        console.log("Room list mount")
        const roomList = this.props.roomStore.selectRoomList();
        roomList.then(rooms => {
                this.state.length = rooms.length;
                console.log("roomList", this.state.length)
            }
        )
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.page !== prevState.page || this.state.limit !== prevState.limit) {
            this.offset = (this.state.page - 1) * this.state.limit
        }
    }
    
    
    setPage = (value) => {
        this.setState({page: value})
    }
    
    
    // 방 입장
    enterRoom = async (e, room) => {
        e.preventDefault();
        const {roomStore, authStore, roomUserStore} = this.props;
        await roomStore.playerOrPublisherChoice(room, authStore.loginUser.id, () => authStore.checkLogin(), (param) => roomUserStore.onCreateRoomUser(param));
    }
    
    render() {
        
        const {classes} = this.props
        const {roomList} = this.props.roomStore;
        
        return (
            <Container component="main" className={classes.mainContainer}>
                <div className={classes.appBarSpacer}/>
                <Toolbar>
                    <div className={classes.toolbar}>
                        <Typography variant="h2" component="h2">
                            Webinar
                        </Typography>
                    </div>
                </Toolbar>
                <br/><br/>
                <div style={{fontSize: '20px', textAlign: 'right', marginRight:'100px'}}>
                    <label>
                        한 페이지에 표시할 player 수 :
                        &nbsp;
                        <select
                            style={{fontSize: '20px'}}
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
                    this.state.length === 0
                        ?
                        <div className={classes.mainContainer}><h1>시청할 수 있는 웨비나가 없습니다.</h1></div>
                        :
                        <Grid container spacing={3}>
                            
                            {roomList
                                .slice(this.offset, this.offset + this.state.limit)
                                .map(room =>
                                    <Grid item key={room.id} className={classes.card}>
                                        <Card>
                                            <CardActionArea variant='body1'>
                                                <CardHeader className={cardHeaderClasses.title} title={room.title}
                                                            subheader={room.name}/>
                                                <CardContent>
                                                    <Typography variant='body1' component='div'>
                                                        {room.description ? room.description : '입력한 내용이 없습니다.'}
                                                    </Typography>
                                                    <Typography variant='body2' color='textSecondary'>
                                                        {room.state}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions style={{textAlign:'right'}}>
                                                <Button size="small" color="primary" onClick={(e) => {
                                                    this.enterRoom(e, room)
                                                }}>
                                                    입장하기
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )}
                        </Grid>
                }
                
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


