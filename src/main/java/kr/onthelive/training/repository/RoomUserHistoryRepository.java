package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoomUserHistory;
import kr.onthelive.training.repository.mapper.RoomUserHistoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoomUserHistoryRepository {
    private RoomUserHistoryMapper mapper;

    @Autowired
    public RoomUserHistoryRepository(RoomUserHistoryMapper mapper) {
        this.mapper = mapper;
    }

    // select
    public BaseRoomUserHistory selectRoomUserHistory(String id) {
        return mapper.selectRoomUserHistory(id);
    }

    // insert
    public int insertRoomUserHistory(BaseRoomUserHistory roomUserHistory) {
        return mapper.insertRoomUserHistory(roomUserHistory);
    }

}