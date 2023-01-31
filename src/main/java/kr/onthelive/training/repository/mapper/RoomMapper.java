package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoom;

public interface RoomMapper {
    // select
    BaseRoom selectRoom(String id);
    // insert
    int insertRoom(BaseRoom room);
}
