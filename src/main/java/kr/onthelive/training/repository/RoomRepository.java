package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.repository.mapper.RoomMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
@Slf4j
public class RoomRepository {
    private RoomMapper mapper;

    @Autowired
    public RoomRepository(RoomMapper mapper) {
        this.mapper = mapper;
    }

    // 룸 목록 전체 조회
    public List<BaseRoom> selectRoomList() {
        return mapper.selectRoomList();
    }


    // 새로운 룸 추가하고 해당 룸 정보 return
        // streamUrl 중복검사
    public BaseRoom selectRoomByStreamUrl(String streamUrl){
        BaseRoom result = mapper.selectRoomByStreamUrl(streamUrl);
        return result;
    }
        // 새로운 룸 추가
    public void insertRoom(BaseRoom room) {
        mapper.insertRoom(room);
    }
        // 해당 룸 정보 조회
    public BaseRoom selectRoomById(String id){
        BaseRoom roomData = mapper.selectRoomById(id);
        return roomData;
    }


}

