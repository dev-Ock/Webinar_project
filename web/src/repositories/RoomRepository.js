import {Repository} from "./Repository";


export default class RoomRepository extends Repository {
    constructor(props) {
        super();

        this.requestPrefix = props.serverContextPath + "/api/v1/rooms";
    }

    // 방 만들기 Create room
    makeRoom = (param) => {
        return new Promise((resolve, reject) => {
            this.getRequestPromise('post', this.requestPrefix + '/insert', param)
                .then(data => {
                    const streamUrl = data.streamUrl;
                    this.setRoomStreamURlToStorage(streamUrl);
                    // this.roomMakeState = RoomMakeState.Success; // 효과없음

                    console.log('DB에 넣은 room data : ',data)
                    console.log("RoomMakeState Success로 변경 : ", this.roomMakeState)

                    resolve(data);
                })
                .catch(error => {
                    console.log('roomerror',error)
                    this.removeRoomStreamURlToStorage();
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