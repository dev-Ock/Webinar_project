import {makeAutoObservable, toJS} from "mobx";
import { createContext, useState } from 'react';
import {RoomMakeStreamUrl} from "../repositories/Repository";

export const LocalStorageTokenKey = '_BASKITOP_AUTHENTICATION_TOKEN_';



export const RoomMakeState = { // 방 만들기 성공 여부
    Empty: "Empty",
    Pending: "Pending", // 방생성 버튼을 누르고 응답을 받기 전 까지
    Success: "Success", // 방생성 성공 응답 시
    Failed: "Failed" // 방생성 실패 응답 시
}

export const RoomStateType = { // 만든 방의 스트리밍 상태
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
        makeAutoObservable(this);
    }

    roomMakeState = RoomMakeState.Empty;

    roomStreamUrl = '';

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
            this.roomMakeState = RoomMakeState.Pending;

            this.roomMake.publisherId = userId;
            this.roomMake.state = RoomStateType.Wait;
            this.roomMake.streamUrl = randomStreamUrl;

            const param = this.roomMake
            console.log('doMakeRoom() try문 yield makeRoom 전 ')

            yield this.roomRepository.makeRoom(param)
            console.log('doMakeRoom() try문 yield makeRoom 후 ' )

            // this.roomMakeState = RoomMakeState.Success;
            // this.roomMake = Object.assign({}, EmptyRoom) // yield는 호출한 곳으로 돌아가기 때문에 왼쪽 코드 무소용.
        } catch (e) {
            console.log('방정보 error',e)
            this.roomStreamUrl = '';
            this.roomMakeState = RoomMakeState.Failed;
            this.roomMake = Object.assign({}, EmptyRoom)

        } finally {
            // 위 try 문에서 yield가 안 끝나도 finally는 탐
            const checkRoomStreamUrl = sessionStorage.getItem(RoomMakeStreamUrl);
            // console.log('doMakeRoom() finally 진입 checkRoomStreamUrl: ', checkRoomStreamUrl)

            // sessionStorage에 streamUrl 저장 확인 = makeRoom Promise가 then에서 저장함 = 백 성공적으로 다녀왔는지
            if ( checkRoomStreamUrl.length > 0 ){
                this.roomMakeState = RoomMakeState.Success;
                // console.log("doMakeRoom() finally 진음입 - 백 진입 후 roomMakeState: ", this.roomMakeState)
            } else {
                this.roomMakeState = RoomMakeState.Failed;
                // console.log("doMakeRoom() finally 진입 - 백 진입 전 roomMakeState: ", this.roomMakeState)
            }
        }
        // console.log("doMakeRoom() finally 끝난 후 roomMakeState: ", this.roomMakeState)


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