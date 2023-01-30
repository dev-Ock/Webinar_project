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
            
            <Container component="main" className={classes.mainContainer} >
       
                <div className={classes.appBarSpacer}/>
                <div className={classes.mainContent}>
                    <Toolbar className={classes.toolbar} style={{backgroundColor: this.state.color}}>
                 
                        <div style={{textAlign:'center'}} >
                            <h1>{this.props.authStore.loginUser.name}님 환영합니다.</h1>
                        </div>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: '1.5rem',
                                    right: '1.5rem',
                                    borderRadius: '50%',
                                }}
                                onClick={() => {
                                    const colors = [
                                        'yellow',
                                        'orange',
                                        'pink',
                                        'purple',
                                        'skyblue',
                                        'grey',
                                        'green'
                                    ];
                            
                                    const nextColor = colors.indexOf(this.state.color);
                                    this.setState({color : colors[nextColor + 1] ?? colors[0]})
                                    console.log(this.state.color)
                                }}
                            >
                                🎨
                            </IconButton>
                    </Toolbar>
                </div>
            </Container>
        );
    }
};

export default withSnackbar(withRouter(withStyles(styles)(inject('authStore')(
    observer(Home)
))));