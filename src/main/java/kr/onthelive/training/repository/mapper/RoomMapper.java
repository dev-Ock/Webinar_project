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
        // streamUrl 중복검사
    BaseRoom selectRoomByStreamUrl(String streamUrl);
        // 새로운 룸 추가
    void insertRoom(BaseRoom room);
        // 해당 룸 정보 조회
    BaseRoom selectRoomById(String id);

}
