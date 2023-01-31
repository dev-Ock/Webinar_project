package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.repository.RoomHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class RoomHistoryService {
    private RoomHistoryRepository roomHistoryRepository;

    @Autowired
    public RoomHistoryService(RoomHistoryRepository roomHistoryRepository) {
        this.roomHistoryRepository = roomHistoryRepository;
    }

    // 룸 전체 기록 조회
    public List<BaseRoomHistory> getRoomHistoryList(){
        final List<BaseRoomHistory> roomHistory = roomHistoryRepository.selectRoomHistoryList();
        return roomHistory;
    }


    // 룸 기록 추가
    public int setRoomHistory(BaseRoomHistory roominfo) {
        log.debug("test : {}", roominfo);

        BaseRoomHistory roomHistory = new BaseRoomHistory();

        roomHistory.setRoomId(roominfo.getRoomId());
        roomHistory.setState(roominfo.getState());

        int result = roomHistoryRepository.insertRoomHistory(roomHistory);
        log.trace("service setRoomHistory result... {}", result);

        return result;

    }

}
