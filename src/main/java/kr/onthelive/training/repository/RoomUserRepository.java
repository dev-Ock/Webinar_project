package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseRoomUserWithUserName;
import kr.onthelive.training.repository.mapper.RoomUserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@Slf4j
public class RoomUserRepository {
    private RoomUserMapper mapper;

    @Autowired
    public RoomUserRepository(RoomUserMapper mapper) {
        this.mapper = mapper;
    }

    // 룸 유저 한 명 조회
    public BaseRoomUser selectRoomUser(String id) {
        return mapper.selectRoomUser(id);
    }

    //
    public List<BaseRoomUserWithUserName> selectRoomUserListByRoomId(String roomId){
        return mapper.selectRoomUserListByRoomId(roomId);
    }

    // 룸 유저 중복 검사
    public Boolean checkExistedRoomUser(String roomId, String playerId){
        int count =  mapper.countRoomUserByRoomIdAndPlayerId(roomId, playerId);
        return count > 0; // true or false
    }

    // 새로운 룸 유저 추가
    public int insertRoomUser(BaseRoomUser roomUser) {
        log.debug("여기 리파지토리 insertRoomUser : {}", roomUser);
        return mapper.insertRoomUser(roomUser);
    }

}