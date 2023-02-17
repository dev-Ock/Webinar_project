package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseRoomUserWithUserName;
import kr.onthelive.training.repository.mapper.RoomUserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
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

    // 룸 유저 전체 조회
    public List<BaseRoomUser> readAllRoomUsers () { return mapper.selectAllRoomUsers();}

    //
    public List<BaseRoomUserWithUserName> selectRoomUserListByRoomId(String roomId){
        return mapper.selectRoomUserListByRoomId(roomId);
    }

    // 룸 유저 중복 검사
    public Boolean checkExistedRoomUser(String roomId, String playerId){
        int count =  mapper.countRoomUserByRoomIdAndPlayerId(roomId, playerId);
        return count > 0; // true or false
    }

    // streamUrl 중복검사 : 나나 : 나중 추가
    public Boolean checkExistedStreamUrl(String streamUrl){
        int count = mapper.selectRoomUserByStreamUrl(streamUrl);
        return count > 0;
    }

    // roomUser의 컬럼에 streamUrl추가
    public int updateRoomUserStreamUrl(BaseRoomUser roomUser){
        log.trace("RoomUserRepository updateRoomUserStreamUrl... {},{}", roomUser);
        int result = mapper.updateRoomUserStreamUrl(roomUser);
        return result;
    }

    // roomId와 playerId로 update한 streamUrl 찾아오기
    public BaseRoomUser selectRoomUserWithUrl(BaseRoomUser roomUser){
        log.trace("RoomUserRepository selectRoomUser... {},{}", roomUser);
        BaseRoomUser roomUserWithUrl = mapper.selectRoomUserWithUrl(roomUser);
        return roomUserWithUrl;
    }

    // 새로운 룸 유저 추가
    public int insertRoomUser(BaseRoomUser roomUser) {
        log.debug("여기 리파지토리 insertRoomUser : {}", roomUser);
        return mapper.insertRoomUser(roomUser);
    }

}