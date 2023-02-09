import {makeAutoObservable, toJS} from "mobx";
import {AuthTokenStorageKey, UserId} from "../repositories/Repository";

export const State = {
    Authenticated   : 'Authenticated',
    NotAuthenticated: 'NotAuthenticated',
    Pending         : 'Pending',
    Failed          : 'Failed',
};

const EmptySignupTempUser = {
    email   : '',
    password: '',
    confirmPassword: "",
    name    : '',
    phoneNum : ''
}

const EmptySignupCheckUser = {
    email : "",
    password: ""
}

const EmptySignupUser = {
    email   : '',
    password: '',
    name    : '',
    phoneNum : ''
}

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
    signupTempUser = Object.assign({},EmptySignupTempUser)
    signupCheckUser = Object.assign({}, EmptySignupCheckUser)
    signupUser = Object.assign({}, EmptySignupUser)
    updateUser = Object.assign({}, EmptyUpdateUser)


    constructor(props) {
        this.authRepository = props.authRepository; // Appstore.js 로부터 받음
        // console.log("props (in AuthStore.js)",props)
        // this.authState = AuthState.None;
        // this.user = undefined;

        makeAutoObservable(this);
    }
    
    // 회원가입 전 임시 정보 담기
    onSignupTempUser = (key, value) => {
        this.signupTempUser[key] = value;
        return this.signupTempUser;
    }
    
    // 중복 검사할 email, 일치 검사할 password 담기
    onSignupCheckUser = (key, value) => {
        this.signupCheckUser[key] = value;
        return this.signupCheckUser;
    }
    
    // email 중복 검사
    *onSignupDuplicationCheckEmail() {
        try{
            const param = `/${this.signupCheckUser.email}`
            const result = yield this.authRepository.checkEmailDuplication(param);
            console.log("email 중복 검사 결과",result)
            return result;
        }catch(e){
            console.log(e)
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
        try {
            console.log('doSignup try 진입 시작')
            const param = this.signupUser
            yield this.authRepository.signUp(param)
            this.loginState = State.NotAuthenticated; // 현재는 회원가입 후 서버에서 유저 정보를 주는 코드를 구현하지 않았기 때문에 회원가입 후 로그인 컴포넌트를 띄운다.
            this.signupTempUser = Object.assign({},EmptySignupTempUser);
            this.signupCheckUser = Object.assign({}, EmptySignupCheckUser);
            this.signupUser = Object.assign({}, EmptySignupUser);
            
        } catch (e) {
            console.log('회원가입 error', e)
            this.loginState = State.Failed;
            this.loginToken = '';
            this.loginUser = Object.assign({}, EmptyUser);
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
    * doLogin() { //메모리에 저장됌.
        this.loginState = State.Pending;

        try {
            // console.log("this.login : ",this)

            const param = this.login;
            const user = yield  this.authRepository.signIn(param);

            this.loginState = State.Authenticated;
            this.loginUser = user;
            console.log('id: ', this.loginUser.id)
            sessionStorage.setItem(UserId, this.loginUser.id)
            
            
        } catch (e) {
            this.loginState = State.Failed;
            this.loginToken = '';
            this.loginUser = Object.assign({}, EmptyUser);
            sessionStorage.removeItem(UserId)
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
                sessionStorage.setItem(UserId, this.loginUser.id)
            } catch (e) {
                console.log("checkoLogin 실패")
                this.loginState = State.NotAuthenticated;
                this.loginUser = Object.assign({}, EmptyUser);
                sessionStorage.removeItem(UserId)
                console.log("error : ", e);
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
        sessionStorage.removeItem(UserId)
    };
    
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
    
    // 로그아웃
    * doLogout() {
        console.log("doLogout try 전")

        try {
            sessionStorage.removeItem(AuthTokenStorageKey);
            console.log("doLogout try 진입")
            yield this.authRepository.signOut();

            this.login = Object.assign({}, EmptyLogin);
            this.loginState = State.NotAuthenticated;
            this.loginUser = Object.assign({}, EmptyUser);
            sessionStorage.removeItem(UserId)
        } catch (e) {
            sessionStorage.removeItem(AuthTokenStorageKey);
            console.log("doLogout error")
            this.login = Object.assign({}, EmptyLogin);
            this.loginState = State.NotAuthenticated;
            this.loginUser = Object.assign({}, EmptyUser);
            sessionStorage.removeItem(UserId)
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
}
