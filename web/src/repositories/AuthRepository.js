import {Repository} from "./Repository";
import axios from "axios";

export default class AuthRepository extends Repository {
    constructor(props) {
        super();
        // controller
        this.requestPrefix = props.serverContextPath + "/api/v1/authentications";
    }
    
    // 회원가입
    // signUp = (param) => {
    //     console.log('authRepository sighUp 접근')
    //     return new Promise((resolve,reject) => {
    //         this.getRequestPromise('post', 'http://localhost:3003' + '/auth/signup',param )
    //             .then(data => {
    //                 console.log('data',data)
    //                 const token = data.token
    //                 this.setAuthTokenToStorage(token)
    //                 resolve(data.user)
    //             })
    //             .catch(error =>{
    //                 console.log('error',error)
    //                 this.removeAuthTokenFromStorage()
    //                 reject(error)
    //             })
    //     })
    // }
    
    
    // 이메일 중복 검사
    checkEmailDuplication = (paramEmail) => {
        console.log('authRepository checkEmailDuplication 접근')
        return new Promise((resolve,reject)=>{
            this.getRequestPromise('get', this.requestPrefix + `/read`+ paramEmail)
                .then(data => {
                    console.log("checkEmailDuplication", data)
                    resolve(data)
                })
                .catch(error => {
                    console.log('[error] checkEmailDuplication', error)
                    reject(error)
                })
        })
    }
    
    // 회원가입
    signUp = (param) => {
        console.log('authRepository sighUp 접근')
        return new Promise((resolve,reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/signup', param)
                .then(data => {
                    console.log("signUp data",data)
                    resolve(data)
                })
                .catch(error =>{
                    console.log('error',error)
                    // this.removeAuthTokenFromStorage()
                    reject(error)
                })
        })
    }
    
    
    // 회원정보수정
    updateUser = (param) => {
        console.log('authRepository updateUser 접근')
        return new Promise((resolve,reject) => {
            this.getRequestPromise('put', this.requestPrefix + '/update/user',param )
                .then(data => {
                    console.log("AuthRepository updateUser 결과 data : ", data)
                    resolve(data)
                })
                .catch(error =>{
                    console.log('error',error)
                    reject(error)
                })
        })
    }
    // updateUser = (param) => {
    //     console.log('authRepository updateUser 접근')
    //     return new Promise((resolve,reject) => {
    //         this.getRequestPromise('put', 'http://localhost:3003' + '/auth/update',param )
    //             .then(data => {
    //                 resolve(data.user)
    //             })
    //             .catch(error =>{
    //                 console.log('error',error)
    //                 reject(error)
    //             })
    //     })
    // }
    
    printMessage = (param) => {
        console.log('authRepository sighUp 접근')
        return new Promise((resolve,reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/printMessage', param)
                .then(data => {
                    resolve(data)
                })
                .catch(error =>{
                    console.log('error',error)
                    // this.removeAuthTokenFromStorage()
                    reject(error)
                })
        })
    }
    
    // 로그인
    signIn = (param) => {
        // console.log("this.requestPrefix : ", this.requestPrefix)
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/signin', param)
                .then(data => {
                    // console.log("token",data)
                    const token = data.token;
                    this.setAuthTokenToStorage(token);
                    console.log("data.user", data.user)
                    resolve(data.user);
                })
                .catch(error => {
                    this.removeAuthTokenFromStorage();

                    reject(error);
                });
        });
    }
    

    // 로그인 체크
    signCheck = () => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/signcheck')
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    this.removeAuthTokenFromStorage()

                    reject(error);
                });
        });
    }

    // 로그아웃
    signOut = () => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/signout')
                .then(data => {
                    this.removeAuthTokenFromStorage();

                    resolve();
                })
                .catch(error => {
                    this.removeAuthTokenFromStorage();

                    reject(error);
                });
        });
    }
    
    // 사용자 전체 조회
    getUserList = () => {
        return new Promise((resolve,reject)=>{
            // this.getRequestPromise('get','http://localhost:3003' + '/administration/get/userlist')
            this.getRequestPromise('get', this.requestPrefix + '/get/userlist')
                .then(data =>{
                    console.log(data);
                    resolve(data);
                    // resolve(data.users);
                })
                .catch(error => {
                    reject(error);
                    // console.log("error",error);
                });
        });
    }
    
    // 사용자 삭제
    removeUser = (paramId) => {
        return new Promise((resolve, reject)=>{
            this.getRequestPromise('delete',this.requestPrefix + `/delete/user`+ paramId)
                .then(data => {
                    if(data === 1){
                        console.log("[message] removeUser : success")
                    }else{
                        console.log("[error] removeUser : ", data)
                    }
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
    
    // removeUser = (paramId) => {
    //     return new Promise((resolve, reject)=>{
    //         this.getRequestPromise('delete','http://localhost:3003' + `/auth/delete`+paramId)
    //             .then(data => {
    //                 console.log("[message] removeUser : ", data.message)
    //                 resolve()
    //             })
    //             .catch(error => {
    //                 reject(error)
    //             })
    //     })
    // }
    
}