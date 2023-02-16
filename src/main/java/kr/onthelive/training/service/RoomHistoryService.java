package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseRoomUserName;
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
    public List<BaseRoomHistory> getRoomHistoryListById(int publisherId){
        final List<BaseRoomHistory> roomHistory = roomHistoryRepository.selectRoomHistoryListById(publisherId);
        return roomHistory;
    }


    // 룸 기록 생성
    public int createRoomHistory(BaseRoomUserName roomInfo) {
        log.debug("test : {}", roomInfo);
        log.trace("service createRoomHistory roomInfo... {}", roomInfo);

        BaseRoomHistory roomHistory = new BaseRoomHistory();
        // getPassword() 에러처리 : 패스워드가 NULL 일 경우 에러남 >> if Null 이면 1 먹여주는거로 바꾸기
        int publicOrNot;
        if(roomInfo.getPassword().equals("")){
            publicOrNot = 0;
        }else{publicOrNot = 1;}

        roomHistory.setRoomId(roomInfo.getId());
        roomHistory.setState(roomInfo.getState());
        roomHistory.setPublisherId(roomInfo.getPublisherId());
        roomHistory.setTitle(roomInfo.getTitle());
        roomHistory.setDescription(roomInfo.getDescription());
        roomHistory.setPublicOrNot(publicOrNot);
        roomHistory.setMaximum(roomInfo.getMaximum());

        log.trace("service createRoomHistory roomHistory... {}", roomHistory);

        int result = roomHistoryRepository.insertRoomHistory(roomHistory);
        log.trace("service createRoomHistory result... {}", result);

        return result;

    }

}
