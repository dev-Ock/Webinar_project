import {makeAutoObservable, toJS} from "mobx";
import {createContext, useState} from 'react';
import * as Repository from "../repositories/Repository";
import {
    RoomMakePublisherId,
    RoomMakeRoomID,
    RoomMakeStreamUrl, RoomViewRoomID,
    RoomViewStreamUrl,
    UserId
} from "../repositories/Repository";

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
    Pending : "Pending",
    Failed  : "Failed"
}

export const RoomUserStateType = { // player의 스트리밍 상태
    Wait      : "Wait",
    Progress  : "Progress",
    Complete  : "Complete",
    Uncomplete: "Uncomplete",
    Pending   : "Pending",
    Failed    : "Failed"
}

// 기본 camera 설정값
const initialConstrains = {
    audio: true,
    video: {
        width: {ideal: 320, max: 576},
    },
};

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
    updatedDatetime: '',
    name           : ''
}

const EmptyRoomList = [];
let EmptyStream = {};
let EmptyPlayerPublishingStream = {};
let EmptyPlayerPlayingStream = {};

const EmptyPannelList = [];

let EmptyPC = {};
let EmptyPlayerPublishingPc = {};
let EmptyPlayerPlayingPc = {};

let pc = '';
let playerPublishingPc = '';
let playerPlayingPc = '';
let myVideo = '';
let playerVideo = '';
let playingVideo = '';

let camerasSelect = '';
let playerCamerasSelect = '';
let option = '';
let playerOption = '';

let pannelBoxTag = '';
let pannelVideo = '';


let constraints = "";
let playerConstraints = "";
let preferredDisplaySurface = "";
let preferredPlayerDisplaySurface = '';
let endSharingTag = "";
let endPlayerSharingTag = "";

let stream = {};
let playerPublishingStream = {};
let playerPlayingStream = {};

let deviceId = "";
let playerDeviceId = "";

export default class RoomStore {
    
    publishedRoomList = Object.assign([], EmptyRoomList);
    roomList = Object.assign([], EmptyRoomList);

    roomListWithParticipants = Object.assign([], EmptyRoomList);
    roomMakeState = RoomMakeState.Empty;
    roomMake = Object.assign({}, EmptyRoom);
    onRoom = Object.assign({}, EmptyOnRoom);
    onStream = Object.assign({}, EmptyStream);
    
    onPannelList = Object.assign([], EmptyPannelList);
    
    onPlayerPublishingStream = Object.assign({}, EmptyPlayerPublishingStream);
    onPlayerPlayingStream = Object.assign({}, EmptyPlayerPlayingStream);
    
