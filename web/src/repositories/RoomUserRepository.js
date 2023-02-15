import {Repository, RoomMakeRoomID, RoomMakePublisherId, RoomMakeStreamUrl} from "./Repository";
import axios from "axios";

export default class RoomUserRepository extends Repository {
    constructor(props) {
        super();

        this.requestPrefix = props.serverContextPath + "/api/v1/roomusers";
    }
    
    // roomUser create
    onCreateRoomUser = (param) => {
        return new Promise((resolve, reject)=>{
            this.getRequestPromise('post', this.requestPrefix + '/insert' , param)
                .then(data => {
                    console.log('RoomUserRepository createRoomUser result : ',data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomUserRepository createRoomUser error : ',error)
                    reject(error);
                });
        })
    }
    
    // 선택한 room의 player list 조회
    onSelectRoomUserList = (roomId) => {
        return new Promise((resolve, reject)=>{
            this.getRequestPromise('get', this.requestPrefix + '/read' + `/${roomId}`)
                .then(data => {
                    console.log('RoomRepository onSelectedRoomUserData result : ',data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository onSelectedRoomUserData error : ',error)
                    reject(error);
                });
            
        })
    }
    
}