package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomUser;
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


    // 미정

    // 룸유저추가

    public void RoomUserUp(BaseRoomUser roomUser){
        log.trace("서비스 RoomUserUp printMessage start... {}", roomUser);

 roomUserRepository.insertRoomUser(roomUser);


    }

// 미정

}