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



}