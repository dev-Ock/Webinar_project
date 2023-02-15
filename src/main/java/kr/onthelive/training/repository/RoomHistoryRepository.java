package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.repository.mapper.RoomHistoryMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@Repository
public class RoomHistoryRepository {
    private RoomHistoryMapper mapper;

    @Autowired
    public RoomHistoryRepository(RoomHistoryMapper mapper) { this.mapper = mapper;}

    // 룸 전체 기록 조회
    public List<BaseRoomHistory> selectRoomHistoryListById(int publisherId){
        return mapper.selectRoomHistoryListById(publisherId);
    }

    // 룸 기록 추가
    public int insertRoomHistory(BaseRoomHistory roomHistory) {
        log.trace(" insertRoomHistory result... {}", roomHistory);

        return mapper.insertRoomHistory(roomHistory);
    }


}
