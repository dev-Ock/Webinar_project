import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

import {Container, Toolbar} from "@material-ui/core";
import {Typography, Card, IconButton, Box} from '@mui/joy';
import {inject, observer} from "mobx-react";
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
            
           <div style={{marginTop:"100px"}}>환영합니다</div>
        );
    }
};

export default withSnackbar(withRouter(withStyles(styles)(inject('authStore')(
    observer(Home)
))));