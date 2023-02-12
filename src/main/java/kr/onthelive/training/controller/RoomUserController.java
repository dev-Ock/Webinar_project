package kr.onthelive.training.controller;

import kr.onthelive.training.model.*;
import kr.onthelive.training.repository.RoomUserRepository;
import kr.onthelive.training.service.RoomUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1/roomusers/")
public class RoomUserController {
    private RoomUserService roomUserService;

    public RoomUserController(RoomUserService roomUserService) {
        this.roomUserService = roomUserService;
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
    public List<BaseRoomUserWithUserName> getRoomUserListByRoomId(HttpServletRequest httpRequest, @PathVariable("roomId") String roomId){
        List<BaseRoomUserWithUserName> roomUserList = roomUserService.getRoomUserListByRoomId(roomId);
        log.trace("RoomUserController getRoomUserListByRoomId roomUserList... {}", roomUserList);
        return roomUserList;
    }

    // 새로운 룸 유저 추가
    @PostMapping("/insert")
    public int createRoomUser(HttpServletRequest httpRequest, @RequestBody BaseRoomUser roomUser) {
        log.trace("RoomUserController RoomUserUp start... {}", roomUser);
        int result = roomUserService.createRoomUser(roomUser);
        return result;  // result가 1이면 insert 성공, -1이면 중복으로 실패, 0이면 에러로 실패
    }



}