package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseRoomUserWithUserName;

import java.util.HashMap;
import java.util.List;


public interface RoomUserMapper {

    // 룸 유저 한 명 조회
    BaseRoomUser selectRoomUser(String id);

    //
    List<BaseRoomUserWithUserName> selectRoomUserListByRoomId(String roomId);

    // 룸 유저 중복 검사
    int countRoomUserByRoomIdAndPlayerId(String roomId, String playerId);

    // streamUrl 중복검사
    int selectRoomUserByStreamUrl(String streamUrl);

    // 새로운 룸 유저 추가
    int insertRoomUser(BaseRoomUser roomUser);

    // 룸 유저 StreamUrl 추가
    int updateRoomUserStreamUrl(BaseRoomUser roomUser);

    // roomId와 playerId로 룸 유저
    BaseRoomUser selectRoomUserWithUrl(BaseRoomUser roomUser);


}