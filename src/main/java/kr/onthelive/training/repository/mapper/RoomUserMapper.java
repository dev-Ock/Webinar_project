package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseRoomUserWithUserName;

import java.util.List;


public interface RoomUserMapper {

    // 룸 유저 한 명 조회
    BaseRoomUser selectRoomUser(String id);

    //
    List<BaseRoomUserWithUserName> selectRoomUserListByRoomId(String roomId);

    // 룸 유저 중복 검사
    int countRoomUserByRoomIdAndPlayerId(String roomId, String playerId);

    // 새로운 룸 유저 추가
    int insertRoomUser(BaseRoomUser roomUser);
}