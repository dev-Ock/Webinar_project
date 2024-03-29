package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseRoomUserWithUserName;
import kr.onthelive.training.repository.RoomUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    //room id & login id로 룸 유저 테이블 데이터 조회
    public BaseRoomUser getRoomUserDetail(String roomId, String playerId){
        BaseRoomUser roomUser = new BaseRoomUser();
        roomUser.setRoomId(roomId);
        roomUser.setPlayerId(playerId);
        log.trace("RoomUserService 유저테이블조회 roomUser... {}", roomUser);
        BaseRoomUser result =  roomUserRepository.selectRoomUserWithUrl(roomUser);
        return result;
    }

    // 모든 룸의 모든 유저 전체 조회
    public List<BaseRoomUser> readAllRoomUsers() {
        List<BaseRoomUser> allRoomUsers = roomUserRepository.readAllRoomUsers();
        return allRoomUsers;
    }

    // roomId로 해당 룸의 인원수 체크
    public int countRoomUserByRoomId(String roomId) {
        int roomUsers = roomUserRepository.countRoomUserByRoomId(roomId);
        return roomUsers;
    }

    // roomId로 룸 유저 목록 조회
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

    // room user state를 progress로 update
    public int modifyStateProgress(String roomId){
        int result = roomUserRepository.updateStateProgress(roomId);
        return result;
    }

    // room user를 roomId로 삭제
    public int deleteStateProgress(String roomId){
        int result = roomUserRepository.deleteStateProgress(roomId);
        return result;
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



