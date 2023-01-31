package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.model.support.BaseRoomState;

public interface RoomHistoryMapper {
    BaseRoomHistory selectRoom(String id);
//    List<BaseRoomHistory> selectRoomHistoryAll();
//    List<BaseRoomHistory> selectRoomHistoriesWhereState(BaseRoomHistory state);
    int insertRoomHistory(BaseRoomHistory roomHistory);
}
