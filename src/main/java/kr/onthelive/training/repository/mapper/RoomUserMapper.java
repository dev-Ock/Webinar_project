package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoomUser;


public interface RoomUserMapper {
    // select
    BaseRoomUser selectRoomUser(String id);
    // insert
    int insertRoomUser(BaseRoomUser roomUser);
//    log.trace("서비스 RoomUserUp printMessage start... {}", roomUser);

}