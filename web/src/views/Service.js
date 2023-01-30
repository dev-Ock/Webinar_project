import React from "react";
import background from '../assets/images/universe1.jpg'

function Service() {
    return (
        <div style={{width:'100%', position:'relative'}}>
            <div style={{
                backgroundImage : `url(${background}`,
                backgroundRepeat: 'no-repeat',
                backgroundSize  : "cover",
                height          : '1800px',
                width           : '100%',
                verticalAlign:'middle'
            }}></div>
            <div style={{marginTop:'0px',   position: 'absolute', fontSize: "50px", transform: "translate(-50%,-50%)",textAlign:"center",top:'30%',left:'50%', color:'white',
                textShadow: '-1px 0 #000, 0 5px 10px #000, 1px 0 10px #000, 0 -1px #000'
            
            }}><h1>Hello <br/>Ock's world</h1></div>
        </div>
    )
}

export default Service;