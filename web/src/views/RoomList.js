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

const dummy = [{
    id: 'm1',
    title: 'This is a first meetup',
    description:
        'This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!',
},
    {
        id: 'm2',
        title: 'This is a second meetup',
        description:
            'This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!',
    },]
const styles = theme => ({
    itemArea:{
        width : 360
    },
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
    }
})

class RoomList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            private: false,
            interval : true,
        };

    }
    componentDidMount() {
        console.log("Room list mount")
        setInterval(()=>{
            this.setState({interval : false})
        },50)
        this.props.roomStore.selectRoomList();
    }
    handleSubmitRoomList() {
        this.props.roomStore.selectRoomList();
    }

    render() {

        const {classes} = this.props
        const {roomList} = this.props.roomStore;

        return (
            <Container omponent="main" className={classes.mainContainer}>
                <div className={classes.appBarSpacer} />
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h4" component="h2">
                        Webinar
                    </Typography>
                </Toolbar>
                <Grid container spacing={3} item >
                    {roomList.map(room =>
                        <Grid item key={room.id}>
                    <Card>
                        <CardHeader title={room.title} subheader={room.publisherId}/>
                        <CardContent>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {room.description}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {room.state}
                            </Typography>
                        </CardContent>
                    </Card>
                        </Grid>
                        )}
                </Grid>
            </Container>

    )

    }


};
export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('roomStore','authStore')(
                observer(RoomList)
            )
        )
    )
);


