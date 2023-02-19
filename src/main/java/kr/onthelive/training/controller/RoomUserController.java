package kr.onthelive.training.controller;

import kr.onthelive.training.model.*;
import kr.onthelive.training.repository.RoomUserRepository;
import kr.onthelive.training.service.RoomUserHistoryService;
import kr.onthelive.training.service.RoomUserService;
import kr.onthelive.training.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1/roomusers/")
public class RoomUserController {
    public RoomService roomService;
    private RoomUserService roomUserService;
    private RoomUserHistoryService roomUserHistoryService;

    public RoomUserController(RoomUserService roomUserService, RoomUserHistoryService roomUserHistoryService, RoomService roomService) {
        this.roomService = roomService;
        this.roomUserService = roomUserService;
        this.roomUserHistoryService = roomUserHistoryService;
    }

    // 룸 유저 한 명 조회
//    @GetMapping("/read/{id}")
//    public BaseRoomUser getRoomUser(HttpServletRequest httpRequest, @PathVariable("id") String id){
//        log.trace("controller getUser start...{}", id);
//        final BaseRoomUser result = roomUserService.getRoomUser(id);
//        return result;
//    }

    // roomId로 룸 유저 리스트 조회
    @GetMapping("/read/{roomId}")
    public List<BaseRoomUserWithUserName> getRoomUserListByRoomId(HttpServletRequest httpRequest, @PathVariable("roomId") String roomId) {
        List<BaseRoomUserWithUserName> roomUserList = roomUserService.getRoomUserListByRoomId(roomId);
        log.trace("RoomUserController getRoomUserListByRoomId roomUserList... {}", roomUserList);
        return roomUserList;
    }

    // 새로운 룸 유저 추가
    @PostMapping("/insert")
    public int createRoomUser(HttpServletRequest httpRequest, @RequestBody BaseRoomUser roomUser) {
        // 유저를 추가하기 전에 방의 인원수를 체크한다.
        String roomId = roomUser.getRoomId();
        int headcount = roomUserService.countRoomUserByRoomId(roomId);
//        System.out.println( headcount);
        int maximum = Integer.parseInt(roomService.getRoomMaximum(roomId));
//        System.out.println( maximum);
         if(headcount < maximum){
            log.trace("RoomUserController createRoomUser start... {}", roomUser);
            int result = roomUserService.createRoomUser(roomUser);
            int finalResult;
            if (result == -1) {
                finalResult = -1;
            } else if (result == 0) {
                finalResult = 0;
            } else {
                finalResult = roomUserHistoryService.createRoomUserHistoryByPublisher(roomUser);
            }
            return finalResult;  // finalResult가 1이면 insert 성공, -1이면 중복, 0이면 에러로 실패
         } else {
             int maximumOver = 555; //err응답을 받으면 프론트에서 인원수 초과로 입장 안되도록 처리 + alert 처리~~;
             log.trace("RoomUserController maximumOver... {}", maximumOver);
//             System.out.println( maximumOver);
             return maximumOver;
         }
    }

    // 룸 유저 StreamUrl update
    @PutMapping("/streamUrl")
    public BaseRoomUser updateRoomUserStreamUrl(HttpServletRequest httpRequest, @RequestBody BaseRoomUser baseRoomUser) {
        BaseRoomUser roomUserStreamUrl = roomUserService.updateRoomUserStreamUrl(baseRoomUser);

        return roomUserStreamUrl;
    }

    // 모든 룸의 전체 유저 목록 가져오기
    @GetMapping("/all")
    public List<BaseRoomUser> getRoomUserList(HttpServletRequest httpRequest) {
        List<BaseRoomUser> allRoomUsers = roomUserService.readAllRoomUsers();
        return allRoomUsers;
    }

    // 특정 룸에 입장한 유저 인원수 가져오기
    @GetMapping("/{roomId}/headcount")
    public int getRoomUserHeadcount(HttpServletRequest httpRequest, @PathVariable("roomId") String roomId) {
        int result = roomUserService.countRoomUserByRoomId(roomId);
        return result;
    }

}