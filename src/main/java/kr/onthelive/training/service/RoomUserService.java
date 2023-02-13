package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseRoomUserWithUserName;
import kr.onthelive.training.model.BaseSimpleUser;
import kr.onthelive.training.model.support.BaseRoomUserState;
import kr.onthelive.training.repository.RoomUserRepository;
import kr.onthelive.training.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.List;


@Service
@Slf4j
public class RoomUserService {
//    private static final Logger logger = LoggerFactory.getLogger(RoomUserService.class);
    private RoomUserRepository roomUserRepository;
    @Autowired
    public RoomUserService(RoomUserRepository roomUserRepository
                                ) {

        this.roomUserRepository = roomUserRepository;
    }

    // 룸 유저 한 명 조회
    public BaseRoomUser getRoomUser(String id){
        BaseRoomUser result =  roomUserRepository.selectRoomUser(id);
        return result;
    }

    //
    public List<BaseRoomUserWithUserName> getRoomUserListByRoomId(String roomId) {
        List<BaseRoomUserWithUserName> roomUserList = roomUserRepository.selectRoomUserListByRoomId(roomId);
        return roomUserList;
    }

    // 새로운 룸 유저 추가
    public int createRoomUser(BaseRoomUser roomUser){
        String roomId = roomUser.getRoomId();
        String playerId = roomUser.getPlayerId();
        int result;
        log.trace("RoomUserService createRoomUser roomId, playerId... {},{}", roomId, playerId);

        Boolean duplication = roomUserRepository.checkExistedRoomUser(roomId,playerId);
        if (duplication){
            // 중복이면 result = -1로 return
            result = -1;
        } else {
            // 중복이 아닐 경우 룸 유저 추가
            BaseRoomUser user = new BaseRoomUser();
            user.setRoomId(roomUser.getRoomId());
            user.setPublisherId(roomUser.getPublisherId());
            user.setPlayerId(roomUser.getPlayerId());
            user.setState(roomUser.getState());

            result = roomUserRepository.insertRoomUser(user); // 1(성공) or 0(실패 - 에러) 나옴
        }
        return result; // result가 1이면 insert 성공, -1이면 중복으로 실패, 0이면 에러로 실패
    }
}