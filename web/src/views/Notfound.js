import React from "react";
import {inject, observer} from "mobx-react";

function Notfound() {
    return (
        <div style={{marginTop : "100px", fontSize:"40px"}}>
            <h1>Not Found</h1>
        </div>
    )
}


export default inject('authStore')(
    observer(Notfound)
);