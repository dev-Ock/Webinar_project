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
    public List<BaseRoom> getRoomList(HttpServletRequest httpRequest){
        log.trace("controller getRoomList start...");
        List<BaseRoom> result = roomService.getRoomList();
//        log.trace("controller getRoomList finished... {}", result);
        return result;
    }
    @GetMapping("/read/withnamelist")
    public List<BaseRoomUserName> getRoomUserNameList(HttpServletRequest httpRequest){
        log.trace("controller getRoomUserNameList start...");
        List<BaseRoomUserName> result = roomService.getRoomUserNameList();
        return result;
    }

    // 새로운 룸 추가하고 해당 룸 정보 return
    @PostMapping("/insert")
    public BaseRoom  createRoom(HttpServletRequest httpRequest,
                                               @RequestBody BaseRoom room) {
        log.trace("createRoom start... {}", room);
        BaseRoom roomData = roomService.createRoom(room);
        return roomData;
    }

    //
    @GetMapping("/read/{roomId}")
    public BaseRoom getRoomById(HttpServletRequest httpRequest, @PathVariable("roomId") String roomId){
        log.trace("12345678");
        log.trace("RoomController getSelectedRoom start... {}", roomId);
        BaseRoom room = roomService.getRoomById(roomId);
        log.trace("RoomController getSelectedRoom finished... {}", room);
        return room;
    }

}