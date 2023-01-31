package kr.onthelive.training.controller;

import kr.onthelive.training.model.BaseRoomUser;
import kr.onthelive.training.model.BaseUser;
import kr.onthelive.training.repository.RoomUserRepository;
import kr.onthelive.training.service.RoomUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@Slf4j
@RequestMapping("/api/v1/roomuser/")
public class RoomUserController {
    private RoomUserService roomUserService;

    public RoomUserController(RoomUserService roomUserService) {
        this.roomUserService = roomUserService;
    }

    @PostMapping("/insertRoomUser")
    public ResponseEntity RoomUserUp(HttpServletRequest httpRequest, @RequestBody BaseRoomUser roomUser) {
        log.trace("컨트롤러 RoomUserUp printMessage start... {}", roomUser);
        roomUserService.RoomUserUp(roomUser);
// 47번 참고
        return new ResponseEntity<>(roomUser, HttpStatus.OK);
    }

}