package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomUserHistory;

public interface RoomUserHistoryMapper {
    // select
    BaseRoomUserHistory selectRoomUserHistory(String id);
    // insert
    int insertRoomUserHistory(BaseRoomUserHistory roomUserHistory);

}