import {Repository} from "./Repository";

export default class RoomHistoryRepository extends Repository {
    constructor(props) {
        super();

        this.requestPrefix = props.serverContextPath + "/api/v1/roomhistories";
    };

    // 세미나 기록을 Create 하는 경우 :  Wait 상태 / Progress 상태 / Complete 상태 / Fail 상태
    setRoomHistory = (param) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/insert', param)
                .then(data => {
                    console.log('RoomHistoryRepository setRoomHistory result', data);
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomHistoryRepository setRoomHistory error', error);
                    reject(error);

                })
        })
    };
    
    // 세미나 기록 : 유저가 만든 방 기록 Read
    getRoomHistory = (paramId) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/select' + paramId)
                .then(data => {
                    if(data > 0){
                        console.log("RoomHistoryRepository getRoomHistory data", data);
                    }else{
                        console.log("There's no data");
                    }
                })
                .catch( error => {
                    reject(error);
                })
        });
    }

    // 세미나 기록 Delete

}