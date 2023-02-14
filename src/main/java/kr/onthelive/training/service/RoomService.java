package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.repository.RoomHistoryRepository;
import kr.onthelive.training.repository.RoomRepository;
import kr.onthelive.training.repository.RoomUserNameRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RoomService {
    private RoomRepository roomRepository;
    private RoomHistoryRepository roomHistoryRepository;
    private RoomUserNameRepository roomUserNameRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository, RoomUserNameRepository roomUserNameRepository){

        this.roomRepository = roomRepository;
        this.roomHistoryRepository = roomHistoryRepository;
        this.roomUserNameRepository = roomUserNameRepository;
    }

    // 룸 목록 전체 조회
    public List<BaseRoom> getRoomList(){

        final List<BaseRoom> baseRoom =  roomRepository.selectRoomList();
        return baseRoom;
    }
    //
    public List<BaseRoomUserName> getRoomUserNameList(){

        final List<BaseRoomUserName> baseRoomUserName =  roomUserNameRepository.selectRoomDetailList();
        return baseRoomUserName;
    }

    public String createStreamUrl(){
        // streamUrl 만들기
        StringBuilder str = new StringBuilder();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(int i=0; i<8; i++){
            str.append( chars.charAt((int) Math.floor(Math.random() * chars.length())));
        }
        String streamUrl = str.toString();
        return streamUrl;
    }


    // 새로운 룸 추가하고 해당 룸 정보 return
    public BaseRoomUserName createRoom(BaseRoom baseInfo) {
        log.debug("BaseRoomService baseRoom : {}", baseInfo);

        // streamUrl 생성
        String streamUrl = this.createStreamUrl();
        // streamUrl 중복 검사
        BaseRoom result = roomRepository.selectRoomByStreamUrl(streamUrl);
//        BaseRoom result = roomRepository.selectRoomByStreamUrl("nk2l9ZK5");

        log.trace("RoomService write streamUrl duplication test result ...{}, {}", streamUrl, result);

        while(result != null){
            streamUrl = this.createStreamUrl();
             result = roomRepository.selectRoomByStreamUrl(streamUrl);
        }
        log.trace("RoomService write streamUrl duplication test result3 ...{}, {}", streamUrl, result);


        // 새로 추가할 room 데이터 준비
        BaseRoom baseRoom = new BaseRoom();

        baseRoom.setTitle(baseInfo.getTitle());
        baseRoom.setPublisherId(baseInfo.getPublisherId());
        baseRoom.setDescription(baseInfo.getDescription());
        baseRoom.setPassword(baseInfo.getPassword());
        baseRoom.setMaximum(baseInfo.getMaximum());
        baseRoom.setState(baseInfo.getState());
        baseRoom.setStreamUrl(streamUrl);
        baseRoom.setStartTime(baseInfo.getStartTime());
        baseRoom.setLink(baseInfo.getLink());

        // insert
        roomRepository.insertRoom(baseRoom);

        // 새로 추가한 room의 id로 select
        String id = baseRoom.getId();
        BaseRoomUserName roomData =  roomRepository.selectRoomById(id);
        log.trace("RoomService roomData... {}", roomData);
        return roomData;

    }

    // room list에서 들어간 room 조회
    public BaseRoomUserName getRoomById(String roomId) {
        BaseRoomUserName room = roomRepository.selectRoomById(roomId);
        return room;
    }

    // room state update & roomHistory state insert
    public int modifyRoomState(BaseRoomUserName roomInfo) {
        return roomRepository.updateRoomState(roomInfo);
    }


}