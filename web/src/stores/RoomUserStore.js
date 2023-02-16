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

export const EmptyRoomUserDetail ={
    id: '',
    roomI: '',
    publisherId: '',
    playerId: '',
    state: '',
    streamUrl: '',
}

export default class RoomUserStore {
    streamUser = Object.assign([],EmptyRoomUserDetail)

    constructor(props) {
        this.roomUserRepository = props.roomUserRepository;
        makeAutoObservable(this);
    }

    // create RoomUser
    * onCreateRoomUser(param){
        console.log("RoomUserStore onCreateRoomUser param : ",param)
        // console.log('this',this)
        const result = yield this.roomUserRepository.onCreateRoomUser(param);
        return result;
    }

    // 세미나 참석 중인 player list 조회
    * getRoomUserList(roomId) {
        const roomUser = yield this.roomUserRepository.onSelectRoomUserList(roomId)
        console.log('roomUser', roomUser)
        return roomUser;

        //참여요청한 player streamurl update
    }
    //handsupuser streamurl 추가
    * handsUpUser(data) {
        console.log('여기오나')
        const streamUser = yield this.roomUserRepository.onHandsUpRoomUser(data)
        console.log('roomUser', streamUser)
        this.streamUser = streamUser;
        return streamUser;
    }


}