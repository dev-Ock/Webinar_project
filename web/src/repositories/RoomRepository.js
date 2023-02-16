import {Repository, RoomMakeRoomID, RoomMakePublisherId, RoomMakeStreamUrl} from "./Repository";
import axios from "axios";

export default class RoomRepository extends Repository {
    constructor(props) {
        super();
        this.requestPrefix = props.serverContextPath + "/api/v1/rooms";
    };
    
    // 세미나 만들기 Create room
    makeRoom = (param) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/insert', param)
                .then(data => {
                    console.log('RoomRepository makeRoom result', data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository makeRoom error', error)
                    this.removeRoomdataFromStorage(RoomMakeRoomID)
                    this.removeRoomdataFromStorage(RoomMakePublisherId)
                    this.removeRoomdataFromStorage(RoomMakeStreamUrl)
                    reject(error);
                });
        });
    }
//이름없는 데이터리스트 반환
    // getRoomList = () => {
    //     return new Promise((resolve, reject) => {
    //         this.getRequestPromise('get', this.requestPrefix + '/read/list')
    //             .then(data => {
    //                 resolve(data);
    //                 // console.log('RoomRepository getRoomList result : ', data)
    //             })
    //             .catch(error => {
    //                 console.log('RoomRepository getRoomList error : ', error)
    //                 reject(error);
    //             });
    //     });
    // }
    //이름있는 리스트 반환
    getRoomUserNameList = () => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/read/withnamelist')
                .then(data => {
                    resolve(data);
                    console.log('RoomRepository getRoomUserNameList result : ', data)
                })
                .catch(error => {
                    console.log('RoomRepository getRoomUserNameList error : ', error)
                    reject(error);
                });
        });
    }
    
    // room 비번방 paswsword check
    onCheckRoomPw = (roomId, password) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/check/room-pw' + `/${roomId}`, password
                )
                .then(data => {
                    resolve(data);
                    console.log('RoomRepository onCheckRoomPw result : ', data)
                })
                .catch(error => {
                    console.log('RoomRepository onCheckRoomPw error : ', error)
                    reject(error);
                });
        })
    }
    
    // publisher SRS connection
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
    
    // player SRS connection
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
    
    
    // room 조회
    onSelectRoom = (roomId) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/read' + `/${roomId}`)
                .then(data => {
                    console.log('RoomRepository onSelectedRooomData result : ', data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository onSelectedRooomData error : ', error)
                    reject(error);
                });
            
        })
    }
    
    // room state update
    onUpdateRoom = (param) => {
        console.log('param', param)
        return new Promise((resolve, reject) => {
            this.getRequestPromise('put', this.requestPrefix + '/update', param)
                .then(data => {
                    console.log('RoomRepository onUpdateRoom result : ', data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository onUpdateRoom error : ', error)
                    reject(error);
                });
        })
    }

// 세미나 기록 : 유저가 만든 방 기록 Read : 2/15 삭제예정
    getPublishedRoom = (paramId) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/read/' + paramId)
                .then(data => {
                    if(data){
                        // console.log("RoomRepository getPublishedRoom data", data);
                    }else{
                        console.log("There's no data");
                    }
                    resolve(data);
                })
                .catch( error => {
                    reject(error);
                })
        });
    }
    
    
}