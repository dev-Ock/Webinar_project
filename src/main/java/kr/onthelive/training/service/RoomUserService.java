package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomUser;
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

    // 새로운 룸 유저 추가
    public int createRoomUser(BaseRoomUser roomUser){
        log.trace("서비스 RoomUserUp printMessage start... {}", roomUser);


        BaseRoomUser user = new BaseRoomUser();
        user.setRoomId(roomUser.getRoomId());
        user.setPublisherId(roomUser.getPublisherId());
        user.setPlayerId(roomUser.getPlayerId());
        user.setState(roomUser.getState());

        int result = roomUserRepository.insertRoomUser(user);
        return result;
    }
}