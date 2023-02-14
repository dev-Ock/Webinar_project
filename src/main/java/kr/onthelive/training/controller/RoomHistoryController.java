package kr.onthelive.training.controller;


import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.model.BaseRoomUserName;
import kr.onthelive.training.model.BaseSimpleRoom;
import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.service.RoomHistoryService;
import kr.onthelive.training.service.RoomUserHistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;


import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("api/v1/roomhistories")
public class RoomHistoryController {
    private RoomHistoryService roomHistoryService;

    @Autowired
    public RoomHistoryController(RoomHistoryService roomHistoryService) {
        this.roomHistoryService = roomHistoryService;

    }

    // 세미나실(방) 기록 전체 조회
    @GetMapping("/read/{publisherId}")
    public  List<BaseRoomHistory> getRoomHistoryListById(HttpServletRequest httpRequest, @PathVariable("publisherId") String publisherId){
        log.trace("controller getRoomHistoryListById start...");
        List<BaseRoomHistory> result = roomHistoryService.getRoomHistoryListById();
        return result;
    }

    // 세미나실(방) 기록 추가
    @PostMapping("/insert")
    public ResponseEntity setRoomHistory(HttpServletRequest httpRequest, HttpSession session, @RequestBody BaseRoomUserName roominfo) {
        log.trace("roomHistory insert... {}", roominfo);
        int result = roomHistoryService.setRoomHistory(roominfo);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
