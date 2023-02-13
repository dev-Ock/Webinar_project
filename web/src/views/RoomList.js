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

const styles = theme => ({

    mainContainer: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    appBarSpacer: theme.mixins.toolbar,
    mainContent: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    toolbar: {
        width: '100%',
    },
    card:{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, 1fr)',
        gap: '1em',
        minWidth:'300px',
        minHeight : '200px'
    },

})

class RoomList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            private: false,
            interval: true,
            pending: true,
        };
        console.log("test", this.props.roomStore.roomListLength)

    }

    componentDidMount() {
        console.log("Room list mount")
        const roomList = this.props.roomStore.selectRoomList();
        // roomList.then(data => console.log('list',data))
        // console.log("roomList" , roomList)
        // roomList.then(list => console.log('roomList2',list[0].streamUrl))
    }
    
    // 방 입장
    enterRoom = async (e,room) => {
        e.preventDefault();
        const {roomStore, authStore, roomUserStore} = this.props;
        roomStore.playerOrPublisherChoice(room, authStore.loginUser.id, ()=>authStore.checkLogin(), (param) => roomUserStore.onCreateRoomUser(param));
    }

    render() {

        const {classes} = this.props
        const {roomList,roomListLength} = this.props.roomStore;

        return (
                        <Container component="main" className={classes.mainContainer}>
                        <div className={classes.appBarSpacer}/>
                        <Toolbar className={classes.toolbar}>
                            <Typography variant="h4" component="h2">
                                Webinar
                            </Typography>
                        </Toolbar>
                            {
                            this.props.roomStore.roomListLength === 0
                                ?
                                <div className={classes.mainContainer}><h1>시청할 수 있는 웨비나가 없습니다.</h1></div>
                                :
                        <Grid container spacing={3}>
                            {roomList.map(room =>
                                <Grid item key={room.id} className={classes.card}>
                                    <Card>
                                        <CardActionArea variant='body1'>
                                            <CardHeader className={cardHeaderClasses.title} title={room.title}
                                                        subheader={room.name}/>
                                            <CardContent>
                                                <Typography variant='body1' component='div'>
                                                    {room.description?room.description: '입력한 내용이 없습니다.'}
                                                </Typography>
                                                <Typography variant='body2' color='textSecondary'>
                                                    {room.state}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                            <Button size="small" color="primary" onClick={(e)=>{this.enterRoom(e, room)}}>
                                                입장하기
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
    }
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


