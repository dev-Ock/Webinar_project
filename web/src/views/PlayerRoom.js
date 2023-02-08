import React from "react";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";

const styles = {
    // roomMakeImg: {
    //     width: "100%",
    //     alignItems   : 'center'
    // },
    // roomMakeImgOutDiv:{
    //     paddingTop: 70,
    //     paddingLeft: 110,
    //     paddingRight: 110,
    // }
}

class PlayerRoom extends React.Component {
    
    
    
    
    render() {
        return(
            <div style={{marginTop:"100px"}}>
                <h1>여긴 publisher room</h1>
            </div>
        
        )
    }
    
    
}

export default withSnackbar(withRouter(
        withStyles(styles) (
            inject('roomStore', 'authStore')(
                observer(PlayerRoom)
            )
        )
    )
);