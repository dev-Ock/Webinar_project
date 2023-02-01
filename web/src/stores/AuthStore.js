import {makeAutoObservable, toJS} from "mobx";
import {AuthTokenStorageKey} from "../repositories/Repository";
import axios from "axios";

export const State = {
    Authenticated   : 'Authenticated',
    NotAuthenticated: 'NotAuthenticated',
    Pending         : 'Pending',
    Failed          : 'Failed',
};

// 회원가입 type 유형
export const typeState = {
    10: 'Admin',
    20: 'Manager',
    30: 'Operator'
}


const log = "[authStore] ";
// export const LocalStorageTokenKey = '_BASKITOP_AUTHENTICATION_TOKEN_';

const EmptyLogin = {
    id      : '',
    password: '',
};

const EmptyUser = {
    id             : '',
    name           : '',
    createdDatetime: '',
    updatedDatetime: '',
};

const EmptySignupEmail = {
    email : ""
}

const EmptySignupUser = {
    email   : '',
    password: '',
    name    : '',
    phoneNum : ''
}

const EmptyUpdateUser = {
    id: '',
    password: '',
    email: '',
    name : '',
}

const EmptyUserList = [];



export default class AuthStore {
    login = Object.assign({}, EmptyLogin);// login.id 1. error 방지용 / 2. 명시적(무엇이 있는지)
    loginState = State.NotAuthenticated;
    loginUser = Object.assign({}, EmptyUser);
    userList = Object.assign([], EmptyUserList)
    signupEmail = Object.assign({}, EmptySignupEmail)
    signupUser = Object.assign({}, EmptySignupUser)
    updateUser = Object.assign({}, EmptyUpdateUser)


    constructor(props) {
        this.authRepository = props.authRepository; // Appstore.js 로부터 받음
        // console.log("props (in AuthStore.js)",props)
        // this.authState = AuthState.None;
        // this.user = undefined;

        makeAutoObservable(this);
    }
    
    // 중복검사할 email 담기
    onSignupEmail = (key, value) => {
        // console.log("signupEmail", this.signupEmail)
        this.signupEmail[key] = value;
        // console.log("signupEmail", this.signupEmail)
        return this.signupEmail;
    }
    
    // email 중복 검사
    *onCheckEmail() {
        try{
            console.log(this.signupEmail);
            const param = `/${this.signupEmail.email}`
            console.log('param',param)
            const result = yield this.authRepository.checkEmailDuplication(param);
            console.log("email 중복 검사 결과",result)
            return result;
        }catch(e){
            console.log(e)
        }
    }
    
    // 회원 정보 update 하기 전, 기존 정보 setting
    setUpdateUser = (user) => {
        this.updateUser = {
            id : user.id,
            password : user.password,
            email: user.email,
            name : user.name,
        };
        return this.updateUser
    }


    // 회원 정보 각 항목 update
    onUpdateUser = (key, value) => {
        this.updateUser[key] = value
        return this.updateUser
    }

    // 회원 정보 update 최종 단계
    * finalUpdateUser() {
        try{
            const param = this.updateUser
            const result =  yield this.authRepository.updateUser(param)
            console.log("~~~",result)
            return toJS(result)
        }catch(e){
            console.log('printMessage fail...', e);
        }

    }


    
    // 회원가입할 유저 정보 담기
    onSignupUser = (key, value) => {
        this.signupUser[key] = value
        console.log("## ",this.signupUser)
        return toJS(this.signupUser);
    }


    // 회원가입 유저 정보 서버로 보내기
    * doSignup() {
        // console.log("signupUser",this.signupUser)
        //
        // console.log("onSignupUser",this.onSignupUser)
        try {
            console.log('doSignup try 진입 시작')
            const param = this.signupUser
            // const user = yield this.authRepository.signUp(param)
            yield this.authRepository.signUp(param)

            // this.loginState = State.Authenticated; // 회원가입 후 서버에서 유저 정보를 주면 자동 로그인이 되고 메인 페이지로 들어가게 하기 위해.
            this.loginState = State.NotAuthenticated; // 현재는 회원가입 후 서버에서 유저 정보를 주는 코드를 구현하지 않았기 때문에 회원가입 후 로그인 컴포넌트를 띄운다.

            // this.loginUser = {
            //     id             : user.id,
            //     name           : user.name,
            //     type           : user.type,
            //     createdDatetime: user['created_datetime'],
            //     updatedDatetime: user['updated_datetime'],
            // };


            // console.log("회원가입된 정보 loginUser", this.loginUser)
            this.signupUser = Object.assign({}, EmptySignupUser)
        } catch (e) {
            console.log('회원가입 error', e)
            this.loginState = State.Failed;
            this.loginToken = '';
            this.loginUser = Object.assign({}, EmptyUser);
        }
    }

