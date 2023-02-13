import {Repository, RoomMakeRoomID, RoomMakePublisherId, RoomMakeStreamUrl} from "./Repository";
import axios from "axios";

export default class RoomRepository extends Repository {
    constructor(props) {
        super();

        this.requestPrefix = props.serverContextPath + "/api/v1/rooms";
    }

    // 세미나 만들기 Create room
    makeRoom = (param) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/insert', param)
                .then(data => {
                    console.log('RoomRepository makeRoom result',data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository makeRoom error',error)
                    this.removeRoomdataFromStorage(RoomMakeRoomID)
                    this.removeRoomdataFromStorage(RoomMakePublisherId)
                    this.removeRoomdataFromStorage(RoomMakeStreamUrl)
                    reject(error);
                });
        });
    }

    getRoomList = () => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/read/list')
                .then(data => {
                    resolve(data);
                    // console.log('RoomRepository getRoomList result : ', data)
                })
                .catch(error => {
                    console.log('RoomRepository getRoomList error : ', error)
                    reject(error);
                });
        });
    }
    getRoomUserNameList = () => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/read/withnamelist')
                .then(data => {
                    resolve(data);
                    // console.log('RoomRepository getRoomUserNameList result : ', data)
                })
                .catch(error => {
                    console.log('RoomRepository getRoomUserNameList error : ',error)
                    reject(error);
                });
        });
    }
    
    onSRSserverPublisherConnection = (data) => {
            return new Promise((resolve, reject) => {
                this.postSRSserverRequestPromise(
                    "post",
                    "http://haict.onthe.live:1985/rtc/v1/publish/",
                    data
                )
                    .then((data) => {
                        // console.log("roomRepository onSRSserverPublisherConnection result : ", data);
                        resolve(data);
                    })
                    .catch((error) => {
                        console.log("roomRepository onSRSserverPublisherConnection error", error);
                        reject(error);
                    });
            });
            
    }
    
    onSRSserverPlayerConnection = (data) => {
        return new Promise((resolve, reject) => {
            this.postSRSserverRequestPromise(
                    "post",
                    "http://haict.onthe.live:1985/rtc/v1/play/",
                    data
                )
                .then((data) => {
                    console.log("roomRepository onSRSserverPlayerConnection result : ", data);
                    resolve(data);
                })
                .catch((error) => {
                    console.log("roomRepository onSRSserverPlayerConnection error", error);
                    reject(error);
                });
        });
    }
    
    onSelectRoom = (roomId) => {
        return new Promise((resolve, reject)=>{
            this.getRequestPromise('get', this.requestPrefix + '/read' + `/${roomId}`)
                .then(data => {
                    console.log('RoomRepository onSelectedRooomData result : ',data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository onSelectedRooomData error : ',error)
                    reject(error);
                });
            
        })
    }
    
    
}