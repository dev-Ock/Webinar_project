import {makeAutoObservable, toJS} from "mobx";
import {createContext, useState} from 'react';
import * as Repository from "../repositories/Repository";
import axios from "axios";

export const LocalStorageTokenKey = '_BASKITOP_AUTHENTICATION_TOKEN_';


export const RoomMakeState = { // 세미나 만들기 성공 여부
    Empty  : "Empty",
    Pending: "Pending", // 세미나 생성 버튼을 누르고 응답을 받기 전 까지
    Success: "Success", // 세미나 생성 성공 응답 시
    Failed : "Failed" // 세미나 생성 실패 응답 시
}

export const RoomStateType = { // 만든 세미나의 스트리밍 상태
    Wait    : "Wait",
    Progress: "Progress",
    Complete: "Complete",
    Fail    : "Fail"
}

const EmptyRoom = {
    title      : '',
    publisherId: '',
    description: '',
    password   : '',
    maximum    : '',
    state      : '',
    streamUrl  : '',
    startTime  : '',
    link       : ''
};

const EmptyOnRoom = {
    id             : '',
    title          : '',
    publisherId    : '',
    description    : '',
    password       : '',
    maximum        : '',
    state          : '',
    streamUrl      : '',
    link           : '',
    createdDatetime: '',
    updatedDatetime: ''
}

const EmptyRoomList = [];

export default class RoomStore {
    
    roomList = Object.assign([], EmptyRoomList)
    roomMakeState = RoomMakeState.Empty;
    roomMake = Object.assign({}, EmptyRoom);
    onRoom = Object.assign({}, EmptyOnRoom);
    roomListLength = toJS(this.roomList.length);
    
    constructor(props) {
        this.roomRepository = props.roomRepository;
        makeAutoObservable(this);
    }
    
    changeTitle = (title) => {
        this.roomMake.title = title;
    };

    changeDescription = (description) => {
        this.roomMake.description = description;
    };

    changeMaximum = (maximum) => {
        this.roomMake.maximum = maximum;
    };

    changeStartTime = (startTime) => {
        this.roomMake.startTime = startTime;
    };
    
    changeLink = (link) => {
        this.roomMake.link = link;
    };
    
    changePassword = (password) => {
        this.roomMake.password = password;
    };
    
    setOnRoom = (room) => {
        this.onRoom = room;
        console.log('onRoom', this.onRoom)
        
        return this.onRoom;
    }
    
    
    
    // 세미나 만들기 정보 서버로 보내기
    * doMakeRoom(userId) {
        try {
            this.roomMakeState = RoomMakeState.Pending; // room을 만들고 있는 상태
            
            this.roomMake.publisherId = userId;
            this.roomMake.state = RoomStateType.Wait; // room의 state
            
            const param = this.roomMake
            const room = yield this.roomRepository.makeRoom(param)
            
            this.roomMake = Object.assign({}, EmptyRoom)
            if (sessionStorage.getItem(Repository.RoomMakeID) && sessionStorage.getItem(Repository.RoomMakePublisherId) && sessionStorage.getItem(Repository.RoomMakeStreamUrl)) {
                this.roomMakeState = RoomMakeState.Success;
                return room;
            } else {
                throw new Error('sessionStorage RoomData items error')
            }
        } catch (e) {
            console.log('RoomStore doMakeRoom error', e.message)
            this.roomMakeState = RoomMakeState.Failed;
            this.roomMake = Object.assign({}, EmptyRoom)
            this.removeRoomData();
        }
    }

    // room 만든 후, 바로 안 들어갈 때 sessionStorage의 room data 삭제
    removeRoomData() {
        try {
            sessionStorage.removeItem(Repository.RoomMakeID)
            sessionStorage.removeItem(Repository.RoomMakePublisherId)
            sessionStorage.removeItem(Repository.RoomMakeStreamUrl)
            
        } catch (e) {
            console.log(e)
        }
    }
    
    
    
    // SRS server-publisher 연결
    async serverPublishConnection() {
        // const streamUrl = streamUrl
        const streamUrl = "3abd9f34";
        const constraints = {
            audio: true,
            video: {
                width: { ideal: 320, max: 576 },
            },
            // video: { facingMode: "user" },
        };
        
        const publish = async (streamUrl) => {
            pc.addTransceiver("audio", { direction: "sendonly" });
            pc.addTransceiver("video", { direction: "sendonly" });
            
            if (
                !navigator.mediaDevices &&
                window.location.protocol === "http:" &&
                window.location.hostname !== "localhost"
            ) {
                console.log(
                    "HttpsRequiredError : Please use HTTPS or localhost to publish"
                );
            }
            
            let stream = await navigator.mediaDevices.getUserMedia(constraints);
            // console.log("stream", stream);
            document.getElementById("myVideoTag").srcObject = stream;
            stream.getTracks().forEach((track) => {
                pc.addTrack(track);
                ontrack && ontrack({ track: track });
            });
            
            let offer = await pc.createOffer();
            // console.log("offer", offer);
            await pc.setLocalDescription(offer);
            
            // SRS server에 POST
            let data = {
                api: "http://haict.onthe.live:1985/rtc/v1/publish/",
                // streamurl: "webrtc://haict.onthe.live/live/3abd9f34",
                streamurl: `webrtc://haict.onthe.live/live/${streamUrl}`,
                sdp: offer.sdp,
            };
            
            const onPublish = (data) => {
                return this.connection(data);
            };
            
            onPublish(data).then(async (session) => {
                console.log("session", session);
                console.log("Publisher session.sdp", session.sdp);
                await pc.setRemoteDescription(
                    new RTCSessionDescription({ type: "answer", sdp: session.sdp })
                );
            });
        };
        
        const ontrack = (event) => {
            stream.addTrack(event.track);
        };
        
        const pc = new RTCPeerConnection();
        const stream = new MediaStream();
        await publish(streamUrl);
    }
    
    // SRS server-publisher axios
    * connection(data){
        const result = yield this.roomRepository.serverPublishConnection(data);
        return result;
    }
    
//일반 룸 테이블 데이터 조회
    * selectJustRoomList() {
        console.log("selectroom확인")
        try {
            const roomList = yield this.roomRepository.getRoomList()
            this.roomList = roomList
            console.log('param확인', roomList)
            
        } catch (e) {
            console.log('세미나 목록 조회 error', e)
        }
        
    };
    
    * selectRoomList() {
        console.log("selectroomusername확인")
        try {
            const roomList = yield this.roomRepository.getRoomUserNameList()
            this.roomList = roomList
            this.roomListLength = toJS(roomList).length
            console.log('param확인', toJS(roomList).length)
            
        } catch (e) {
            console.log('세미나 목록 조회 error', e)
        }
        
    };
    
    
}