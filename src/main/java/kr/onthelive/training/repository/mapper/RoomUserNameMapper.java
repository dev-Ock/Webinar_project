package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.model.support.BaseRoomState;

import java.util.List;

public interface RoomUserNameMapper {

    // 룸 테이블 전체 및 유저 테이블 이름 합쳐서 전체 조회
    List<BaseRoomUserName> selectRoomDetailList(BaseRoomState state1, BaseRoomState state2);

}
