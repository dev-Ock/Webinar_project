package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoomUserHistory;
import kr.onthelive.training.model.BaseRoomUserWithUserName;
import kr.onthelive.training.repository.mapper.RoomUserHistoryMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class RoomUserHistoryRepository {
    private RoomUserHistoryMapper mapper;

    @Autowired
    public RoomUserHistoryRepository(RoomUserHistoryMapper mapper) {
        this.mapper = mapper;
    }

    // select
    public BaseRoomUserHistory selectRoomUserHistory(String id) {
        log.trace("repository.selectRoomUserHistory... {}", id);
        return mapper.selectRoomUserHistory(id);
    }

    // insert
    public int insertRoomUserHistory(BaseRoomUserHistory roomUserHistory) {
        log.trace("repository.insertRoomUserHistory... {}", roomUserHistory);
        return mapper.insertRoomUserHistory(roomUserHistory);
    }

    // roomUserHistory create [State Progress]
    public int insertRoomUserHistoryOnProgressByPublisher(List<BaseRoomUserWithUserName> roomUserList) {
        log.trace("repository.insertRoomUserHistoryOnProgressByPublisher... {}", roomUserList);
        int result = mapper.insertRoomUserHistoryOnProgressByPublisher(roomUserList);
        return result;
    }

    // roomUserHistory create [State Complete]
    public int insertRoomUserHistoryOnCompleteByPublisher(List<BaseRoomUserWithUserName> roomUserList) {
        log.trace("repository.insertRoomUserHistoryOnCompleteByPublisher... {}", roomUserList);
        int result = mapper.insertRoomUserHistoryOnCompleteByPublisher(roomUserList);
        return result;
    }
}