    // example
    * printMessage() {
        console.log("printMessage start...");
        try {
            const param = this.updateUser
            // const data = yield this.authRepository.updateUser(param)
            // let message = "seoungWoo";
            // let url = `/printMessage?data=${message}`;
            // const data = yield this.authRepository.printMessage(url);

            const data = yield this.authRepository.printMessage(param);

            console.log("printMessage success..! : ", data);
        } catch (e) {
            console.log('printMessage fail...', e);
        }
    }

    // 로그인 페이지 id 입력
    changeLoginId = (id) => {
        this.login.id = id; // 초기화를 안 해 놓으면 error가 날 수 있다
    };

    // 로그인 페이지 password 입력
    changeLoginPassword = (password) => {
        this.login.password = password;
    };


    // 로그인
    * doLogin() {
        this.loginState = State.Pending;

        try {
            // console.log("this.login : ",this)

            const param = this.login;
            const user = yield  this.authRepository.signIn(param);

            this.loginState = State.Authenticated;
            this.loginUser = user;
        } catch (e) {
            this.loginState = State.Failed;
            this.loginToken = '';
            this.loginUser = Object.assign({}, EmptyUser);
        }
    }



    // 로그인했는 지 체크
    * checkLogin() {
        // const token = localStorage.getItem(LocalStorageTokenKey);
        const token = sessionStorage.getItem(AuthTokenStorageKey);
        console.log('token', token)
        console.log("checkLogin token 유무 확인 전")
        if (token) {
            try {
                const user = yield  this.authRepository.signCheck(); // 이로 인해 새로고침할 때마다 로그인 페이지가 0.5초정도 보였다가 넘어감
                console.log("checkLogin user", user);
                this.loginState = State.Authenticated;
                this.loginUser = user;
            } catch (e) {
                console.log("checkoLogin 실패")
                this.loginState = State.NotAuthenticated;
                this.loginUser = Object.assign({}, EmptyUser);
                console.log(log + "error : ", e);
            }
        } else {
            console.log("token이 없어서 추가 조치하기 전")
            this.invalidateLogin();
            console.log("token이 없어서 추가 조치한 후")

        }
    }

    // 로그인이 유효하지 않을 때
    invalidateLogin = () => {
        this.login = Object.assign({}, EmptyLogin);
        this.loginState = State.NotAuthenticated;
        this.loginUser = Object.assign({}, EmptyUser);
    };

    // 로그아웃
    * doLogout() {
        // localStorage.removeItem(LocalStorageTokenKey);
        sessionStorage.removeItem(AuthTokenStorageKey);
        console.log("doLogout try 전")

        try {
            // console.log("this.authRepository44",this.authRepository) // 콘솔에 제대로 뜸
            console.log("doLogout try 진입")
            yield this.authRepository.signOut();

            this.login = Object.assign({}, EmptyLogin);
            this.loginState = State.NotAuthenticated;
            this.loginUser = Object.assign({}, EmptyUser);
        } catch (e) {
            console.log("doLogout error")
            this.login = Object.assign({}, EmptyLogin);
            this.loginState = State.NotAuthenticated;
            this.loginUser = Object.assign({}, EmptyUser);
        }
    }

    // 전체 사용자 조회
    * getUsers() {
        try {
            const users = yield  this.authRepository.getUserList(); // TypeError: Cannot read properties of undefined (reading 'authRepository')
            this.userList = users
            // console.log("전체 사용자 조회 userList",this.userList)
            // console.log("users",users)
            // console.log("this.userList",this.userList.map(i => console.log(i)))
            // console.log("yeah2")
        } catch (e) {
            console.log(e)
        }
    }

    // 회원 삭제 or 탈퇴
    * removeUser(id) {
        try {
            const paramId = `/${id}`
            yield this.authRepository.removeUser(paramId)

            console.log("로그인유저",this.loginUser)
        } catch (e) {
            console.log(e)
        } finally {
            // 전체 사용자 조회
            this.getUsers();
        }
    }
}