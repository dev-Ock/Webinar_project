package kr.onthelive.training.controller;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.model.BaseSimpleUser;
import kr.onthelive.training.model.BaseUser;
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
    @GetMapping("/read/{id}")
    public BaseRoomUser getRoomUser(HttpServletRequest httpRequest, @PathVariable("id") String id){
        log.trace("controller getUser start...{}", id);
        final BaseRoomUser result = roomUserService.getRoomUser(id);
        return result;
    }

    // 새로운 룸 유저 추가
    @PostMapping("/insert")
    public ResponseEntity RoomUserUp(HttpServletRequest httpRequest, @RequestBody BaseRoomUser roomUser) {
        log.trace("컨트롤러 RoomUserUp printMessage start... {}", roomUser);
        roomUserService.RoomUserUp(roomUser);
        return new ResponseEntity<>(roomUser, HttpStatus.OK);
    }

}