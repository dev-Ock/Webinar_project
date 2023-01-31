package kr.onthelive.training.controller;


import kr.onthelive.training.service.RoomHistoryService;
import kr.onthelive.training.service.RoomUserHistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("api/v1/roomhistory/")
public class RoomHistoryController {
    private RoomHistoryService roomHistoryService;

    @Autowired
    public RoomHistoryController(RoomHistoryService roomHistoryService) {
        this.roomHistoryService = roomHistoryService;
    }

//    @PostMapping("/setRoomData")


}