    onPc = Object.assign({}, EmptyPC);
    onPlayerPublishingPc = Object.assign({}, EmptyPlayerPublishingPc);
    onPlayerPlayingPc = Object.assign({}, EmptyPlayerPlayingPc);
    
    
    constructor(props) {
        this.roomRepository = props.roomRepository;
        // this.roomUserRepository = props.roomUserRepository;
        this.roomHistoryRepository = props.roomHistoryRepository;

        this.roomUserStore = props.roomUserStore;
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
    
    // room 정보 세팅
    setOnRoom = (room) => {
        this.onRoom = room;
        return this.onRoom;
    }
    
    // (publisherRoom) publishing stream 변경
    changeStream = (stream) => {
        this.onStream = stream;
    };
    
    // (publisherRoom) publishing stream 변경
    changePlayerPublishingStream = (playerPublishingStream) => {
        this.onPlayerPublishingStream = playerPublishingStream;
    };
    
    // (publisherRoom) playing stream 변경
    changePlayerPlayingStream = (playerPlayingStream) => {
        this.onPlayerPlayingStream = playerPlayingStream;
    }
    
    
    // pannel list 추가
    setPannelList = (user) => {
        this.onPannelList.push(user);
    }
    
    // (publisherRoom) peer connection 변경
    setPc = (pc) => {
        this.onPc = pc;
    }
    
    // (plyaerRoom) publishing peer connection 변경
    setPlayerPublishingPc = (pc) => {
        this.onPlayerPublishingPc = pc;
    }
    
    //
    setPlayerPlayingPc = (pc) => {
        this.onPlayerPlayingPc = pc;
    }
    
    
    // 세미나 만들기 정보 서버로 보내기
    * doMakeRoom(userId) {
        try {
            this.roomMakeState = RoomMakeState.Pending; // room을 만들고 있는 상태
            
            this.roomMake.publisherId = userId;
            this.roomMake.state = RoomStateType.Wait; // room의 state
            
            const param = this.roomMake;
            const room = yield this.roomRepository.makeRoom(param);
            
            this.roomMake = Object.assign({}, EmptyRoom);
            this.roomMakeState = RoomMakeState.Success;
            return room;
        } catch (e) {
            console.log('RoomStore doMakeRoom error', e.message);
            this.roomMakeState = RoomMakeState.Failed;
            this.roomMake = Object.assign({}, EmptyRoom);
            this.removeRoomData();
        }
    }
    
    
    // 삭제하기 // 세미나 만든 후 roomHistory 정보 서버로 보냄
    // * doSetRoomHistory(roomHistoryInfo) {
    //     try {
    //         // console.log("RoomStore *doSetRoomHistory", roomHistoryInfo)
    //         yield this.roomHistoryRepository.setRoomHistory(roomHistoryInfo)
    //     } catch(e) {
    //         console.log('RoomStore *doSetRoomHistory error', e.message());
    //     }
    // }
    
    // roomHistory : 유저가 만들었던 세미나(Publised room History) 조회
    * getPublishedRoom(userId) {
        try {
            const publishedRoomData = yield this.roomHistoryRepository.getRoomHistory(userId);
            
            this.publishedRoomList = publishedRoomData;
            console.log("RoomStore getPublishedRoom publishedRoomData", publishedRoomData);
            console.log("RoomStore getPublishedRoom this.publishedRoomList", this.publishedRoomList);
            // return toJS(publishedRoomData);
            return this.publishedRoomList;
        } catch (e) {
            console.log('RoomStore getPublishedRoom error', e.message)
        }
    }
    
    // publisher-room 입장시, sessionStorage의 room data 세팅
    setRoomData(room) {
        try {
            console.log('room', room);
            sessionStorage.setItem(RoomMakeRoomID, room.id);
            sessionStorage.setItem(RoomMakePublisherId, room.publisherId);
            sessionStorage.setItem(RoomMakeStreamUrl, room.streamUrl);
        } catch (e) {
            console.log(e);
        }
    }
    
    
    // room 만든 후, 바로 안 들어갈 때 sessionStorage의 room data 삭제
    removeRoomData() {
        try {
            sessionStorage.removeItem(Repository.RoomMakeRoomID);
            sessionStorage.removeItem(Repository.RoomMakePublisherId);
            sessionStorage.removeItem(Repository.RoomMakeStreamUrl);
        } catch (e) {
            console.log(e);
        }
    }
    
    /////////////////////////// publisherRoom publishing //////////////////////////////
    
    // (publisherRoom) 방 기본 세팅
    async setRoom() {
        try{
            constraints = {
                audio: true,
                // video: {
                //     width: {ideal: 320, max: 576},
                // },
                // video: { width: { exact: 960 }, height: { exact: 540 } }
                // video: { width: { exact: 1280 }, height: { exact: 720 } }
                video: { width: { exact: 1920 }, height: { exact: 1080 } }
            };
    
            let stream = new MediaStream();
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            // console.log('11', navigator.mediaDevices.getSupportedConstraints())
            myVideo = document.getElementById("myVideoTag");
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
    
            stream.getAudioTracks()
                .forEach((track) => (track.enabled = false));
            console.log('퍼블리셔방송세팅 stream', stream);
            this.changeStream(stream);
            // return stream;
        }catch(e){
            console.log(e);
        }
        
    }
    
    // (publisherRoom) SRS server-publisher 연결
    async serverPublisherConnection(url) {
        try{
            const streamUrl = url;
            const publish = async (streamUrl) => {
                pc.addTransceiver("audio", {direction: "sendonly"});
                pc.addTransceiver("video", {direction: "sendonly"});
        
                if (
                    !navigator.mediaDevices &&
                    window.location.protocol === "http:" &&
                    window.location.hostname !== "localhost"
                ) {
                    console.log(
                        "HttpsRequiredError : Please use HTTPS or localhost to publish"
                    );
                }
                console.log('stream : ', this.onStream);
        
                let stream = this.onStream;
        
                // addTrack
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track); // stream의 각 track을 peer connection에 track으로 추가한다.
                    // ontrack && ontrack({ track: track });
                });
        
        
                // createOffer & setLocalDescription
                let offer = await pc.createOffer(); // addTransceiver와 addTrack을 거친 peer connection에서 offer를 만든다.
                console.log("offer", offer);
                await pc.setLocalDescription(offer);
        
                // SRS server에 POST
                let data = {
                    api      : "http://haict.onthe.live:1985/rtc/v1/publish/",
                    streamurl: `webrtc://haict.onthe.live/live/${streamUrl}`,
                    sdp      : offer.sdp,
                };
                console.log('data.streamurl', data.streamurl);
        
                const onPublish = (data) => {
                    console.log("roomRepository onPublish 진입");
                    return this.setSRSserverPublisherConnection(data);
                };
        
                onPublish(data).then(async (session) => {
                    console.log("session", session);
                    console.log("Publisher session.sdp", session.sdp);
                    await pc.setRemoteDescription(
                        new RTCSessionDescription({type: "answer", sdp: session.sdp})
                    );
                });
                this.setPc(pc);
            };
    
