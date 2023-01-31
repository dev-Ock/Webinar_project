package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.repository.mapper.RoomMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class RoomRepository {
    private RoomMapper mapper;

    @Autowired
    public RoomRepository(RoomMapper mapper) {
        this.mapper = mapper;
    }

    // 룸 목록 전체 조회
    public List<BaseSimpleRoom> selectRoomList() {
        return mapper.selectRoomList();
    }

    // 새로운 룸 추가
    public int insertRoom(BaseRoom room) {
        return mapper.insertRoom(room);
    }
}

