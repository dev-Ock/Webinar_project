import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {Container, Toolbar} from "@material-ui/core";
import {Card, IconButton, Box} from '@mui/joy';
import {inject, observer} from "mobx-react";
import Main from '../assets/images/main.png'
import CardMedia from '@mui/material/CardMedia';
import AddIcon from '@mui/icons-material/Add';

import {AuthTokenStorageKey} from "../repositories/Repository";


const styles = theme => ({
    mainContainer: {
        flexGrow: 1,
        padding : theme.spacing(3),
        
    },
    appBarSpacer : theme.mixins.toolbar,
    mainContent  : {
        marginTop    : theme.spacing(2),
        display      : 'flex',
        flexDirection: 'column',
        alignItems   : 'center',
    },
    toolbar      : {
        width: '100%',

    },
});

class Home extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            color : 'green'
        }
    }
    componentDidMount() {
        this.props.enqueueSnackbar("Welcome to Ock's world", {
            variant: 'info'
        });
    }
    
    render() {
        const {classes} = this.props;
        
        return (
            <div style={{marginTop:"200px"}}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <div style={{margin : "20px"}}>
                        <Typography variant="h1" component="div">
                            모든 사용자를 위한 영상 통화 및 화상 회의
                        </Typography>
                        <Typography variant="h5" gutterBottom style={{marginTop : "20px"}}>
                            Onthelive는 기기 종류와 관계없이 모든 사용자에게 안전하고 품질이 우수한 화상 회의와 영상 통화 기능을 제공하는 서비스입니다
                        </Typography>
                        <Button variant="contained" size="large" component={Link} to="/room-make" style={{marginTop : "40px", width:"200px", height:"50px"}} startIcon={<AddIcon />}>방만들기</Button>
                        </div>
                        </Grid>
                    <Grid item xs={8}>
                        <div style={{margin : "20px"}}>
                        <img src={Main} width="100%"
                        />
                        </div>
                    </Grid>
                </Grid>
            </Box>
            </div>

        );
    }
};

export default withSnackbar(withRouter(withStyles(styles)(inject('authStore')(
    observer(Home)
))));