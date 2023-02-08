import {Repository, RoomMakeID, RoomMakePublisherId, RoomMakeStreamUrl} from "./Repository";


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
                    console.log('DB에 넣고 다시 받은 room data : ',data)
                    this.setRoomdataToStorage(RoomMakeID,data.id)
                    this.setRoomdataToStorage(RoomMakePublisherId,data.publisherId)
                    this.setRoomdataToStorage(RoomMakeStreamUrl,data.streamUrl)
                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository makeRoom error',error)
                    this.removeRoomdataFromStorage(RoomMakeID)
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
                    console.log("여기오륜가")
                })
                .catch(error => {
                    console.log('roomlistㄱㅎ',error)
                    // this.removeAuthTokenFromStorage()

                    reject(error);
                });
        });
    }
    getRoomUserNameList = () => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('get', this.requestPrefix + '/read/withnamelist')
                .then(data => {
                    resolve(data);
                    console.log("룸과유저네임")
                })
                .catch(error => {
                    console.log('roomusernamelistㄱㅎ',error)
                    // this.removeAuthTokenFromStorage()

                    reject(error);
                });
        });
    }
}