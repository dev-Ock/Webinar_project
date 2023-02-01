package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.repository.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RoomService {
    private RoomRepository roomRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository){
        this.roomRepository = roomRepository;
    }

    // 룸 목록 전체 조회
    public List<BaseSimpleRoom> getRoomList(){

        final List<BaseSimpleRoom> baseRoom =  roomRepository.selectRoomList();
        return baseRoom;
    }

    // 새로운 룸 추가
    public void write(BaseRoom baseInfo) {
        log.debug("BaseRoomService baseRoom : {}", baseInfo);

        BaseRoom baseRoom = new BaseRoom();

//        baseRoom.setRoomTitle(baseInfo.getRoomTitle);

        roomRepository.insertRoom(baseRoom);
    }


}