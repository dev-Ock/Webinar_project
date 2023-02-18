package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomUserHistory;
import kr.onthelive.training.model.BaseRoomUserWithUserName;

import java.util.List;

public interface RoomUserHistoryMapper {
    // select
    BaseRoomUserHistory selectRoomUserHistory(String id);

    // insert
    int insertRoomUserHistory(BaseRoomUserHistory roomUserHistory);

    // roomUserHistory create [State Progress]
    int insertRoomUserHistoryOnProgressByPublisher(List<BaseRoomUserWithUserName> roomUserList);

    // roomUserHistory create [State Complete]
    int insertRoomUserHistoryOnCompleteByPublisher(List<BaseRoomUserWithUserName> roomUserList);
}