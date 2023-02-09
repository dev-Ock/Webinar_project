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
import {toJS} from "mobx";

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
            // data: this.roomlist,
            isLoading: false, //추후에 필요할듯
            // page: {},
            curPage: 1
        };
        console.log("test", this.props.roomStore.roomListLength)

    }
    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.curPage !== this.state.curPage) {
    //         this.props.roomStore.selectRoomList();
    //     } // 이게 바로 그 값이 같지 않으면 겟데일리 함수를 호출.
    // };

    componentDidMount() {
        console.log("Room list mount")
        // setInterval(() => {
        //     this.setState({interval: false})
        // }, 50)
        const roomList = this.props.roomStore.selectRoomList();
        console.log("test222", this.props.roomStore.roomListLength)
    }

    enterRoom = async (e,streamUrl) => {
        e.preventDefault();
        console.log(streamUrl)
        await this.props.roomStore.beforePlayerRoom(streamUrl)
        await window.location.replace('/player-room')
    }


    // handleSubmitRoomList() {
    //     this.props.roomStore.selectRoomList();
    // }
    test() {
      console.log('이건 리스트',this.props.roomStore.roomList, '이건 디테일',this.props.roomStore.pageDetail)
    }
    render() {

        const {classes} = this.props
        const {roomList,roomListLength,curPage, totalPage, size, setCurPage, totalCount, pageDetail} = this.props.roomStore;
// console.log('룸리스트확인', this.roomTest)


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
                                //roomListLength === 0
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
                                            <Button size="small" color="primary" onClick={(e)=>{this.enterRoom(e,room.streamUrl)}}>
                                                입장하기
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
    }
                            {/*{*/}
                            {/*    roomListLength === 0*/}
                            {/*?*/}
                            {/*    <div><p>*/}
                            {/*        페이지 테스트 없음*/}
                            {/*    </p></div>*/}
                            {/*        :*/}
                            {/*        // <>현페{this.state.curPage},룸디현페{this.props.roomStore.pageDetail.pageNum}, 총데이터개수{this.props.roomStore.pageDetail.total},총페{pageDetail.pages},사이즈{pageDetail.pageSize},roomList를 비롯한 데이터를 못갖고 오고 있음</>*/}

                            {/*    <Pagination*/}
                            {/*        curPage={pageDetail.pageNum} //현재페이지*/}
                            {/*                 setCurPage={curPage => this.setState({ curPage })} //스테이트에 따라 바뀐 페이지*/}
                            {/*                 totalPage={pageDetail.pages} //총페이지*/}
                            {/*                 totalCount={pageDetail.total} //총데이터갯수*/}
                            {/*                 size={pageDetail.pageSize} //몇개씩 보일것인가*/}
                            {/*                 pageCount={pageDetail.pages} //화면에 나타날 페이지 갯수*/}
                            {/*    />*/}
                            {/*}*/}
                            {/*<Button onClick={this.test.bind(this)}>test</Button>*/}
                    </Container>






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


