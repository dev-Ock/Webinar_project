package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.repository.mapper.RoomUserNameMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class RoomUserNameRepository {
    private RoomUserNameMapper mapper;

    @Autowired
    public RoomUserNameRepository(RoomUserNameMapper mapper) {
        this.mapper = mapper;
    }

    // 룸 목록 전체 조회
    public List<BaseRoomUserName> selectRoomDetailList() {
        return mapper.selectRoomDetailList();
    }

    // 새로운 룸 추가
}

