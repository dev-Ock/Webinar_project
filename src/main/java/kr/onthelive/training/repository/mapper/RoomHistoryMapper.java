package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.model.support.BaseRoomState;

import java.util.List;

public interface RoomHistoryMapper {
//    BaseRoomHistory selectRoom(String id);
//    List<BaseRoomHistory> selectRoomHistoryAll();
//    List<BaseRoomHistory> selectRoomHistoriesWhereState(BaseRoomHistory state);

    // 룸 전체 기록 조회
    List<BaseRoomHistory> selectRoomHistoryList();

    // 룸 기록 추가
    int insertRoomHistory(BaseRoomHistory roomHistory);
}
