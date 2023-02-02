package kr.onthelive.training.controller;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1/rooms/")
public class RoomController {

    private RoomService roomService;
    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // 룸 목록 전체 조회 (password 제외)
    @GetMapping("/read/list")
    public List<BaseSimpleRoom> getRoomList(HttpServletRequest httpRequest){
        log.trace("controller getRoomList start...");
        List<BaseSimpleRoom> result = roomService.getRoomList();
        return result;
    }
    @GetMapping("/read/withnamelist")
    public List<BaseRoomUserName> getRoomUserNameList(HttpServletRequest httpRequest){
        log.trace("controller getRoomUserNameList start...");
        List<BaseRoomUserName> result = roomService.getRoomUserNameList();
        return result;
    }

    // 새로운 룸 추가
    @PostMapping("/insert")
    public ResponseEntity<BaseRoom> createRoom(HttpServletRequest httpRequest,
                                               @RequestBody BaseRoom room) {
        log.trace("createRoom start... {}", room);
        roomService.write(room);

        return new ResponseEntity<>(room, HttpStatus.OK);
    }


}