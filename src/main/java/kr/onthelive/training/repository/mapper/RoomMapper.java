package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseSimpleRoom;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoomMapper {

    // 룸 목록 전체 조회
    List<BaseSimpleRoom> selectRoomList();

    // 새로운 룸 추가하고 해당 룸 정보 return
    void insertRoom(BaseRoom room);
    BaseRoom selectRoomById(String id);
}
