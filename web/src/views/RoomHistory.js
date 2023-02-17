import React from "react";

import {makeAutoObservable, toJS} from "mobx";
import {Container} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {inject, observer} from "mobx-react";
import { withStyles, makeStyles } from '@material-ui/core/styles';

import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {TabContext, TabList, TabPanel} from '@mui/lab';
import { Collapse, TableCell} from "@mui/material";
import {Tab, Box, IconButton, Table, TableBody, TableContainer, TableHead, TableRow, Typography, Paper} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import RoomHistoryImg from '../assets/images/history.png'
import PlayerList from "./PlayerList";
import PropTypes from "prop-types";

const styles = {
    roomMakeImgOutDiv:{
        width: "80%",
        paddingTop: 100,
        paddingLeft: 20,
        paddingRight: 20
    }
}

class RoomHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            historyTabValue : '1',

        };
    }

    componentDidMount () {
        const userId = this.props.authStore.loginUser.id;
        console.log("새로고침해도 있나 확인 userId : ", userId, typeof (userId))
        const data = this.props.roomStore.getPublishedRoom(userId);
        console.log("PublishedRoom data : ",data) // Promise 로 나옴

    }

    historyTabHandleChange = (e, value) => {
        this.setState({historyTabValue : value})
    }

    // 세미나 만들기 폼 입력값 받는 함수


    render() {
        const { classes } = this.props;
        const roomHistoryDataInner = toJS(this.props.roomStore.publishedRoomList);
        // console.log("roomHistoryData toJS : ", roomHistoryData)

        const roomHistoryDataOut = roomHistoryDataInner.filter((data)=> {return data.state == "Wait"})
        const roomHistoryDataTotal = roomHistoryDataOut.map((data) => {
            let history = roomHistoryDataInner.filter((innerData) => innerData.roomId === data.roomId);
            data["history"] = [...history];
            return data;
        })
        // console.log(roomHistoryDataTotal)

        // 편집한 roomHistoryDataTotal 형태
        // Row = {
        //     row: (n) [{…}, ..., {…}]({
        //         createdDatetime: "2023-02-16T15:22:09",
        //         description: "",
        //         history: Array(3) // row와 형태 같음
        //             0 : {id: '1', roomId: '1', publisherId: '1', title: '비공개방은 0', description: '', …}
        //             1 : {id: '2', roomId: '1', publisherId: '1', title: '비공개방은 0', description: '', …}
        //             3 : {id: '3', roomId: '1', publisherId: '1', title: '비공개방은 0', description: '', …}
        //             }),
        //         id: "1"
        //         maximum: "6",
        //         publicOrNot: 0,
        //         publisherId: "1",
        //         roomId: "1",
        //         state: "Wait",
        //         titles: "빅데이터 세미나",
        //         ),
        //     }),
        // };


        return(
            <div className={classes.roomMakeImgOutDiv}>

                <TabContext value={this.state.historyTabValue}>
                    <Box>
                        <TabList onChange={(e, value)=>this.historyTabHandleChange(e, value)} >
                            <Tab label="생성했던 세미나 기록 조회" value="1" />
                            <Tab label="참여했던 세미나 기록 조회" value="2" />
                        </TabList>
                    </Box>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <TabPanel value= "1" style={{padding: '0px'}}>
                            <div style={{width: '100%',  height: '80vh'}}>
                                <TableContainer component={Paper}>
                                    <Table aria-label="collapsible table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell />
                                                <TableCell align="left"> no.(지금은 roomId) </TableCell>
                                                <TableCell> 세미나 명 </TableCell>
                                                <TableCell > 정원 </TableCell>
                                                <TableCell > 공개여부 </TableCell>
                                                <TableCell align="left"> 날짜 </TableCell>
                                                {/*<TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* 바깥 테이블 내용. */}
                                            {roomHistoryDataTotal.map((row) => (
                                                <Row key={row.id} row={row} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                        </TabPanel>

                        <TabPanel value= "2" >
                            <div style={{width: '100%', backgroundColor: 'lightgoldenrodyellow', height: '80vh'}}>참여했던 세미나 기록</div>
                            <div style={{textAlign: 'center'}}>
                                <div style={{marginTop: '3px'}}><input placeholder="내용을 입력해주세요." style={{width: '300px', margin: '5px'}}></input><Button variant="contained">전송</Button></div>
                            </div>
                        </TabPanel>
                    </div>
                </TabContext>

            </div>

        );
    }
}
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.roomId}
                </TableCell>
                <TableCell> {row.title} </TableCell>
                <TableCell align="left"> {row.maximum} </TableCell>
                <TableCell align="left"> {row.publicOrNot == 1 ? "공개" : "비공개"} </TableCell>
                <TableCell align="left"> {row.createdDatetime.slice(0,10)}&nbsp;&nbsp;{row.createdDatetime.slice(11,16)}  </TableCell>
            </TableRow>
            {/* 안쪽 테이블 내용 */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 , paddingLeft: 10}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, marginLeft: 5, marginBottom: 5}}>
                            <Typography variant="body1" gutterBottom component="div" align="center">
                                상세 히스토리
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>id</TableCell>
                                        <TableCell>방상태</TableCell>
                                        <TableCell align="right">시간</TableCell>
                                        <TableCell align="right">참여자수</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow) => (
                                        <TableRow key={historyRow.id}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.id}
                                            </TableCell>
                                            <TableCell>{historyRow.state}</TableCell>
                                            <TableCell align="right">{historyRow.createdDatetime}</TableCell>
                                            <TableCell align="right">
                                                룸유저히스토리 완성 시 가능
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('roomStore', 'authStore')(
                observer(RoomHistory)
            )
        )
    )
);