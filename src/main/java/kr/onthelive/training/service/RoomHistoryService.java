package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.repository.RoomHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class RoomHistoryService {
    private RoomHistoryRepository roomHistoryRepository;

    @Autowired
    public RoomHistoryService(RoomHistoryRepository roomHistoryRepository) {
        this.roomHistoryRepository = roomHistoryRepository;
    }

    public int setRoomHistory(BaseRoomHistory roominfo) {
        log.debug("test : {}", roominfo);

        BaseRoomHistory roomHistory = new BaseRoomHistory();

        roomHistory.setRoomId(roominfo.getRoomId());
        roomHistory.setState(roominfo.getState());
        roomHistory.setCreatedDateTime(LocalDateTime.now());

        int result = roomHistoryRepository.insertRoomHistory(roomHistory);
        log.trace("service setRoomHistory result... {}", result);

        return result;

    }

}
