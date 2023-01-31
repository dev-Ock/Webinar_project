package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomUser;


public interface RoomUserMapper {

    // 룸 유저 한 명 조회
    BaseRoomUser selectRoomUser(String id);

    // 새로운 룸 유저 추가
    int insertRoomUser(BaseRoomUser roomUser);
}