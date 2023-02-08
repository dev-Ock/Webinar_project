package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.model.BaseRoomHistory;
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
    private RoomUserNameRepository roomUserNameRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository, RoomUserNameRepository roomUserNameRepository){

        this.roomRepository = roomRepository;
        this.roomUserNameRepository = roomUserNameRepository;
    }

    // 룸 목록 전체 조회
    public List<BaseSimpleRoom> getRoomList(){

        final List<BaseSimpleRoom> baseRoom =  roomRepository.selectRoomList();
        return baseRoom;
    }
    //
    public List<BaseRoomUserName> getRoomUserNameList(){

        final List<BaseRoomUserName> BaseRoomUserName =  roomUserNameRepository.selectRoomDetailList();
        return BaseRoomUserName;
    }

    // 새로운 룸 추가하고 해당 룸 정보 return
    public BaseRoom write(BaseRoom baseInfo) {
        log.debug("BaseRoomService baseRoom : {}", baseInfo);

        BaseRoom baseRoom = new BaseRoom();

        baseRoom.setTitle(baseInfo.getTitle());
        baseRoom.setPublisherId(baseInfo.getPublisherId());
        baseRoom.setDescription(baseInfo.getDescription());
        baseRoom.setPassword(baseInfo.getPassword());
        baseRoom.setMaximum(baseInfo.getMaximum());
        baseRoom.setState(baseInfo.getState());
        baseRoom.setStreamUrl(baseInfo.getStreamUrl());
        baseRoom.setStartTime(baseInfo.getStartTime());
        baseRoom.setLink(baseInfo.getLink());

        roomRepository.insertRoom(baseRoom);

        String id = baseRoom.getId();
        BaseRoom roomData =  roomRepository.selectRoomById(id);
        log.trace("RoomService roomData... {}", roomData);
        return roomData;

    }


}