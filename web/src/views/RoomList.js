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
import {CardActionArea, cardClasses, cardHeaderClasses} from "@mui/material";

const styles = theme => ({

    mainContainer: {
        flexGrow: 1,
        padding: theme.spacing(5)
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
        setInterval(() => {
            this.setState({interval: false})
        }, 50)
        this.props.roomStore.selectRoomList();

    }

    // handleSubmitRoomList() {
    //     this.props.roomStore.selectRoomList();
    // }

    render() {

        const {classes} = this.props
        const {roomList,roomListLength} = this.props.roomStore;
// console.log('룸리스트확인', roomList)s


        return (
            <>
                {
                    this.props.roomStore.roomListLength === 0
                        ?
                    <div style={{marginTop: "100px"}}><h1>no room</h1></div>
                    :
                        <Container component="main" className={classes.mainContainer}>
                        <div className={classes.appBarSpacer}/>
                        <Toolbar className={classes.toolbar}>
                            <Typography variant="h4" component="h2">
                                Webinar
                            </Typography>
                        </Toolbar>
                        <Grid container>
                            {roomList.map(room =>
                                <Grid item key={room.id}>
                                    <Card>
                                        <CardActionArea variant='body1'>
                                            <CardHeader className={cardHeaderClasses.title} title={room.title}
                                                        subheader={room.name}/>
                                            <CardContent>
                                                <Typography variant='body2' component='p'>
                                                    {room.description}
                                                </Typography>
                                                <Typography color='textSecondary' component='p'>
                                                    {room.state}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </Container>


                }
            </>


        )

    }


};
export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'authStore')(
                observer(RoomList)
            )
        )
    )
);


