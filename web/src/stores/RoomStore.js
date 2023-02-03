import {makeAutoObservable, toJS} from "mobx";
import { createContext, useState } from 'react';
import {AuthTokenStorageKey} from "../repositories/Repository";

export const LocalStorageTokenKey = '_BASKITOP_AUTHENTICATION_TOKEN_';

export const RoomStateType = {
    Wait : "Wait",
    Progress : "Progress",
    Complete : "Complete",
    Fail : "Fail"

}

const EmptyRoom = {
    title: '',
    publisherId: '',
    description: '',
    password: '',
    maximum:'',
    state: '',
    streamUrl: '',
    startTime: '',
    link: ''
};
const EmptyRoomList = [];

export default class RoomStore {

    roomList = Object.assign([], EmptyRoomList)
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

    changeDescription = (description) => {
        this.roomMake.description = description;
    };
    changeMaximum = (maximum) => {
        this.roomMake.maximum = maximum;
    };
    changeStartTime = (startTime) => {
        this.roomMake.startTime = startTime;
    };
    changeLink = (link) => {
        this.roomMake.link = link;
    };

    changePassword = (password) => {
        this.roomMake.password = password;
    };


    invalidateLogin = () => {
        this.roomMake = Object.assign({}, EmptyRoom);
    };

    // 방만들기 정보 서버로 보내기
    * doMakeRoom (userId) {

            // streamUrl 생성 함수
            function random (length){
                let str = '';
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for (let i = 0; i < length; i++) {
                    str += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return str;
            }
            const randomStreamUrl = random(8)
            // console.log("랜덤 생성확인", randomStreamUrl)

        try {
            this.roomMake.publisherId = userId;
            this.roomMake.state = RoomStateType.Wait;
            this.roomMake.streamUrl = randomStreamUrl;
            // console.log('makeroom try 진입, user정보 : ', this.roomMake )

            const param = this.roomMake
            // console.log('param확인', param)
            yield this.roomRepository.makeRoom(param)
            console.log("roomMake Success!",this.roomMake)

            this.roomMake = Object.assign({}, EmptyRoom)
        } catch (e) {
            console.log('방정보 error',e)
            // this.loginState = State.Failed;
            // this.loginToken = '';
            // this.loginUser = Object.assign({}, EmptyUser);
        }
    }
//일반 룸 테이블 데이터 조회
    * selectJustRoomList() {
        console.log("selectroom확인")
            try {
                const roomList = yield this.roomRepository.getRoomList()
                this.roomList = roomList
                console.log('param확인', roomList)

            } catch (e) {
                console.log('방목록 조회 error', e)
            }

    };

    roomListLength = toJS(this.roomList.length);

    * selectRoomList() {
        console.log("selectroomusername확인")
            try {
                const roomList = yield this.roomRepository.getRoomUserNameList()
                this.roomList = roomList
                this.roomListLength = toJS(roomList).length
                console.log('param확인', toJS(roomList).length)

            } catch (e) {
                console.log('방목록 조회 error', e)
            }

    };




}