            pc = new RTCPeerConnection();
            await publish(streamUrl);
            console.log("onPc", this.onPc);
        }catch(e){
            console.log(e);
        }
       
    }
    
    // (publisherRoom, playerRoom 공용) SRS server-publisher axios
    * setSRSserverPublisherConnection(data) {
        try{
            const result = yield this.roomRepository.onSRSserverPublisherConnection(data);
            return result;
        }catch(e){
            console.log(e);
        }
    }
    
    
    // (publisherRoom) publishing Video turn on/off
    setVideoOnOff(videoOn) {
        try{
            console.log('RoomStore setVideoOnOff 진입');
            let stream = this.onStream;
            stream.getVideoTracks()
                .forEach((track) => (track.enabled = !track.enabled));
            this.changeStream(stream);
            return !videoOn;
        }catch(e){
            console.log(e);
        }
    }
    
    // (publisherRoom) publishing Audio turn on/off
    setAudioOnOff(audioOff) {
        try{
            console.log('RoomStore setAudioOnOff 진입');
            let stream = this.onStream;
            stream.getAudioTracks()
                .forEach((track) => (track.enabled = !track.enabled));
            this.changeStream(stream);
            return !audioOff;
        }catch(e){
            console.log(e);
        }
    }
    
    // (publisherRoom) publishing Change Camera option
    async setChangeVideoOption() {
        try{
            camerasSelect = document.getElementById("cameras");
            console.log('RoomStore setChangeVideoOption 진입');
            console.log(camerasSelect.value);
            deviceId = camerasSelect.value;
    
            // 특정 device(camera 등) 설정값
            let cameraConstraints = {
                audio: true,
                video: {deviceId: {exact: deviceId}},
                // video: { width: { exact: 1280 }, height: { exact: 720 } }
                
            };
    
            // const initialConstrains = {
            //     audio: true,
            //     video: {
            //         width: {ideal: 320, max: 576},
            //     },
            // };
            //
            // const cameraConstraints = {
            //     audio: true,
            //     video: {deviceId: {exact: deviceId}},
            // };
    
            // constraints = {
            //     audio: true,
            //     video: {deviceId: {exact: deviceId}},
            // };
    
            let stream = this.onStream;
            const stream2 = await navigator.mediaDevices.getUserMedia(
                deviceId ? cameraConstraints : initialConstrains
            );
    
            // const stream = await navigator.mediaDevices.getUserMedia(
            //     deviceId ? constraints : initialConstrains
            // );
    
            // const stream2 = await navigator.mediaDevices.getUserMedia(
            //     deviceId ? constraints : initialConstrains
            // );
    
            stream.removeTrack(stream.getVideoTracks()[0]);
            stream.addTrack(stream2.getVideoTracks()[0]);
    
            myVideo = document.getElementById("myVideoTag");
            myVideo.srcObject = stream;
    
            this.changeStream(stream);
            await this.onChangeBroadcastingStream();
        }catch(e){
            console.log(e);
        }
    }
    
    // (publisherRoom) 송출할 display 선택
    onSelectDisplayOption = async () => {
        try{
            // console.log("22: ",stream.getTracks())
            let stream = this.onStream;
            const myAudioStream = stream.getAudioTracks()[0]; // 화면공유에서는 audio가 없으므로 기존의 audio를 사용하기 위해.
            console.log('myVideoAudioStream : ', myAudioStream)
            preferredDisplaySurface = document.getElementById('displaySurface');
            const displaySurface = await preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;
            const options = {audio: true, video: true};
            if (displaySurface === 'browser') {
                endSharingTag = document.getElementById("endSharing");
                camerasSelect = document.getElementById("cameras");
                endSharingTag.hidden = false;
                camerasSelect.hidden = true;
                options.video = {displaySurface};
                console.log('options', options)
                preferredDisplaySurface.value = displaySurface;
                preferredDisplaySurface.disabled = true;
        
                await navigator.mediaDevices.getDisplayMedia(options)
                    .then(async (streamData) => {
                
                        stream = streamData; // 화면공유는 video track만 추가되는 것을 확인함 (즉, streamData에는 video track만 있음)
                        stream.addTrack(myAudioStream); // 내가 선택한 audio를 track에 추가함
                        console.log('stream : ', stream.getTracks()) // 화면공유 video와 내가 선택한 audio가 각각 하나씩 track으로 들어있음을 확인.
                        myVideo = document.getElementById("myVideoTag");
                        myVideo.srcObject = stream;
                        this.changeStream(stream);
                        // 송출 stream도 변경
                        await this.onChangeBroadcastingStream();
                
                        // 화면공유 끝내면
                        stream.getVideoTracks()[0].onended = async () => {
                            this.changeStream(stream);
                            await this.onEndDisplaySharing();
                        };
                    })
                    .catch(e => {
                        console.log(e)
                    })
        
                // } else if (displaySurface === 'camera'){
                //     // stream = await navigator.mediaDevices.getUserMedia(constraints);
                //     await this.setRoom();
        
            } else {
                console.log("RoomStore onSelectDisplayOption display option error")
            }
        }catch(e){
            console.log(e);
        }
       
    }
    
    
    // (publisherRoom) SRS server로 송출할 stream 변경
    async onChangeBroadcastingStream() {
        try{
            console.log('onChangeBroadcastingStream pc', pc)
            if (pc) {
                let stream = this.onStream;
                console.log('pc videosender', pc.getSenders())
                const videoTrack = stream.getVideoTracks()[0];
                const videoSender = pc
                    .getSenders()
                    .find((sender) => sender.track.kind === "video");
                await videoSender.replaceTrack(videoTrack);
            }
        }catch(e){
            console.log(e);
        }
        
    }
    
    // (publisherRoom) '공유 종료' 버튼을 눌러서 화면공유를 끝냈을 때, 다시 카메라로 stream 세팅
    async onEndDisplaySharing() {
        try{
            // 화면공유 끝나면 다시 카메라로 세팅
            console.log("end sharing on publisherRoom");
            endSharingTag.hidden = true;
            camerasSelect.hidden = false;
            preferredDisplaySurface.value = 'camera';
            preferredDisplaySurface.disabled = false;
    
            // 특정 device(camera 등) 설정값
            let cameraConstraints = {
                audio: true,
                video: {deviceId: {exact: deviceId}},
            };
    
            const stream2 = await navigator.mediaDevices.getUserMedia(
                deviceId ? cameraConstraints : initialConstrains
            );
            let stream = this.onStream;
            stream.removeTrack(stream.getVideoTracks()[0])
            // console.log("22222s", stream.getTracks())
            stream.addTrack(stream2.getVideoTracks()[0])
            // console.log("stream22222 : ", stream.getTracks())
            myVideo.srcObject = stream;
            this.changeStream(stream);
    
            // 송출 stream도 변경
            await this.onChangeBroadcastingStream();
        }catch(e){
            console.log(e);
        }
        
    }
    
    /////////////////////////// publisherRoom playing ////////////////////
    
    // add pannel
    async onAddPannel(roomUser) {
        try{
            const streamUrl = roomUser.streamUrl;
            const play = async (streamUrl) => {
                pc.addTransceiver("audio", {direction: "recvonly"});
                pc.addTransceiver("video", {direction: "recvonly"});
        
                let offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
        
                // SRS server에 POST
                let data = {
                    api      : "http://haict.onthe.live:1985/rtc/v1/play/",
                    streamurl: `webrtc://haict.onthe.live/live/${streamUrl}`,
                    sdp      : offer.sdp,
                };
                console.log('pannel.streamurl', data.streamurl);
        
                const onPlay = (data) => {
                    console.log("roomRepository onAddPannel onPlay 진입");
                    return this.setSRSserverPlayerConnection(data);
                };
        
                onPlay(data).then(async (session) => {
                    console.log("roomRepository onAddPannel session", session);
                    console.log("roomRepository onAddPannel session.sdp", session.sdp);
                    await pc.setRemoteDescription(
                        new RTCSessionDescription({type: "answer", sdp: session.sdp})
                    );
                });
            };
    
            const ontrack = (event) => {
                pannelStream.addTrack(event.track);
        
                // const friendFace1 = document.getElementById("friendFace1"); // peerFace
                // friendFace1.srcObject = pannelStream;
            };
    
            // console.log("111")
    
            pc = new RTCPeerConnection();
            let pannelStream = new MediaStream();
    
            pc.ontrack = function (event) {
        
                if (ontrack) {
                    ontrack(event);
                }
            };
            await play(streamUrl);
    
            roomUser.stream = pannelStream;
            console.log("pannelStream", pannelStream)
            this.setPannelList(roomUser);
        }catch(e){
            console.log(e);
        }
      
    }
    
    // pannel stream으로 송출 stream을 세팅
    async setPannelStreamSelection(user) {
        try{
            console.log("RoomStore setPannelStreamSelection : ", user);
            myVideo = document.getElementById("myVideoTag");
            myVideo.srcObject = user.stream;
            console.log("RoomStore setPannelStreamSelection... the end")
            // this.changeStream(user.stream);
            // await this.onChangeBroadcastingStream();
            console.log('setPannelStreamSelection pc', pc)
            const pc2 = this.onPc;
            console.log('setPannelStreamSelection pc2', pc2)
            if (pc2) {
                let stream = user.stream;
                const videoTrack = stream.getVideoTracks()[0];
                const audioTrack = stream.getAudioTracks()[0];
                console.log('videoTrack', videoTrack);
                console.log('audioTrack', audioTrack);
                // console.log('pc2.getSenders', pc2.getSenders());
                const videoSender = await pc2
                    .getSenders()
                    .find((sender) => sender.track.kind === "video");
                const audioSender = pc2
                    .getSenders()
                    .find((sender) => sender.track.kind === "audio");
                await videoSender.replaceTrack(videoTrack);
                await audioSender.replaceTrack(audioTrack);
            }
        }catch(e){
            console.log(e);
        }
       
        
    }
    
    // publisher stream으로 송출 stream을 세팅
    async setPublisherStreamSelection() {
        try{
            myVideo = document.getElementById("myVideoTag");
            myVideo.srcObject = this.onStream;
            console.log("RoomStore setPublisherStreamSelection... the end")
            // this.changeStream(user.stream);
            // await this.onChangeBroadcastingStream();
            console.log('setPublisherStreamSelection pc', pc)
            const pc2 = this.onPc;
            console.log('setPublisherStreamSelection pc2', pc2)
            if (pc2) {
                let stream = this.onStream;
                const videoTrack = stream.getVideoTracks()[0];
                const audioTrack = stream.getAudioTracks()[0];
                console.log('videoTrack', videoTrack);
                console.log('audioTrack', audioTrack);
                console.log('pc2.getSenders', pc2.getSenders());
                const videoSender = await pc2
                    .getSenders()
                    .find((sender) => sender.track.kind === "video");
                const audioSender = pc2
                    .getSenders()
                    .find((sender) => sender.track.kind === "audio");
                await videoSender.replaceTrack(videoTrack);
                await audioSender.replaceTrack(audioTrack);
            }
    
        }catch(e){
            console.log(e);
        }
        
    }
    
    /////////////////////////// publisherRoom, playerRoom playing ////////////////////
    
    // (publisherRoom, playerRoom 공용)  SRS server-player axios
    * setSRSserverPlayerConnection(data) {
        try{
            const result = yield this.roomRepository.onSRSserverPlayerConnection(data);
            console.log('data check', result)
            return result;
        }catch(e){
            console.log(e);
        }

    }
    
    /////////////////////////// playerRoom publishing //////////////////////////////
    
    // (playerRoom) 방 기본 세팅
    async playerSetRoom() {
        try{
            const playerConstraints = {
                audio: true,
                video: {
                    width: {ideal: 320, max: 576},
                },
            };
    
            let playerPublishingStream = new MediaStream();
            playerPublishingStream = await navigator.mediaDevices.getUserMedia(playerConstraints);
            // console.log('test', playerPublishingStream.getTracks())
            playerVideo = document.getElementById("playerVideoTag");
            playerVideo.srcObject = playerPublishingStream;
    
            // 비디오 장치들이 cameras 옵션에 달리도록 세팅
            const playerDevices = await navigator.mediaDevices.enumerateDevices();
            const playerCameras = playerDevices.filter((device) => device.kind === "videoinput");
            console.log("devices", playerCameras);
            playerCamerasSelect = document.getElementById("playerCameras");
            const currentCamera = playerPublishingStream.getVideoTracks()[0]; // 현재 선택되어 있는 카메라
            playerCameras.forEach((playerCamera) => {
                playerOption = document.createElement("option");
                playerOption.value = playerCamera.deviceId;
                playerOption.innerText = playerCamera.label;
                playerOption.style.textAlign = 'center';
                if (currentCamera.label === playerCamera.label) {
                    playerOption.selected = true; // 현재 선택되어 있는 카메라가 보기의 main으로 보여지도록
                }
                playerCamerasSelect.appendChild(playerOption);
            });
    
            playerPublishingStream.getAudioTracks()
                .forEach((track) => (track.enabled = false));
            console.log('플레이어 송출용 stream', playerPublishingStream);
            this.changePlayerPublishingStream(playerPublishingStream);
            // return stream;
        }catch(e){
            console.log(e);
        }
      
    }
    
    // (playerRoom) SRS server-publisher 연결
    async serverPlayerPublishingConnection(playerUrl) {
        try{
            const playerPublishingStreamUrl = playerUrl;
            const pPublish = async (playerPublishingStreamUrl) => {
                playerPublishingPc.addTransceiver("audio", {direction: "sendonly"});
                playerPublishingPc.addTransceiver("video", {direction: "sendonly"});
        
                if (
                    !navigator.mediaDevices &&
                    window.location.protocol === "http:" &&
                    window.location.hostname !== "localhost"
                ) {
                    console.log(
                        "HttpsRequiredError : Please use HTTPS or localhost to publish"
                    );
                }
                console.log('stream : ', this.onPlayerPublishingStream);
        
                let playerPublishingStream = this.onPlayerPublishingStream;
        
                // addTrack
                playerPublishingStream.getTracks().forEach((track) => {
                    playerPublishingPc.addTrack(track); // stream의 각 track을 peer connection에 track으로 추가한다.
                    // ontrack && ontrack({ track: track });
                });
        
        
                // createOffer & setLocalDescription
                let playerOffer = await playerPublishingPc.createOffer(); // addTransceiver와 addTrack을 거친 peer connection에서 offer를 만든다.
                // console.log("offer", offer);
                await playerPublishingPc.setLocalDescription(playerOffer);
        
                // SRS server에 POST
                let playerData = {
                    api      : "http://haict.onthe.live:1985/rtc/v1/publish/",
                    streamurl: `webrtc://haict.onthe.live/live/${playerPublishingStreamUrl}`,
                    sdp      : playerOffer.sdp,
                };
                console.log('playerData.streamurl', playerData.streamurl);
        
                const onPublish = (playerData) => {
                    console.log("roomRepository onPublish 진입");
                    return this.setSRSserverPublisherConnection(playerData);
                };
        
                onPublish(playerData).then(async (session) => {
                    console.log("player session", session);
                    console.log("player publishing session.sdp", session.sdp);
                    await playerPublishingPc.setRemoteDescription(
                        new RTCSessionDescription({type: "answer", sdp: session.sdp})
                    );
                });
                this.setPlayerPublishingPc(playerPublishingPc);
            };
    
            playerPublishingPc = new RTCPeerConnection();
            await pPublish(playerPublishingStreamUrl);
        }catch(e){
            console.log(e);
        }
       
    }
    
    // (playerRoom) publishing Video turn on/off
    setPublishingVideoOnOffInPlayerRoom(publishingVideoOn) {
        try{
            console.log('RoomStore setPublishingVideoOnOffInPlayerRoom 진입');
            let playerPublishingStream = this.onPlayerPublishingStream;
            playerPublishingStream.getVideoTracks()
                .forEach((track) => (track.enabled = !track.enabled));
            this.changePlayerPublishingStream(playerPublishingStream);
            return !publishingVideoOn;
        }catch(e){
            console.log(e);
        }
       
    }
    
    // (playerRoom) publishing Audio turn on/off
    setPublishingAudioOnOffInPlayerRoom(publishingAudioOff) {
        try{
            console.log('RoomStore setPublishingAudioOnOffInPlayerRoom 진입');
            let playerPublishingStream = this.onPlayerPublishingStream;
            playerPublishingStream.getAudioTracks()
                .forEach((track) => (track.enabled = !track.enabled));
            this.changePlayerPublishingStream(playerPublishingStream);
            return !publishingAudioOff;
        }catch(e){
            console.log(e);
        }
       
    }
    
    
    // (playerRoom) publishing Change Camera option
    async setPlayerChangeVideoOption() {
        try{
            playerCamerasSelect = document.getElementById("playerCameras");
            console.log('RoomStore playerSetChangeVideoOption 진입');
            console.log(playerCamerasSelect.value);
            playerDeviceId = playerCamerasSelect.value;
    
            // 특정 device(camera 등) 설정값
            let playerCameraConstraints = {
                audio: true,
                video: {deviceId: {exact: playerDeviceId}},
            };
    
            let playerPublishingStream = this.onPlayerPublishingStream;
            const playerPublishingStream2 = await navigator.mediaDevices.getUserMedia(
                playerDeviceId ? playerCameraConstraints : initialConstrains
            );
    
            playerPublishingStream.removeTrack(playerPublishingStream.getVideoTracks()[0]);
            playerPublishingStream.addTrack(playerPublishingStream2.getVideoTracks()[0]);
    
            playerVideo = document.getElementById("playerVideoTag");
            playerVideo.srcObject = playerPublishingStream;
    
            this.changePlayerPublishingStream(playerPublishingStream);
            await this.onChangePlayerBroadcastingStream();
        }catch(e){
            console.log(e);
        }
      
    }
    
    
    // (playerRoom) 송출할 display 선택
    onPlayerSelectDisplayOption = async () => {
        try{
            let playerPublishingStream = this.onPlayerPublishingStream;
            const myAudioplayerPublishingStream = playerPublishingStream.getAudioTracks()[0]; // 화면공유에서는 audio가 없으므로 기존의 audio를 사용하기 위해.
            console.log('myVideoAudioStream : ', myAudioplayerPublishingStream)
            preferredPlayerDisplaySurface = document.getElementById('playerDisplaySurface');
            const playerDisplaySurface = await preferredPlayerDisplaySurface.options[preferredPlayerDisplaySurface.selectedIndex].value;
            const options = {audio: true, video: true};
            if (playerDisplaySurface === 'browser') {
                endPlayerSharingTag = document.getElementById("endPlayerSharing");
                playerCamerasSelect = document.getElementById("playerCameras");
                endPlayerSharingTag.hidden = false;
                playerCamerasSelect.hidden = true;
                options.video = {playerDisplaySurface};
                console.log('options', options)
                preferredPlayerDisplaySurface.value = playerDisplaySurface;
                preferredPlayerDisplaySurface.disabled = true;
        
                await navigator.mediaDevices.getDisplayMedia(options)
                    .then(async (playerPublishingStreamData) => {
                
                        playerPublishingStream = playerPublishingStreamData; // 화면공유는 video track만 추가되는 것을 확인함 (즉, streamData에는 video track만 있음)
                        playerPublishingStream.addTrack(myAudioplayerPublishingStream); // 내가 선택한 audio를 track에 추가함
                        console.log('playerPublishingStream : ', playerPublishingStream.getTracks()) // 화면공유 video와 내가 선택한 audio가 각각 하나씩 track으로 들어있음을 확인.
                        playerVideo = document.getElementById("playerVideoTag");
                        playerVideo.srcObject = playerPublishingStream;
                        this.changePlayerPublishingStream(playerPublishingStream);
                        // 송출 playerPublishingStream도 변경
                        await this.onChangePlayerBroadcastingStream();
                
                        // 화면공유 끝내면
                        playerPublishingStream.getVideoTracks()[0].onended = async () => {
                            this.changePlayerPublishingStream(playerPublishingStream);
                            await this.onEndPlayerDisplaySharing();
                        };
                    })
                    .catch(e => {
                        console.log(e)
                    })
        
            } else {
                console.log("RoomStore playerOnSelectDisplayOption display option error")
            }
        }catch(e){
            console.log(e);
        }
        
    }
    
    // (playerRoom) SRS server로 송출할 stream 변경
    async onChangePlayerBroadcastingStream() {
        try{
            if (playerPublishingPc) {
                let playerPublishingStream = this.onPlayerPublishingStream;
                console.log('playerPublishingPc videosender', playerPublishingPc.getSenders())
                const videoTrack = playerPublishingStream.getVideoTracks()[0];
                const videoSender = playerPublishingPc
                    .getSenders()
                    .find((sender) => sender.track.kind === "video");
                await videoSender.replaceTrack(videoTrack);
            }
        }catch(e){
            console.log(e);
        }
        
    }
    
    
    // (playerRoom) '공유 종료' 버튼을 눌러서 화면공유를 끝냈을 때, 다시 카메라로 stream 세팅
    async onEndPlayerDisplaySharing() {
        try{
            // 화면공유 끝나면 다시 카메라로 세팅
            console.log("end sharing on playerRoom");
            endPlayerSharingTag.hidden = true;
            playerCamerasSelect.hidden = false;
            preferredPlayerDisplaySurface.value = 'camera';
            preferredPlayerDisplaySurface.disabled = false;
    
            // 특정 device(camera 등) 설정값
            let cameraConstraints = {
                audio: true,
                video: {deviceId: {exact: playerDeviceId}},
            };
    
            const stream2 = await navigator.mediaDevices.getUserMedia(
                playerDeviceId ? cameraConstraints : initialConstrains
            );
            let stream = this.onPlayerPublishingStream;
            stream.removeTrack(stream.getVideoTracks()[0])
            // console.log("22222s", stream.getTracks())
            stream.addTrack(stream2.getVideoTracks()[0])
            // console.log("stream22222 : ", stream.getTracks())
            playerVideo.srcObject = stream;
            this.changePlayerPublishingStream(playerVideo);
    
            // 송출 stream도 변경
            await this.onChangePlayerBroadcastingStream();
        }catch(e){
            console.log(e);
        }
     
    }
    
    
    /////////////////////////// playerRoom playing //////////////////////////////
    
    // SRS server-player 연결
    async serverPlayerConnection(url) {
        try{
            const streamUrl = url;
            // const streamUrl = "3abd9f34";
    
            const play = async (streamUrl) => {
                playerPlayingPc.addTransceiver("audio", {direction: "recvonly"});
                playerPlayingPc.addTransceiver("video", {direction: "recvonly"});
        
                let offer = await playerPlayingPc.createOffer();
                await playerPlayingPc.setLocalDescription(offer);
        
                // SRS server에 POST
                let data = {
                    api: "http://haict.onthe.live:1985/rtc/v1/play/",
                    // streamurl: "webrtc://haict.onthe.live/live/3abd9f34",
                    streamurl: `webrtc://haict.onthe.live/live/${streamUrl}`,
                    sdp      : offer.sdp,
                };
                console.log('data.streamurl', data.streamurl);
        
                const onPlay = (data) => {
                    console.log("roomRepository serverPlayerConnection onPlay 진입");
                    return this.setSRSserverPlayerConnection(data);
                };
        
                onPlay(data).then(async (session) => {
                    console.log("roomRepository serverPlayerConnection session", session);
                    console.log("roomRepository serverPlayerConnection session.sdp", session.sdp);
                    await playerPlayingPc.setRemoteDescription(
                        new RTCSessionDescription({type: "answer", sdp: session.sdp})
                    );
                });
            };
    
            const ontrack = (event) => {
                playerPlayingStream.addTrack(event.track);
                // console.log('playertest', playerPlayingStream.getTracks())
                playingVideo = document.getElementById("playingVideoTag"); // peerFace myVideoTag
                playingVideo.srcObject = playerPlayingStream;
            };
    
            playerPlayingPc = new RTCPeerConnection();
            playerPlayingStream = new MediaStream();
    
            playerPlayingPc.ontrack = function (event) {
                if (ontrack) {
                    ontrack(event);
                }
            };
            await play(streamUrl);
            this.setPlayerPlayingPc(playerPlayingPc);
            this.changePlayerPlayingStream(playerPlayingStream);
        }catch(e){
            console.log(e);
        }
       
    }
    
    
    // (playerRoom) playing Video turn on/off
    setPlayingVideoOnOffInPlayerRoom(playingVideoOn) {
        try{
            console.log('RoomStore setPlayingVideoOnOffInPlayerRoom 진입');
            let playerPlayingStream = this.onPlayerPlayingStream;
            playerPlayingStream.getVideoTracks()
                .forEach((track) => (track.enabled = !track.enabled));
            this.changePlayerPlayingStream(playerPlayingStream);
            return !playingVideoOn;
        }catch(e){
            console.log(e);
        }
   
    };
    
    // (playerRoom) playing Audio turn on/off
    setPlayingAudioOnOffInPlayerRoom(playingAudioOff) {
        try{
            console.log('RoomStore setPlayingAudioOnOffInPlayerRoom 진입');
            let playerPlayingStream = this.onPlayerPlayingStream;
            playerPlayingStream.getAudioTracks()
                .forEach((track) => (track.enabled = !track.enabled));
            this.changePlayerPlayingStream(playerPlayingStream);
            return !playingAudioOff;
        }catch(e){
            console.log(e);
        }
      
    };
    
    
    /////////////////////////////////////////////////////////////////
    
    // 룸 전체 리스트 조회
    * selectRoomList() {
        try {
            const roomList = yield this.roomRepository.getRoomUserNameList();
            this.roomList = roomList;
            // console.log('스토어에서 RoomStore selectRoomList roomList', roomList)
            // this.roomListLength = toJS(roomList).length;
            // console.log('param확인', toJS(roomList).length);
            // return roomList;
            return this.roomList;
        } catch (e) {
            console.log('세미나 목록 조회 error', e);
        }
    };
    
    // room password double-check<1>(front)
    passwordCheckFront(room) {
        try{
            const passwordCheck = prompt("password를 정확하게 입력해 주세요")
            if (passwordCheck == null) {
                return null;
            } else {
                const result = (passwordCheck == room.password ? this.passwordCheckDB(room) : this.passwordCheckFront(room));
                return result;
            }
        }catch(e){
            console.log(e);
        }

    }
    
    // room password double-check<2>(Server)
    passwordCheckDB(room) {
        try{
            this.roomRepository.onCheckRoomPw(room.id, room.password)
                .then(data => {
                    const result = (data === 1 ? 1 : this.passwordCheckFront(room));
                    return result;
                })
                .catch(error => {
                    console.log("RoomStore passwordCheckDB error", error)
                })
        }catch(e){
            console.log(e);
        }
    }
    
    // publisher or player check
    async checkPublisherOrPlayer(room, userId, onCreateRoomUser) {
        try{
            console.log('room.id', room.id);
            if (room.publisherId === userId) {
                console.log('publisher');
                await this.setRoomData(room); // sessionStorage에 publisher 정보 세팅
                await window.location.replace('/publisher-room');
            } else {
                console.log('player')
                await this.beforePlayerRoom(room.id, room.streamUrl); // sessionStorage에 player 정보 세팅
        
                const param = {
                    roomId     : room.id,
                    publisherId: room.publisherId,
                    playerId   : userId,
                    state      : RoomUserStateType.Wait
                };
                console.log('param', param);
                const result = await onCreateRoomUser(param);
                console.log('RoomStore onCreateRoomUser result', result);
                if (result === 0) {
                    throw Error('room user DB 저장 실패');
                } else if (result === -1) {
                    alert('참여중이었던 세미나에 재입장합니다.');
                    await window.location.replace('/player-room');
            
                } else if (result === 555) {
                    alert("세미나의 정원이 초과되었습니다.")
                    return window.location.replace("/room-list")
                }else{
                    console.log('room user DB 저장 성공');
                    await window.location.replace('/player-room');
                }
            }
        }catch(e){
            console.log(e);
        }
     
    
    }
    
    // room list에서 room 들어갈 때 player인지 publisher인지 체크하고 이동
    async playerOrPublisherChoice(room, userId, checkLogin, onCreateRoomUser) {
        console.log('room', room);
        try {
            // userId가 없는 경우
            if (userId === undefined) {
                checkLogin();
                const userId = sessionStorage.getItem(UserId);
                if (userId === undefined) {
                    throw new Error("No user");
                }
            }
            // 비번방인 경우
            if (room.password) {
                // password Front & Server double-check
                await this.passwordCheckFront(room) === null ? console.log('true') : await this.checkPublisherOrPlayer(room, userId, onCreateRoomUser);
            } else {
                await this.checkPublisherOrPlayer(room, userId, onCreateRoomUser);
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    
    // room list에서 방을 선택했을 때 streamUrl이 sessionStorage에 저장
    beforePlayerRoom(roomId, streamUrl) {
        try{
            sessionStorage.setItem(Repository.RoomViewRoomID, roomId);
            sessionStorage.setItem(Repository.RoomViewStreamUrl, streamUrl);
        }catch(e){
            console.log(e);
        }

        
    }
    
    // 선택한 room 정보 조회
    async getSelectedRoom(roomId) {
        try{
            const room = this.roomRepository.onSelectRoom(roomId);
            room.then(room => {
                    console.log('getSelectedRoom room', room);
                    this.setOnRoom(room);
                }
            )
        }catch(e){
            console.log(e);
        }

    }
    
    
    ////////////////////////////// room state ///////////////////////////
    
    // room state change DB Update
    * onUpdateRoomState(data) {
        try{
            return yield this.roomRepository.onUpdateRoom(data);
            
        }catch(e){
            console.log(e);
        }
    }
    
    
    // room state : Pending
    onPendingRoomState(data) {
        console.log('onPendingRoom data : ', data);
        try {
            data.state = RoomStateType.Pending;
            this.onUpdateRoomState(data)
                .then(result => {
                    console.log("onPendingRoom", result);
                    if (result === 1) {
                        console.log("onPendingRoom 성공")
                    }
                    if (result !== 1) {
                        // this.onFailedRoomState(data);
                        console.log("onPendingRoom 실패")
                    }
                })
        } catch (e) {
            console.log(e);
        }
    }
    
    // room state : Progress
    onProgressRoomState(data) {
        console.log('onProgressRoom data : ', data);
        try {
            data.state = RoomStateType.Progress;
            this.onUpdateRoomState(data)
                .then(result => {
                    console.log("onProgressRoom", result);
                    if (result === 1) {
                        console.log("onProgressRoom 성공")
                    } else {
                        // this.onFailedRoomState(data); // roomData.state = RoomStateType.Failed;
                        console.log("onProgressRoom 실패")
                    }
                })
        } catch (e) {
            console.log(e);
        }
    }
    
    // room state : Complete
    onCompleteRoomState(data) {
        console.log('onCompleteRoom data : ', data);
        try {
            data.state = RoomStateType.Complete;
            return this.onUpdateRoomState(data)
            // .then(result => {
            //     console.log("onCompleteRoom", result);
            //     return result;
            // })
        } catch (e) {
            console.log(e);
        }
    }
    
    // room state : Failed
    onFailedRoomState(data) {
        console.log('onFailedRoom data : ', data);
        try {
            data.state = RoomStateType.Failed;
            this.onUpdateRoomState(data)
                .then(result => {
                    console.log("room state 'Failed' update success");
                    if (result !== 1) {
                        throw new Error("room state 'Failed' update error ");
                    }
                })
        } catch (e) {
            console.log(e);
        }
    }
}