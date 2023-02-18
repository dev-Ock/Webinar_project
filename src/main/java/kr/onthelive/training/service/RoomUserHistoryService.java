package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseRoomUserHistory;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseRoomUserWithUserName;
import kr.onthelive.training.repository.RoomUserHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RoomUserHistoryService {
    private RoomUserHistoryRepository repository;

    @Autowired
    public RoomUserHistoryService(RoomUserHistoryRepository repository) {
        this.repository = repository;
    }

    // id로 조회(test)
    public BaseRoomUserHistory getRoomUserHistory(String id) {
        log.trace("service.getRoomUserHistory start... {}", id);
        return repository.selectRoomUserHistory(id);
    }

    // 입력(test)
    public int createRoomUserHistory(BaseRoomUserHistory roomUserHistory) {
        return repository.insertRoomUserHistory(roomUserHistory);
    }

    // insert by Publisher
    public int createRoomUserHistoryByPublisher(BaseRoomUser roomUser) {

//        int result;

        BaseRoomUserHistory userHistory = new BaseRoomUserHistory();
        userHistory.setRoomId(roomUser.getRoomId());
        userHistory.setPlayerId(roomUser.getPlayerId());
        userHistory.setState(roomUser.getState());
        int result = repository.insertRoomUserHistory(userHistory); // 1(성공) or 0(실패 - 에러) 나옴
        return result; // result가 1이면 insert 성공, -1이면 중복으로 실패, 0이면 에러로 실패
    }

    // (publisherRoom에서 제어하는 경우) create roomUser state
    public int createRoomUserHistoryOnProgressByPublisher(List<BaseRoomUserWithUserName> roomUserList) {
        int result = repository.insertRoomUserHistoryOnProgressByPublisher(roomUserList);
        return result;
    }

    // roomUserHistory create [State Complete]
    public int createRoomUserHistoryOnCompleteByPublisher(List<BaseRoomUserWithUserName> roomUserList) {
        int result = repository.insertRoomUserHistoryOnCompleteByPublisher(roomUserList);
        return result;
    }

}