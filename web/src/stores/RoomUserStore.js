import {makeAutoObservable, toJS} from "mobx";
import {createContext, useState} from 'react';
import * as Repository from "../repositories/Repository";
import {
    RoomMakePublisherId,
    RoomMakeRoomID,
    RoomMakeStreamUrl,
    RoomViewStreamUrl,
    UserId
} from "../repositories/Repository";
import {RoomStateType} from "./RoomStore";

export const RoomUserStateType = { // player의 스트리밍 상태
    Wait      : "Wait",
    Progress  : "Progress",
    Complete  : "Complete",
    Uncomplete: "Uncomplete",
    Pending   : "Pending",
    Failed    : "Failed"
}

export const EmptyRoomUserDetail ={
    id: '',
    roomId: '',
    publisherId: '',
    playerId: '',
    state: '',
    streamUrl: '',
}

export const EmptyRoomUserList = [];

export default class RoomUserStore {
    streamUser = Object.assign({},EmptyRoomUserDetail) // EmptyRoomUserDetail가 { } 여서, target도 [ ] 에서 { } 로 바꿨습니다
    roomUserList = Object.assign([], EmptyRoomUserList)

    constructor(props) {
        this.roomUserRepository = props.roomUserRepository;
        this.roomUserHistoryRepository = props.roomUserHistoryRepository;
        makeAutoObservable(this);
    }

    // create RoomUser
    * onCreateRoomUser(param){
        console.log("RoomUserStore onCreateRoomUser param : ",param)
        // console.log('this',this)
        const result = yield this.roomUserRepository.onCreateRoomUser(param);
        return result;
    }

    // 전체 룸 유저 정보 조회 (현재 세미나에 참여중인 룸유저)
    * getAllRoomUsers() {
        const allRoomUsersData = yield this.roomUserRepository.onSelectAllRoomUsers();
        console.log("RoomUserStore ")
        this.roomUserList = allRoomUsersData;
        return this.roomUserList;
    }


    // 세미나 참석 중인 player list 조회
    * getRoomUserList(roomId) {
        let roomUser = yield this.roomUserRepository.onSelectRoomUserList(roomId);
        console.log('roomUser', roomUser)
    
        let pannelList = [];
        let notPannelIst = [];
        roomUser.map(roomUser => {
            roomUser.streamUrl ? pannelList.push(roomUser) : notPannelIst.push(roomUser);
        })
        roomUser = pannelList.concat(notPannelIst);
        return roomUser;

        //참여요청한 player streamurl update
    }

    
    // pannel 요청 확인
    async onCheckPannelRequest(roomId) {
        const roomUser = await this.roomUserRepository.onSelectRoomUserList(roomId);
        let pannelRequestList = [];
        await roomUser.map((player) => {
            if(player.streamUrl){
                pannelRequestList.push(player);
            }
                // pannelRequestList[player.playerId] = {
                //     roomUserTableId : player.id,
                //     roomId : player.roomId,
                //     publisherId : player.publisherId,
                //
                // }
        } )
        console.log("pannelRequestList", pannelRequestList)
        return pannelRequestList;
    }
    

    //handsupuser streamurl 추가
    * handsUpUser(data) {
        console.log('여기오나')
        const streamUser = yield this.roomUserRepository.onHandsUpRoomUser(data)
        console.log('roomUser', streamUser)
        this.streamUser = streamUser;
        return streamUser;
    }
    //create room user history
    * onCreateRoomUserHistory(data){
        console.log("RoomUserStore onCreateRoomUser param : ",data)
        // console.log('this',this)
        const result = yield this.roomUserHistoryRepository.onCreateHistory(data);
        return result;
    };
    
    // roomUser state change DB Update
    * onUpdateRoomUserState(data) {
        return yield this.roomUserRepository.onUpdateRoomUser(data);
    }
    
    // roomUser state : Pending
    onPendingRoomUserState(data) {
        console.log('onPendingRoomUser data : ', data);
        try{
            data.state = RoomUserStateType.Pending;
            this.onUpdateRoomUserState(data)
                .then(result => {
                    console.log("onPendingUserRoom", result);
                    if(result === 1){
                        console.log("onPendingUserRoom 성공")
                    }
                    if (result !== 1) {
                        // this.onFailedRoomUserState(data);
                        console.log("onPendingUserRoom 실패")
                    }
                })
        }catch(e){
            console.log(e);
        }
    }
    
    // roomUser state : Progress
    onProgressRoomUserState(data) {
        console.log('onProgressRoomUser data : ', data);
        try{
            data.state = RoomUserStateType.Progress;
            this.onUpdateRoomUserState(data)
                .then(result => {
                    console.log("onProgressRoomUser", result);
                    if(result === 1){
                        console.log("onProgressRoomUser 성공")
                    }
                    if (result !== 1) {
                        // this.onFailedRoomUserState(data); // roomData.state = RoomStateType.Failed;
                        console.log("onProgressRoomUser 실패")
                    }
                })
        }catch(e){
            console.log(e);
        }
    }
    
    // roomUser state : Complete
    onCompleteRoomUserState(data) {
        console.log('onCompleteRoomUser data : ', data);
        try{
            data.state = RoomUserStateType.Complete;
            this.onUpdateRoomUserState(data)
                .then(result => {
                    console.log("onCompleteRoomUser", result);
                    if(result === 1){
                        console.log("onCompleteRoomUser 성공")
                        alert('세미나가 종료되었습니다.');
                    }
                    if (result !== 1) {
                        // this.onFailedRoomUserState(data); // roomData.state = RoomStateType.Failed;
                        console.log("onCompleteRoomUser 실패")
                        alert('세미나가 종료되었습니다.');
                    }
                })
        }catch(e){
            console.log(e);
        }
    }
    
    // roomUser state : Failed
    onFailedRoomUserState(data) {
        console.log('onFailedRoomUser data : ', data);
        try{
            data.state = RoomUserStateType.Failed;
            this.onUpdateRoomUserState(data)
                .then(result => {
                    console.log("onFailedRoomUser 성공");
                    if (result !== 1) {
                        throw new Error("onFailedRoomUser 실패");
                    }
                })
        }catch(e){
            console.log(e);
        }
    }
    
    
    // (publisherRoom에서 제어하는 경우) create RoomUserHistory & update RoomUser [State Progress]
    onProgressRoomUserAndHistoryByPublisher(roomId, roomPlayerList){
        console.log('onProgressRoomUserStateByRoomId roomId : ', roomId, roomPlayerList);
        try{
            this.roomUserHistoryRepository.onProgressRoomUserAndHistoryByPublisher(roomId, roomPlayerList)
                .then(result => {
                    console.log("onProgressRoomUserStateByRoomId", result);
                })
        }catch(e){
            console.log(e);
        }
    }
    
    // (publisherRoom에서 제어하는 경우) create RoomUserHistory & update RoomUser [State Complete]
    onCompleteRoomUserAndHistoryByPublisher(roomId, roomPlayerList){
        console.log('onCompleteRoomUserStateByRoomId roomId : ', roomId, roomPlayerList);
        try{
            this.roomUserHistoryRepository.onCompleteRoomUserAndHistoryByPublisher(roomId, roomPlayerList)
                .then(result => {
                    console.log("onCompleteRoomUserStateByRoomId", result);
                })
        }catch(e){
            console.log(e);
        }
    }
    
}