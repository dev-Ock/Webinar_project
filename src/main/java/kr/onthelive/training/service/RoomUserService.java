package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoom;
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
import java.util.HashMap;
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

    // 룸 유저 전체 조회
    public List<BaseRoomUser> readAllRoomUsers() {
        List<BaseRoomUser> allRoomUsers = roomUserRepository.readAllRoomUsers();
        return allRoomUsers;
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


    // streamUrl 만들기
    public String createStreamUrl(){
        StringBuilder str = new StringBuilder();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(int i=0; i<8; i++){
            str.append( chars.charAt((int) Math.floor(Math.random() * chars.length())));
        }
        String streamUrl = str.toString();
        return streamUrl;
    }

    // 유저에게 streamUrl 추가
    public BaseRoomUser updateRoomUserStreamUrl(BaseRoomUser reqbodyRoomUser){
        String reqbodyRoomId = reqbodyRoomUser.getRoomId();
        String reqbodyPlayerId = reqbodyRoomUser.getPlayerId();

        if(reqbodyRoomId == null || reqbodyPlayerId == null){
            return null; // 여기서 에러 처리 어떻게 해야함?
        }
        // streamUrl 생성
        String streamUrl = this.createStreamUrl();

        // streamUrl 중복 검사
        Boolean checkedData = roomUserRepository.checkExistedStreamUrl(streamUrl);
        //BaseRoom result = roomRepository.selectRoomByStreamUrl("nk2l9ZK5");
        log.trace("RoomUserService - streamUrl duplication test result ...{}, {}", streamUrl, checkedData);

        while(checkedData){
            streamUrl = this.createStreamUrl();
            checkedData = roomUserRepository.checkExistedStreamUrl(streamUrl);
        log.trace("RoomUserService - streamUrl duplication test in while result ...{}, {}", streamUrl, checkedData);
        }

        // roomUser에 streamUrl 담아서 update
        BaseRoomUser roomUser = new BaseRoomUser();
        roomUser.setRoomId(reqbodyRoomId);
        roomUser.setPlayerId(reqbodyPlayerId);
        roomUser.setStreamUrl(streamUrl);
        log.trace("나 RoomUserService updateRoomUserStreamUrl roomUser {}", roomUser);
        int result = roomUserRepository.updateRoomUserStreamUrl(roomUser); // 1(성공) or 0(실패 - 에러) 나옴
        log.trace("나 RoomUserService updateRoomUserStreamUrl result {}", result);

        // update 성공시 streamUrl을 담은 객체 userWithUrl 반환
        BaseRoomUser userWithUrl;
        if(result > 0) {
            userWithUrl = roomUserRepository.selectRoomUserWithUrl(roomUser);
            return userWithUrl;
        } else {
            log.trace("RoomUserService updateRoomUserStreamUrl result : update Failed");
            return null;
        }
    }
}



