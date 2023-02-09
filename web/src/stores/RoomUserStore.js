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
    

    

}