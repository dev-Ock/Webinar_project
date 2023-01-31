package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.repository.mapper.RoomUserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class RoomUserRepository {
    private RoomUserMapper mapper;

    @Autowired
    public RoomUserRepository(RoomUserMapper mapper) {
        this.mapper = mapper;
    }

    // select
    public BaseRoomUser selectRoomUser(String id) {
        return mapper.selectRoomUser(id);
    }

    // insert
    public int insertRoomUser(BaseRoomUser roomUser) {
        log.debug("여기 리파지토리 insertRoomUser : {}", roomUser);
        return mapper.insertRoomUser(roomUser);
    }

}