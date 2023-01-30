import React from "react";
import {inject, observer} from "mobx-react";
import moment from "moment";
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@material-ui/core";

class Mypage extends React.Component {
    
    
    
    render() {
        const {loginUser} = this.props.authStore
        
        
        return (
            <TableContainer component={Paper} style={{marginTop : '100px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">아이디</TableCell>
                            <TableCell align="center">이름</TableCell>
                            <TableCell align="center">email</TableCell>
                            <TableCell align="center">유형</TableCell>
                            <TableCell align="center">가입날짜</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">{loginUser.id}</TableCell>
                            <TableCell align="center">{loginUser.name}</TableCell>
                            <TableCell align="center">{loginUser.email}</TableCell>
                            <TableCell align="center">{loginUser.type}</TableCell>
                            <TableCell align="center">{moment(loginUser.createdDatetime).format('YYYY년 MM월 DD일')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            
            // <div style={{margin : '100px 40px 0px 40px'}}>
            //     <h1>mypage</h1>
            //     <h1>아이디 : {loginUser.id}</h1>
            //     <h1>이름 : {loginUser.name}</h1>
            //     <h1>email : {loginUser.email}</h1>
            //     <h1>유형 : {loginUser.type}</h1>
            //     <h1>가입날짜 : {moment(loginUser.createdDatetime).format('YYYY년 MM월 DD일')}</h1>
            // </div>
        
        
        )
    }
}

export default inject('authStore')(
    observer(Mypage)
);
