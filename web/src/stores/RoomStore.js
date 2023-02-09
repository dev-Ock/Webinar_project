import {makeAutoObservable, toJS} from "mobx";
import {createContext, useState} from 'react';
import * as Repository from "../repositories/Repository";
import {RoomViewStreamUrl} from "../repositories/Repository";
import picture from '../assets/images/moon.jpg'

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

let pc = '';
let myVideo = '';
let stream = '';
let videoOn = true; // 처음에는 카메리가 켜져 있음 (cameraOn : true)
let muteOn = false; // 처음에는 소리가 켜져 있음 (muteOn : false)
let camerasSelect = '';
let option = '';

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
            if (sessionStorage.getItem(Repository.RoomMakeRoomID) && sessionStorage.getItem(Repository.RoomMakePublisherId) && sessionStorage.getItem(Repository.RoomMakeStreamUrl)) {
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
            sessionStorage.removeItem(Repository.RoomMakeRoomID)
            sessionStorage.removeItem(Repository.RoomMakePublisherId)
            sessionStorage.removeItem(Repository.RoomMakeStreamUrl)
            
        } catch (e) {
            console.log(e)
        }
    }
    
    // SRS server-publisher 연결
    async serverPublisherConnection(url) {
        const streamUrl = url
        // const streamUrl = "3abd9f34";
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
            
            // let stream = await navigator.mediaDevices.getUserMedia(constraints);
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            myVideo = document.getElementById("myVideoTag");
            // myVideo.srcObject= picture;
            myVideo.srcObject = stream;
    
            // 비디오 장치들이 cameras 옵션에 달리도록 세팅
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((device) => device.kind === "videoinput");
            console.log("devices", cameras);
            camerasSelect = document.getElementById("cameras");
            const currentCamera = stream.getVideoTracks()[0]; // 현재 선택되어 있는 카메라
            cameras.forEach((camera) => {
                option = document.createElement("option");
                option.value = camera.deviceId;
                option.innerText = camera.label;
                option.style.textAlign = 'center';
                if (currentCamera.label === camera.label) {
                    option.selected = true; // 현재 선택되어 있는 카메라가 보기의 main으로 보여지도록
                }
                camerasSelect.appendChild(option);
            });
            
            // addTrack
            stream.getTracks().forEach((track) => {
                pc.addTrack(track);
                // ontrack && ontrack({ track: track });
            });
            
            // createOffer & setLocalDescription
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
            console.log('data.streamurl',data.streamurl)
            
            const onPublish = (data) => {
                console.log("roomRepository onPublish 진입");
                return this.setSRSserverPublisherConnection(data);
            };
            
            onPublish(data).then(async (session) => {
                console.log("session", session);
                console.log("Publisher session.sdp", session.sdp);
                await pc.setRemoteDescription(
                    new RTCSessionDescription({ type: "answer", sdp: session.sdp })
                );
            });
        };
        
        // const ontrack = (event) => {
        // ontrack = (event) => {
        //     stream.addTrack(event.track);
        // };
        
        // const pc = new RTCPeerConnection();
        pc = new RTCPeerConnection();
        
        stream = new MediaStream();
        await publish(streamUrl);
        let btnOptionBoxBtn = document.getElementById("BtnOptionBox")
        btnOptionBoxBtn.hidden = false;
    }
    
    // SRS server-publisher axios
    * setSRSserverPublisherConnection(data){
        const result = yield this.roomRepository.onSRSserverPublisherConnection(data);
        return result;
    }
    
    // Video turn on/off
    setVideoOnOff(){
        console.log('RoomStore setVideoOnOff 진입')
        let videoBtn = document.getElementById("videoBtnTag");
        stream.getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        if(videoOn){
            videoOn = false;
            videoBtn.innerText = '카메라 켜기';
            
        }else{
            videoOn = true;
            videoBtn.innerText = '카메라 끄기'
        }
    }
    
    // Audio turn on/off
    setAudioOnOff(){
        console.log('RoomStore setAudioOnOff 진입')
        let muteBtn = document.getElementById("muteBtnTag");
        stream.getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        if(!muteOn){
            muteOn = true;
            muteBtn.innerText = '음소거 해제';
            
        }else{
            muteOn = false;
            muteBtn.innerText = '음소거'
        }
    }
    
    // Change Video option
    async setChangeVideoOption(){
        console.log('RoomStore setChangeVideoOption 진입')
        console.log(camerasSelect.value)
        let deviceId = camerasSelect.value
        const initialConstrains = {
            audio: true,
            video: {
                width: { ideal: 320, max: 576 },
            },
            // video: { facingMode: "user" },
        };
    
        const cameraConstraints = {
            audio: true,
            video: { deviceId: { exact: deviceId } },
        };
    
        stream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstrains
        );
        
        myVideo = document.getElementById("myVideoTag");
        myVideo.srcObject = stream;
    
        if (pc) {
            const videoTrack = stream.getVideoTracks()[0];
            const videoSender = pc
                .getSenders()
                .find((sender) => sender.track.kind === "video");
            await videoSender.replaceTrack(videoTrack);
        }
    }
    
    
    // SRS server-player 연결
    async serverPlayerConnection(url){
        const streamUrl = url
        // const streamUrl = "3abd9f34";
    
        const play = async (streamUrl) => {
            pc.addTransceiver("audio", { direction: "recvonly" });
            pc.addTransceiver("video", { direction: "recvonly" });
        
            let offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
    
            // SRS server에 POST
            let data = {
                api: "http://haict.onthe.live:1985/rtc/v1/play/",
                // streamurl: "webrtc://haict.onthe.live/live/3abd9f34",
                streamurl: `webrtc://haict.onthe.live/live/${streamUrl}`,
                sdp: offer.sdp,
            };
            console.log('data.streamurl',data.streamurl)
        
            const onPlay = (data) => {
                console.log("roomRepository onPlay 진입");
                return this.setSRSserverPlayerConnection(data);
            };
            
            onPlay(data).then(async (session) => {
                console.log("session", session);
                console.log("Publisher session.sdp", session.sdp);
                await pc.setRemoteDescription(
                    new RTCSessionDescription({ type: "answer", sdp: session.sdp })
                );
            });
        };
    
        const ontrack = (event) => {
            stream.addTrack(event.track);
            myVideo = document.getElementById("myVideoTag")
            myVideo.srcObject = stream;
        };
    
        const pc = new RTCPeerConnection();
        const stream = new MediaStream();
    
        pc.ontrack = function (event) {
            if (ontrack) {
                ontrack(event);
            }
        };
        await play(streamUrl);
    }
    
    // SRS server-player axios
    * setSRSserverPlayerConnection(data){
        const result = yield this.roomRepository.onSRSserverPlayerConnection(data);
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
    
    // 룸 전체 리스트 조회
    * selectRoomList() {
        console.log("selectroomusername확인")
        try {
            const roomList = yield this.roomRepository.getRoomUserNameList()
            this.roomList = roomList
            // console.log('RoomStore selectRoomList roomList', roomList)
            this.roomListLength = toJS(roomList).length
            console.log('param확인', toJS(roomList).length)
            return this.roomList
        } catch (e) {
            console.log('세미나 목록 조회 error', e)
        }
        
    };
    
    // room list에서 방을 선택했을 때 streamUrl이 sessionStorage에 저장
    beforePlayerRoom(streamUrl){
        sessionStorage.setItem(Repository.RoomViewStreamUrl, streamUrl)
        
    }
 
    async getSelectedRoomData(roomId){
        const room = this.roomRepository.onSelectedRoomData(roomId);
        return room;
    }

    
    
}