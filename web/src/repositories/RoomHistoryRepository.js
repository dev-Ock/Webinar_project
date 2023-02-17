import {Repository} from "./Repository";

export default class RoomHistoryRepository extends Repository {
    constructor(props) {
        super();

        this.requestPrefix = props.serverContextPath + "/api/v1/roomhistories";
    };

    // 삭제 하기 // 세미나 기록을 Create 하는 경우 :  Wait 상태 / Progress 상태 / Complete 상태 / Fail 상태
    // setRoomHistory = (param) => {
    //     return new Promise((resolve, reject) => {
    //         this.getRequestPromise('post', this.requestPrefix + '/insert', param)
    //             .then(data => {
    //                 console.log('RoomHistoryRepository setRoomHistory result', data);
    //                 resolve(data);
    //             })
    //             .catch(error => {
    //                 console.log('RoomHistoryRepository setRoomHistory error', error);
    //                 reject(error);
    //
    //             })
    //     })
    // };
    
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

    // Get Played roomHistory
    

}