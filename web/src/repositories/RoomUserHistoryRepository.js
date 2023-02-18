import {Repository} from "./Repository";

export default class RoomUserHistoryRepository extends Repository {
    constructor(props) {
        super();

        this.requestPrefix = props.serverContextPath + "/api/v1/roomuserhistories";
    };

    
    // Get Publised room History
    getRoomHistory = (paramId) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/read/' + paramId)
                .then(data => {
                    if(data){
                        console.log("RoomHistoryRepository getRoomHistory data", data);
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
    
    // (publisherRoom에서 제어하는 경우) create RoomUserHistory & update RoomUser [State Progress]
    onProgressRoomUserAndHistoryByPublisher = (roomId, roomUserList) => {
        console.log('roomId', roomId)
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/insert-by-roomId/progress' + `/${roomId}`, roomUserList)
                .then(data => {
                    console.log('RoomUserRepository createRoomUserByRoomId result : ', data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomUserRepository createRoomUserByRoomId error : ', error)
                    reject(error);
                });
        })
    }
    
    // (publisherRoom에서 제어하는 경우) create RoomUserHistory & update RoomUser [State Complete]
    onCompleteRoomUserAndHistoryByPublisher = (roomId, roomUserList) => {
        console.log('roomId', roomId)
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/insert-by-roomId/complete' + `/${roomId}`, roomUserList)
                .then(data => {
                    console.log('RoomUserRepository createRoomUserByRoomId result : ', data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomUserRepository createRoomUserByRoomId error : ', error)
                    reject(error);
                });
        })
    };
    //player가 나가기 버튼을 눌렀을 때 room user history insert(현재는 나가기 할때 그냥 insert 되는 걸로
    onCreateHistory = (data) =>{
        return new Promise((resolve, reject)=>{
            this.getRequestPromise('post', this.requestPrefix + '/insert' , data)
                .then(data => {
                    console.log('RoomUserRepository createRoomUserHistory result : ',data)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomUserRepository createRoomUserHistory error : ',error)
                    reject(error);
                });
        })
    };
    
}