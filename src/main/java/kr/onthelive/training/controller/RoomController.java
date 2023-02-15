package kr.onthelive.training.controller;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.model.support.BaseRoomState;
import kr.onthelive.training.service.RoomService;
import kr.onthelive.training.service.RoomHistoryService;
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
    private RoomHistoryService roomHistoryService;

    @Autowired
    public RoomController(RoomService roomService, RoomHistoryService roomHistoryService) {
        this.roomService = roomService;
        this.roomHistoryService = roomHistoryService;
    }

    // 룸 목록 전체 조회 (password 제외)
    @GetMapping("/read/list")
    public List<BaseRoom> getRoomList(HttpServletRequest httpRequest){
        log.trace("controller getRoomList start...");
        List<BaseRoom> result = roomService.getRoomList();
        return result;
    }

    // 룸 목록 전체 조회 (password 포함)
    @GetMapping("/read/withnamelist")
    public List<BaseRoomUserName> getRoomUserNameList(HttpServletRequest httpRequest){
        log.trace("controller getRoomUserNameList start...");
        List<BaseRoomUserName> result = roomService.getRoomUserNameList();
        log.trace("controller getRoomUserNameList finished... {}", result);
        return result;
    }

    // 새로운 룸 추가하고 해당 룸 정보 return
    @PostMapping("/insert")
    public BaseRoomUserName  createRoom(HttpServletRequest httpRequest, @RequestBody BaseRoom room) {
        log.trace("createRoom start... {}", room);
        BaseRoomUserName roomData = roomService.createRoom(room);
        return roomData;
    }

    // room 비번방 password check
    @PostMapping("/check/room-pw/{roomId}")
    public int checkRoomPw(HttpServletRequest httpRequest, @PathVariable("roomId") String roomId, @RequestBody String password ){
        log.trace("RoomController checkRoomPw start... {},{}", roomId, password);
        int result = roomService.checkRoomPw(roomId, password);
        log.trace("RoomController checkRoomPw finished... {}", result);
        return result;
    }

    // room id로 room 조회
    @GetMapping("/read/{roomId}")
    public BaseRoomUserName getRoomById(HttpServletRequest httpRequest, @PathVariable("roomId") String roomId){
        log.trace("RoomController getSelectedRoom start... {}", roomId);
        BaseRoomUserName room = roomService.getRoomById(roomId);
        log.trace("RoomController getSelectedRoom finished... {}", room);
        return room;
    }

    // room state update & roomHistory create
    @PutMapping("/update")
    public int modifyRoomStateAndCreateRoomHistory(HttpServletRequest httpRequest, @RequestBody BaseRoomUserName roomInfo){
        log.trace("RoomController modifyRoomStateAndCreateRoomHistory start... {}", roomInfo);
        int result = roomService.modifyRoomState(roomInfo);
        if(result != 1){
            throw new Error("roomService.modifyRoomState failed");
        }
        log.trace("### {}",roomInfo);
        int result2 = roomHistoryService.setRoomHistory(roomInfo);
        if(result2 != 1){
            throw new Error("roomHistoryService.setRoomHistory failed");
        }
        log.trace("RoomController modifyRoomStateAndCreateRoomHistory finished... {}", result);
        return result;
    }


}