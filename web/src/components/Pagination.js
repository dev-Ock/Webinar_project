import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";

const styles = (theme) => ({
    pagination : {
        marginTop: '32px',
    },
    btn : {
        border       : 'none',
        borderRadius : '8px',
        padding      : '8px',
        margin       : '0 2px 0 2px',
        background   : '#b0bec5',
        color        : 'white',
        fontSize     : '1rem',
        '&:hover'    : {
            background: '#ff5252',
            cursor    : 'pointer',
            transform : 'translateY(-2px)'
        },
        '&[disabled]': {
            background: '#eceff1',
            cursor    : 'revert',
            transform : 'revert',
        },
        '&[aria-current]': {
            background: '#37474f',
            fontWeight: 'bold',
            cursor    : 'revert',
            transform : 'revert'
        }
    }
});

function Pagination(props) {
    
    const {classes} = props;
    const {total, limit, page, setPage} = props;
    const pages = Math.ceil(total / limit);
    
    return (
        <div>
            <div
                className={classes.pagination}
            >
                {/*<div*/}
                {/*    className={classes.btn}*/}
                {/*><h1>hi</h1></div>*/}
                <button
                    className={classes.btn}
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    &lt;
                </button>
                
                {
                    Array(pages)
                        .fill()
                        .map((_, i) => (
                            <button
                                className={classes.btn}
                                key={i + 1}
                                onClick={() => {
                                    setPage(i + 1);
                                    console.log('page', page)
                                }}
                                aria-current={page === i + 1 ? "page" : null}
                            >
                                {i + 1}
                            </button>
                        ))
                }
                <button
                    className={classes.btn}
                    onClick={() => setPage(page + 1)}
                    disabled={page === pages}
                >
                    &gt;
                </button>
            </div>
            <div style={{color: '#90a4ae'}}>
                <h3>{page} / {pages}</h3>
            </div>
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