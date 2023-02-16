import {
    Button,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {useState} from "react";
import Pagination from "../components/Pagination";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
import {styled} from '@mui/material/styles';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import RefreshIcon from '@mui/icons-material/Refresh';
import {maxWidth} from "@mui/system";


// const styles = (theme) => ({
//     root:{
//         height:'100vh',
//         display: 'flex',
//         alignItems: 'center',
//         '& *':{
//             fontFamily:'Noto Sans KR',
//         },
//         '& .MuiContainer-root':{
//             padding:'58px 100px',
//             border:'1px solid #d9d9d9',
//             borderRadius:12,
//         },
//     },
//     btn : {
//         color: '#fff',
//         fontSize: '30px',
//         backgroundColor: 'red'
//     }
// });

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#b0bec5',
        // color: ,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        // color: #b0bec5,
    },
}));

const styles = (theme) => ({
    root    : {
        textAlign: 'center'
    },
    countDiv: {
        margin: '0 auto',
        width : '280px'
    },
    count   : {
        color: 'black',
        float: 'left',
        width: '210px'
    },

    table : {
        minWidth: '420px',
        maxWidth: '420px',
        margin:'0 5px 0 5px',
        textAlign:'center'

    },
    refresh : {
        color     : '#90a4ae',
        fontWeight: 'bolder',
        float     : 'left',
        width     : '32px',
        '&:hover' : {
            color    : '#ff5252',
            cursor   : 'pointer',
            transform: 'translateY(-1px)'
        }
    },
})

function PlayerList(props) {
    
    const {classes} = props
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;

    
    return (
        
        <div className={classes.root}>
            <br/>
            <br/>
            <div className={classes.countDiv}>
                <div className={classes.count}> Player 수 : {props.roomUserList.length} 명 / 최대 인원
                    : {props.roomMaximum} 명</div>
                <RefreshIcon
                    className={classes.refresh}
                    onClick={props.onRefreshPlayerList}
                />
            </div>
            <br/>
            
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell
                                // className={props.classes.btn}
                                align={"center"}> Player 이름 </StyledTableCell>
                            <StyledTableCell align={"center"}> 기능 </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.roomUserList.length !== 0
                            ?
                            props.roomUserList
                                .slice(offset, offset + limit)
                                .map(roomUser => (
                                    <TableRow key={roomUser.id}>
                                        <StyledTableCell
                                            style={{color: '#455a64', fontWeight: 'border'}}
                                            align={"center"}> {roomUser.name} </StyledTableCell>
                                        <StyledTableCell align={"center"}>
    
                                            {
                                                roomUser.streamUrl ?
                                                    <Button
                                                        style={{backgroundColor: '#ff8a65', color: '#455a64'}}
                                                        variant="outlined"
                                                    >
                                                        패널 요청 옴
                                                    </Button> :
                                                    null
                                            }
                                            &nbsp;
                                            <Button
                                                style={{color: '#455a64'}}
                                                variant="outlined"
                                            >
                                                패널 요청
                                            </Button>
                                            &nbsp;
                                            <Button
                                                style={{color: '#546e7a'}}
                                                variant="outlined"
                                            >
                                                강퇴
                                            </Button>
                                        </StyledTableCell>
                                    </TableRow>
                                ))
                            :
                            <TableRow>
                                <StyledTableCell align={"center"}> 없습니다 </StyledTableCell>
                                <StyledTableCell align={"center"}>
                                </StyledTableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            
            <footer>
                <Pagination
                    total={props.roomUserList.length}
                    limit={limit}
                    page={page}
                    setPage={setPage}
                />
            </footer>
        </div>
    )
}

export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'authStore')(
                observer(PlayerList)
            ))
    )
);
