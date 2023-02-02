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
                    console.log('roomdata',data)
                    // const token = data.token;
                    // this.setAuthTokenToStorage(token);

                    resolve(data.room);
                })
                .catch(error => {
                    console.log('roomerror',error)
                    // this.removeAuthTokenFromStorage();

                    reject(error);
                });
        });
    }

    // streamUrl 가져오기
    // getStreamUrl = () => {
    //     return new Promise((resolve, reject) => {
    //         this.getRequestPromise('get', this.requestPrefix + '/')
    //     })
    // }

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