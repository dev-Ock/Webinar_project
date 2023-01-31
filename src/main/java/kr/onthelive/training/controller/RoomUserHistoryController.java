package kr.onthelive.training.controller;

import kr.onthelive.training.model.BaseRoomUserHistory;
import kr.onthelive.training.service.RoomUserHistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@Slf4j
@RequestMapping("/api/v1/roomuserhistory/")
public class RoomUserHistoryController {

    private RoomUserHistoryService roomUserHistoryService;

    @Autowired
    public RoomUserHistoryController(RoomUserHistoryService roomUserHistoryService) {
        this.roomUserHistoryService = roomUserHistoryService;
    }

    // id로 조회(test)
    @GetMapping("/getRoomUserHistory/{id}")
    public ResponseEntity<BaseRoomUserHistory> getRoomUserHistory(HttpServletRequest httpRequest, @PathVariable("id") String id) {
        log.trace("controller.getRoomUserHistory start... {}", id);
        final BaseRoomUserHistory roomUserHistory = roomUserHistoryService.getRoomUserHistory(id);

        return new ResponseEntity<>(roomUserHistory, HttpStatus.OK);
    }

    // 입력(test)
    @PostMapping("/createRoomUserHistory")
    public ResponseEntity createRoomUserHistory(HttpServletRequest httpRequest, @RequestBody BaseRoomUserHistory roomUserHistory){

        log.trace("controller.createRoomUserHistory start... {}", roomUserHistory);
        int result = roomUserHistoryService.createRoomUserHistory(roomUserHistory);

        return new ResponseEntity(result, HttpStatus.OK);
    }





}