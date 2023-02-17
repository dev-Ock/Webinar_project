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
let EmptyPannelStream1 = {}

let pc = '';
let myVideo = '';
let videoOn = true; // 처음에는 카메리가 켜져 있음 (cameraOn : true)
let muteOn = false; // 처음에는 소리가 켜져 있음 (muteOn : false)
let camerasSelect = '';
let option = '';
let constraints = "";
let preferredDisplaySurface = "";
let endSharingTag = "";
let initialStream = {};
let stream = {};
let deviceId = "";

export default class RoomStore {

    publishedRoomList = Object.assign([], EmptyRoomList);
    roomList = Object.assign([], EmptyRoomList);
    roomMakeState = RoomMakeState.Empty;
    roomMake = Object.assign({}, EmptyRoom);
    onRoom = Object.assign({}, EmptyOnRoom);
    // roomListLength = toJS(this.roomList.length);
    onStream = Object.assign({}, EmptyStream);
    onPannelStream1 = Object.assign({}, EmptyPannelStream1);
    
    constructor(props) {
        this.roomRepository = props.roomRepository;
        // this.roomUserRepository = props.roomUserRepository;
        this.roomHistoryRepository = props.roomHistoryRepository;
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

    // stream 변경
    changeStream = (stream) => {
        this.onStream = stream;
    };

    // pannel stream
    changePannelStream = (stream) => {
        this.onPannelStream1 = stream;
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
            const publishedRoomData = yield this.roomHistoryRepository.getRoomHistory( userId );

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
    
    // 방 기본 세팅
    async setRoom() {
        constraints = {
            audio: true,
            video: {
                width: {ideal: 320, max: 576},
            },
        };

        // initialStream = new MediaStream();
        // let stream = initialStream;
        let stream = new MediaStream();
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('11',navigator.mediaDevices.getSupportedConstraints())
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
    }
    //player용 비디오, 오디오 셋팅 테스트
    async playerSetRoom() {
        const constraints = {
            audio: true,
            video: {
                width: {ideal: 320, max: 576},
            },
        };
        stream = new MediaStream();
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('test',stream.getTracks())
        myVideo = document.getElementById("myVideoTag");
        myVideo.srcObject = stream;

        // 비디오 장치들이 cameras 옵션에 달리도록 세팅
        // const devices = await navigator.mediaDevices.enumerateDevices();
        // const cameras = devices.filter((device) => device.kind === "videoinput");
        // console.log("devices", cameras);
        // camerasSelect = document.getElementById("cameras");
        // const currentCamera = stream.getVideoTracks()[0]; // 현재 선택되어 있는 카메라
        // cameras.forEach((camera) => {
        //     option = document.createElement("option");
        //     option.value = camera.deviceId;
        //     option.innerText = camera.label;
        //     option.style.textAlign = 'center';
        //     if (currentCamera.label === camera.label) {
        //         option.selected = true; // 현재 선택되어 있는 카메라가 보기의 main으로 보여지도록
        //     }
        //     camerasSelect.appendChild(option);
        // });

        stream.getAudioTracks()
            .forEach((track) => (track.enabled = false));
        console.log('플레이어 송출용 stream', stream);
        this.changeStream(stream);
        // return stream;
    }
    
    // SRS server-publisher 연결
    async serverPublisherConnection(url) {
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
            // console.log("offer", offer);
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
        };

        pc = new RTCPeerConnection();
        await publish(streamUrl);
    }
    
    // SRS server-publisher axios
    * setSRSserverPublisherConnection(data) {
        const result = yield this.roomRepository.onSRSserverPublisherConnection(data);
        return result;
    }
    
    // publisher용 Video turn on/off
    setVideoOnOff(videoOn) {
        console.log('RoomStore setVideoOnOff 진입');
        let stream = this.onStream;
        stream.getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        this.changeStream(stream);
        return !videoOn;
    }
    
    // publisher용 Audio turn on/off
    setAudioOnOff(audioOff) {
        console.log('RoomStore setAudioOnOff 진입');
        let stream = this.onStream;
        stream.getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        this.changeStream(stream);
        return !audioOff;
    }
    
    // Change Camera option
    async setChangeVideoOption() {
        camerasSelect = document.getElementById("cameras");
        console.log('RoomStore setChangeVideoOption 진입');
        console.log(camerasSelect.value);
        deviceId = camerasSelect.value;
        
        // 특정 device(camera 등) 설정값
        let cameraConstraints = {
            audio: true,
            video: {deviceId: {exact: deviceId}},
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
    }

    // 송출할 display 선택
    onSelectDisplayOption = async () => {
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
    }

    // SRS server로 송출할 stream 변경
    async onChangeBroadcastingStream() {
        if (pc) {
            let stream = this.onStream;
            console.log('pc videosender', pc.getSenders())
            const videoTrack = stream.getVideoTracks()[0];
            const videoSender = pc
                .getSenders()
                .find((sender) => sender.track.kind === "video");
            await videoSender.replaceTrack(videoTrack);
        }
    }
    
    // '공유 종료' 버튼을 눌러서 화면공유를 끝냈을 때, 다시 카메라로 stream 세팅
    async onEndDisplaySharing() {
        // 화면공유 끝나면 다시 카메라로 세팅
        console.log("end sharing");
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
    }

    /////////////////////////////////////////////////////////


    // SRS server-player 연결
    async serverPlayerConnection(url) {
        const streamUrl = url;
        // const streamUrl = "3abd9f34";
        
        const play = async (streamUrl) => {
            pc.addTransceiver("audio", {direction: "recvonly"});
            pc.addTransceiver("video", {direction: "recvonly"});
            
            let offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            // SRS server에 POST
            let data = {
                api: "http://haict.onthe.live:1985/rtc/v1/play/",
                // streamurl: "webrtc://haict.onthe.live/live/3abd9f34",
                streamurl: `webrtc://haict.onthe.live/live/${streamUrl}`,
                sdp      : offer.sdp,
            };
            console.log('data.streamurl', data.streamurl);
            
            const onPlay = (data) => {
                console.log("roomRepository onPlay 진입");
                return this.setSRSserverPlayerConnection(data);
            };
            
            onPlay(data).then(async (session) => {
                console.log("player session", session);
                console.log("player session.sdp", session.sdp);
                await pc.setRemoteDescription(
                    new RTCSessionDescription({type: "answer", sdp: session.sdp})
                );
            });
        };
        
        const ontrack = (event) => {
            stream.addTrack(event.track);
            console.log('playertest', stream.getTracks())
            myVideo = document.getElementById("peerFace"); // peerFace myVideoTag
            myVideo.srcObject = stream;
        };
        
        pc = new RTCPeerConnection();
        stream = new MediaStream();
        
        pc.ontrack = function (event) {
            if (ontrack) {
                ontrack(event);
            }
        };
        await play(streamUrl);
    }
    
    // SRS server-player axios
    * setSRSserverPlayerConnection(data) {
        const result = yield this.roomRepository.onSRSserverPlayerConnection(data);
        console.log('data check', result)
        return result;
    }
    
    // player용 Video turn on/off
    // setVideoOnOff2(videoOn) {
    setVideoOnOff2() {
        console.log('RoomStore setVideoOnOff 진입');
        // let videoBtn = document.getElementById("videoBtnTag");
        stream.getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        // return !videoOn;
    }

    // player용 Audio turn on/off
    // setAudioOnOff2(audioOff) {
    setAudioOnOff2() {
        console.log('RoomStore setAudioOnOff 진입');
        // let muteBtn = document.getElementById("muteBtnTag");
        stream.getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        // return !audioOff;
    }

    // 룸 전체 리스트 조회
    * selectRoomList() {
        // console.log("selectroomusername확인")
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
        const passwordCheck = prompt("password를 정확하게 입력해 주세요")
        if (passwordCheck == null) {
            return null;
        } else {
            const result = (passwordCheck == room.password ? this.passwordCheckDB(room) : this.passwordCheckFront(room));
            return result;
        }
    }
    
    // room password double-check<2>(Server)
    passwordCheckDB(room) {
        this.roomRepository.onCheckRoomPw(room.id, room.password)
            .then(data => {
                const result = (data === 1 ? 1 : this.passwordCheckFront(room));
                return result;
            })
            .catch(error => {
                console.log("RoomStore passwordCheckDB error", error)
            })
    }

    // publisher or player check
    async checkPublisherOrPlayer(room, userId, onCreateRoomUser) {
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

            } else {
                console.log('room user DB 저장 성공');
                await window.location.replace('/player-room');
            }
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
        sessionStorage.setItem(Repository.RoomViewRoomID, roomId);
        sessionStorage.setItem(Repository.RoomViewStreamUrl, streamUrl);
        
    }
    
    // 선택한 room 정보 조회
    async getSelectedRoom(roomId) {
        const room = this.roomRepository.onSelectRoom(roomId);
        room.then(room => {
                console.log('getSelectedRoom room', room);
                this.setOnRoom(room);
            }
        )
    }


    /////////////////////////////////////////////////////////

    // add pannel
    async onAddPannel(roomUser) {
        const streamUrl = roomUser.streamUrl;
        const play = async (streamUrl) => {
            pc.addTransceiver("audio", {direction: "recvonly"});
            pc.addTransceiver("video", {direction: "recvonly"});

            let offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // SRS server에 POST
            let data = {
                api: "http://haict.onthe.live:1985/rtc/v1/play/",
                streamurl: `webrtc://haict.onthe.live/live/${streamUrl}`,
                sdp      : offer.sdp,
            };
            console.log('pannel.streamurl', data.streamurl);

            const onPlay = (data) => {
                console.log("roomRepository onPlay 진입");
                return this.setSRSserverPlayerConnection(data);
            };

            onPlay(data).then(async (session) => {
                console.log("player session", session);
                console.log("player session.sdp", session.sdp);
                await pc.setRemoteDescription(
                    new RTCSessionDescription({type: "answer", sdp: session.sdp})
                );
            });
        };

        const ontrack = (event) => {
            pannelStream.addTrack(event.track);
            const friendFace1 = document.getElementById("friendFace1"); // peerFace
            friendFace1.srcObject = pannelStream;
        };

        pc = new RTCPeerConnection();
        let pannelStream = new MediaStream();

        pc.ontrack = function (event) {
            if (ontrack) {
                ontrack(event);
            }
        };
        await play(streamUrl);
    }

    /////////////////////////////////////////////////////////

    // room state change DB Update
    * onUpdateRoomState(data) {
        return yield this.roomRepository.onUpdateRoom(data);
    }

    // room state : Pending
    onPendingRoomState(data) {
        console.log('onProgressRoom data : ', data);
        data.state = RoomStateType.Pending;
        this.onUpdateRoomState(data)
            .then(result => {
                console.log("onProgressRoom", result);
                if (result !== 1) {
                    this.onFailedRoomState(data);
                }
            })
    }

    // room state : Progress
    onProgressRoomState(data) {
        console.log('onProgressRoom data : ', data);
        data.state = RoomStateType.Progress;
        this.onUpdateRoomState(data)
            .then(result => {
                console.log("onProgressRoom", result);
                if (result !== 1) {
                    this.onFailedRoomState(data);
                }
            })
    }

    // room state : Complete
    onCompleteRoomState(data) {
        console.log('onCompleteRoom data : ', data);
        data.state = RoomStateType.Complete;
        this.onUpdateRoomState(data)
            .then(result => {
                console.log("onCompleteRoom", result);
                alert('세미나가 종료되었습니다.');
                if (result !== 1) {
                    this.onFailedRoomState(data);
                    window.location.replace("/room-list");
                }
                sessionStorage.removeItem(Repository.RoomMakeRoomID);
                sessionStorage.removeItem(Repository.RoomMakePublisherId);
                sessionStorage.removeItem(Repository.RoomMakeStreamUrl);
                window.location.replace("/room-list");
            })
    }

    // room state : Failed
    onFailedRoomState(data) {
        console.log('onFailedRoom data : ', data);
        data.state = RoomStateType.Failed;
        this.onUpdateRoomState(data)
            .then(result => {
                console.log("room state 'Failed' update success")
                if (result !== 1) {
                    throw new Error("room state 'Failed' update error ")
                }
            })
    }
}