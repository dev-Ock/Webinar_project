package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseSimpleRoom;

import java.util.List;

public interface RoomMapper {

    // 룸 목록 전체 조회
    List<BaseSimpleRoom> selectRoomList();

    // 새로운 룸 추가
    int insertRoom(BaseRoom room);
}
