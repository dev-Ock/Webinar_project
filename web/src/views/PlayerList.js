import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
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


// const styles = theme => ({
//     mainContainer: {
//         flexGrow: 1,
//         padding : theme.spacing(3),
//
//     },
//     appBarSpacer : theme.mixins.toolbar,
//     mainContent  : {
//         marginTop    : theme.spacing(2),
//         display      : 'flex',
//         flexDirection: 'column',
//         alignItems   : 'center',
//     },
//     toolbar      : {
//         width: '100%',
//
//     },
// });

function PlayerList(props) {
    
    // const [posts, setPosts] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    
    
    return (
        
        <div
            style={{
                textAlign: 'center', borderStyle: 'solid', borderColor: 'black',
            }}
        >
            
            <Button
                variant="outlined"
                style={{marginTop: '20px'}}
                onClick={props.onRefreshPlayerList}
            >
                refresh
            </Button>
            <br/>
            <br/>
            <div style={{color: 'black'}}> Player 수 : {props.roomUserList.length} 명</div>
            <br/>
            
            <label>
                한 페이지에 표시할 player 수 :
                &nbsp;
                <select
                    value={limit}
                    onChange={({target: {value}}) => setLimit(Number(value))}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                </select>
            </label>
            <br/>
            <br/>
            
            
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}> Player 이름 </TableCell>
                            <TableCell align={"center"}> 기능 </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.roomUserList.length !== 0
                            ?
                            props.roomUserList
                                .slice(offset, offset + limit)
                                .map(roomUser => (
                                    <TableRow key={roomUser.id}>
                                        <TableCell align={"center"}> {roomUser.name} </TableCell>
                                        <TableCell align={"center"}>
                                            <Button
                                                variant="contained"
                                            >
                                                강퇴 버튼 만들 예정
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            :
                            <TableRow>
                                <TableCell align={"center"}> 없습니다 </TableCell>
                                <TableCell align={"center"}>
                                </TableCell>
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
        inject('roomStore', 'authStore')(
            observer(PlayerList)
        )
    )
);
