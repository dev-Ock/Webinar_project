package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomUserHistory;
import kr.onthelive.training.repository.RoomUserHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RoomUserHistoryService {
    private RoomUserHistoryRepository repository;

    @Autowired
    public RoomUserHistoryService(RoomUserHistoryRepository repository){ this.repository = repository;}

    // id로 조회(test)
    public BaseRoomUserHistory getRoomUserHistory(String id){
        log.trace("service.getRoomUserHistory start... {}", id);
        return repository.selectRoomUserHistory(id);}

    // 입력(test)
    public int createRoomUserHistory(BaseRoomUserHistory roomUserHistory){
        return repository.insertRoomUserHistory(roomUserHistory);
    }

}