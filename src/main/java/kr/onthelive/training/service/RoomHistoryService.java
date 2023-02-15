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


    // 룸 기록 추가
    public int setRoomHistory(BaseRoomUserName roominfo) {
        log.debug("test : {}", roominfo);
        log.trace("service setRoomHistory roominfo... {}", roominfo);

        BaseRoomHistory roomHistory = new BaseRoomHistory();
        // getPassword() 에러처리 : 패스워드가 NULL 일 경우 에러남 >> if Null 이면 1 먹여주는거로 바꾸기
        int publicOrNot;
        if(roominfo.getPassword().equals("")){
            publicOrNot = 0;
        }else{publicOrNot = 1;}

        roomHistory.setRoomId(roominfo.getId());
        roomHistory.setState(roominfo.getState());
        roomHistory.setPublisherId(roominfo.getPublisherId());
        roomHistory.setTitle(roominfo.getTitle());
        roomHistory.setDescription(roominfo.getDescription());
        roomHistory.setPublicOrNot(publicOrNot);
        roomHistory.setMaximum(roominfo.getMaximum());

        log.trace("service setRoomHistory roomHistory... {}", roomHistory);

        int result = roomHistoryRepository.insertRoomHistory(roomHistory);
        log.trace("service setRoomHistory result... {}", result);

        return result;

    }

}
