import {makeAutoObservable} from "mobx";
import {AuthTokenStorageKey} from "../repositories/Repository";

export const LocalStorageTokenKey = '_BASKITOP_AUTHENTICATION_TOKEN_';


const EmptyRoom = {
    title: '',
    descriptions: '',
    password: '',
    status: '',
    url: '',
    createdAt: '',
    startedAt: '',
};

export default class AuthStore {
    constructor(props) {
        this.roomRepository = props.roomRepository;

        // this.authState = AuthState.None;
        // this.user = undefined;

        makeAutoObservable(this);
    }

    roomMake = Object.assign({}, EmptyRoom);

    changeTitle = (title) => {
        this.roomMake.title = title;
    };

    changeDescriptions = (descriptions) => {
        this.roomMake.descriptions = descriptions;
    };

    changePassword = (password) => {
        this.roomMake.password = password;
    };

    invalidateLogin = () => {
        this.roomMake = Object.assign({}, EmptyRoom);
    };

    // 방만들기 정보 서버로 보내기
    * doMakeRoom () {
        try {

            console.log('makeroom try 진입 시작')
            const param = this.roomMake

            this.roomMake = {
                userId          : "1",
                status          : "wait",
                url             : "1234",
                createdAt       : param['created_at'],
                startedAt       : param['started_at'],
            };

            console.log('param확인', param)
            const room = yield this.roomRepository.makeRoom(param)

            const random = (length = 8) => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let str = '';

                for (let i = 0; i < length; i++) {
                    str += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                return str;

            };

            this.roomMake = {
                title           : room.title,
                descriptions    : room.descriptions,
                password        : room.password,
                status          : "wait",
                url             : random(6),
                createdAt       : room['created_at'],
                startedAt       : room['started_at'],
            };

            console.log("방 정보 roomMake",this.roomMake)
            this.roomMake = Object.assign({}, EmptyRoom)
        } catch (e) {
            console.log('방정보 error',e)
            // this.loginState = State.Failed;
            // this.loginToken = '';
            // this.loginUser = Object.assign({}, EmptyUser);
        }
    }

}