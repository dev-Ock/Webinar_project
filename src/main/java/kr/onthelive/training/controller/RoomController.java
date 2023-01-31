package kr.onthelive.training.controller;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@Slf4j
@RequestMapping("/api/v1/room/")
public class RoomController {

    private RoomService roomService;
    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/insert")
    public ResponseEntity<BaseRoom> createRoom(HttpServletRequest httpRequest,
                                               @RequestBody BaseRoom room) {
        log.trace("createRoom start... {}", room);
        roomService.write(room);

        return new ResponseEntity<>(room, HttpStatus.OK);
    }


}