export const styles = (theme) => ({
    root:{
        height:'100vh',
        display: 'flex',
        alignItems: 'center',
        '& *':{
            fontFamily:'Noto Sans KR',
        },
        '& .MuiContainer-root':{
            padding:'58px 100px',
            border:'1px solid #d9d9d9',
            borderRadius:12,
        },
    },
    btn : {
        color: '#fff'
    }
});