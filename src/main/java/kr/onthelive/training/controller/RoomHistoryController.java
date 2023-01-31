package kr.onthelive.training.controller;


import kr.onthelive.training.model.BaseRoomHistory;
import kr.onthelive.training.service.RoomHistoryService;
import kr.onthelive.training.service.RoomUserHistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;


import javax.servlet.http.HttpServletRequest;

@RestController
@Slf4j
@RequestMapping("api/v1/roomhistory")
public class RoomHistoryController {
    private RoomHistoryService roomHistoryService;

    @Autowired
    public RoomHistoryController(RoomHistoryService roomHistoryService) {
        this.roomHistoryService = roomHistoryService;
    }

    @PostMapping("/setRoomInfo")
    public ResponseEntity setRoomHistory(HttpServletRequest httpRequest, HttpSession seesion, @RequestBody BaseRoomHistory roominfo) {
        log.trace("roomHistory insert... {}", roominfo);
        int result = roomHistoryService.setRoomHistory(roominfo);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
