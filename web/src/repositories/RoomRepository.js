import {Repository, RoomMakeID, RoomMakePublisherId, RoomMakeStreamUrl} from "./Repository";
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
    
    serverPublishConnection = (data) => {
        // roomRepository로 이동
    
        const getRequestPromise2 = (method, url, data, contentType) => {
            const headers = {"Content-Type": "application/json"}
        
            return new Promise((resolve, reject) => {
                const config = {
                    method: method,
                    url: url,
                    headers: headers,
                    data: data,
                };
            
                console.log("url : ", config.url);
            
                axios
                    .request(config)
                    .then((result) => {
                        console.log("axios response", result);
                        resolve(result.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        };
        
        
            console.log("roomRepository onPublish 접근");
            return new Promise((resolve, reject) => {
                // getRequestPromise("post", conf.apiUrl, data)
                this.getRequestPromise(
                    "post",
                    "http://haict.onthe.live:1985/rtc/v1/publish/",
                    data
                )
                    .then((result) => {
                        console.log("roomRepository onPublish 결과 : ", result);
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log("error", error);
                        reject(error);
                    });
            });
            
    }
}