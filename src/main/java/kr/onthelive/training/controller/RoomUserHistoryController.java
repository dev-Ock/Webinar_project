package kr.onthelive.training.controller;

import kr.onthelive.training.model.BaseRoomUserHistory;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseRoomUserWithUserName;
import kr.onthelive.training.service.RoomUserHistoryService;
import kr.onthelive.training.service.RoomUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/v1/roomuserhistories/")
public class RoomUserHistoryController {

    private RoomUserHistoryService roomUserHistoryService;
    private RoomUserService roomUserService;

    @Autowired
    public RoomUserHistoryController(RoomUserHistoryService roomUserHistoryService, RoomUserService roomUserService) {
        this.roomUserService = roomUserService;
        this.roomUserHistoryService = roomUserHistoryService;
    }

    // id로 룸 유저 기록 조회
    @GetMapping("/read/{id}")
    public ResponseEntity<BaseRoomUserHistory> getRoomUserHistory(HttpServletRequest httpRequest, @PathVariable("id") String id) {
        log.trace("controller.getRoomUserHistory start... {}", id);
        final BaseRoomUserHistory roomUserHistory = roomUserHistoryService.getRoomUserHistory(id);

        return new ResponseEntity<>(roomUserHistory, HttpStatus.OK);
    }

    // 룸 유저 기록 입력
    @PostMapping("/insert")
    public ResponseEntity createRoomUserHistory(HttpServletRequest httpRequest, @RequestBody BaseRoomUserHistory roomUserHistory){

        log.trace("controller.createRoomUserHistory start... {}", roomUserHistory);
        int result = roomUserHistoryService.createRoomUserHistory(roomUserHistory);

        return new ResponseEntity(result, HttpStatus.OK);
    }

    // (publisherRoom에서 제어하는 경우) create RoomUserHistory & update RoomUser [State Progress]
    @PostMapping("/insert-by-roomId/progress/{roomId}")
    public int createRoomUserHistoryAndUpdateRoomUserOnProgressByPublisher(HttpServletRequest httpRequest,@PathVariable("roomId") String roomId, @RequestBody List<BaseRoomUserWithUserName> roomUserList){
        log.trace("controller.createRoomUserHistoryAndUpdateRoomUserOnProgressByPublisher start... {}", roomId);

        log.trace("controller.createRoomUserHistoryAndUpdateRoomUserOnProgressByPublisher start... {}", roomUserList);

        // roomUser update by roomId
        int result = roomUserService.modifyStateProgress(roomId);

        int finalResult;
        if(result == 0){
            finalResult = 0;
        }else{
            // roomUserHistory create [State Progress]
            finalResult = roomUserHistoryService.createRoomUserHistoryOnProgressByPublisher(roomUserList);
        }

        return finalResult;

    }

    // (publisherRoom에서 제어하는 경우) create RoomUserHistory & update RoomUser [State Complete]
    @PostMapping("/insert-by-roomId/complete/{roomId}")
    public int createRoomUserHistoryAndUpdateRoomUserOnCompleteByPublisher(HttpServletRequest httpRequest,@PathVariable("roomId") String roomId, @RequestBody List<BaseRoomUserWithUserName> roomUserList){
        log.trace("controller.createRoomUserHistoryAndUpdateRoomUserOnCompleteByPublisher start... {}", roomId);

        log.trace("controller.createRoomUserHistoryAndUpdateRoomUserOnCompleteByPublisher start... {}", roomUserList);

        // roomUser delete by roomId
        int result = roomUserService.deleteStateProgress(roomId);

        int finalResult;
        if(result == 0){
            finalResult = 0;
        }else{
            // roomUserHistory create [State Complete]
            finalResult = roomUserHistoryService.createRoomUserHistoryOnCompleteByPublisher(roomUserList);
        }

        return finalResult;

    }



}