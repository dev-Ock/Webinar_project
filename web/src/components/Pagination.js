import {Button} from "@mui/material";
import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";
// import {styles} from "./styles/PaginationStyles"

const styles = {
    btn : {
        backgroundColor: 'red',
        color: 'white'
    }
}


function Pagination(props) {
    
    // console.log(props)
    const {classes} = props;
    const {total, limit, page, setPage} = props;
    const pages = Math.ceil(total / limit);
    return (
        <div
            style={{margin: '32px'}}
        >
            <Button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
            >
                &lt;
            </Button>
            
            {
                Array(pages)
                    .fill()
                    .map((_, i) => (
                        <Button
                            style={{
                                // backgroundColor: 'blue',
                                color: 'black',
                                border: 'none',
                                borderRadius: '15px',
                                padding: '10px -10px',
                                margin: '2px',
                                fontSize: '1rem'
                            }}
                            
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            aria-current={page === i + 1 ? "page" : null}
                        >
                            {i + 1}
                        </Button>
                    ))
            }
            <Button
                // style={{backgroundColor: 'black', color: 'white'}}
                // className={classes.btn}
                onClick={() => setPage(page + 1)}
                disabled={page === pages}
            >
                &gt;
            </Button>
        </div>
    )
}


export default withSnackbar(withRouter(
        withStyles(styles)(
            inject('roomStore', 'authStore')(
                observer(Pagination)
            )
        )
    )
);