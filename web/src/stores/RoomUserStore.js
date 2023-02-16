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


export default class RoomUserStore {
    
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
    
}