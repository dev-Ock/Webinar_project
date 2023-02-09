import React, { Component }from "react";
import {Button, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {inject, observer} from "mobx-react";



const styles = theme =>({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px',
        paddingTop: '2em',
    },
    button: {
        border: 'none',
        borderRadius: '8px',
        padding: '8px',
        margin: '0',
        background: '#a1a1a1',
        color: 'white',
        fontSize: '1rem',
        '&:hover': {
            background: 'skyblue',
            cursor: 'pointer',
            transform: 'translateY(-2px)',
        },
    },
    sideButton: {
        background: '#e7e5e5',
        cursor: 'default',
        transform: 'none',
    },
    activeButton: {
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        cursor: 'default',
        transform: 'none',
    },
});

class Pagination extends React.Component {
    constructor() {
        super();

        this.state = {
            pageGroup: Math.ceil(this.props.curPage / this.props.pageCount),
        };
    }


    pagination = () => {
        let { firstNum, lastNum } = this.getFirstAndLastNum();
        let arr = [];
        for (let i = firstNum; i <= lastNum; i++) {
            arr.push(
                <Button
                    key={i}
                    onClick={() => this.props.setCurPage(i)}
                    i={i}
                    curPage={this.props.curPage}
                >
                    {i}
                </Button>
            );
        }
        return arr;
    };
 //pagecount = 화면에 나타날 페이지 갯수
    getFirstAndLastNum = () => {
        let pageGroup = this.state.pageGroup;
        let lastNum = pageGroup * this.props.pageCount;
        if (lastNum > this.props.totalPage) {
            lastNum = this.props.totalPage;
        }
        let firstNum = lastNum - (this.props.pageCount - 1);
        if (this.props.pageCount > lastNum) {
            firstNum = 1;
        }
        return { firstNum, lastNum };
    };

    handlePrevClick = () => {
        this.setState((state) => ({
            pageGroup: state.pageGroup - 1,
        }));
    };

    handleNextClick = () => {
        this.setState((state) => ({
            pageGroup: state.pageGroup + 1,
        }));
    };

    render() {
        const {classes} = this.props;
        const {roomList,roomListLength,pageDetail} = this.props.roomStore;
        let { firstNum, lastNum } = this.getFirstAndLastNum();
        return (
            <Typography>
                <Button
                    onClick={this.handlePrevClick}
                    disabled={firstNum === 1}
                    className={`${classes.button} ${classes.sideButton}`}
                >
                    &lt;
                </Button>
                {this.pagination()}
                <Button
                    onClick={this.handleNextClick}
                    disabled={lastNum === this.props.totalPage}
                    className={`${classes.button} ${classes.sideButton}`}
                >
                    &gt;
                </Button>
            </Typography>
        );
    }
}

export default withStyles(styles)(observer(Pagination));