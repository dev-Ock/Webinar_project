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
                    
                    this.setRoomdataToStorage(this.RoomMakeID,data.id)
                    this.setRoomdataToStorage(this.RoomMakePublisherId,data.publisherId)
                    this.setRoomdataToStorage(this.RoomMakeStreamUrl,data.streamUrl)
                    
                    // this.setRoomStreamURlToStorage(data.streamUrl);
                    // this.roomMakeState = RoomMakeState.Success; // 효과없음
                
                    // console.log("RoomMakeState Success로 변경 : ", this.roomMakeState)

                    resolve(data);
                })
                .catch(error => {
                    console.log('RoomRepository makeRoom error',error)
                    this.removeRoomdataFromStorage(this.RoomMakeID)
                    this.removeRoomdataFromStorage(this.RoomMakePublisherId)
                    this.removeRoomdataFromStorage(this.RoomMakeStreamUrl)
                    
                    // this.removeRoomStreamURlToStorage();
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