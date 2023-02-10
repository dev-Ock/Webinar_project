package kr.onthelive.training.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
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
    //page test
//    @GetMapping("/read/withnamelist")
//    public PageInfo<BaseRoomUserName> getRoomUserNameList(HttpServletRequest httpRequest){
//        log.trace("controller getRoomUserNameList start...");
//        PageHelper.startPage(2,10);
//        List<BaseRoomUserName> result = roomService.getRoomUserNameList();
//        return PageInfo.of(result);
//    }

    // 새로운 룸 추가하고 해당 룸 정보 return
    @PostMapping("/insert")
    public BaseRoom  createRoom(HttpServletRequest httpRequest,
                                               @RequestBody BaseRoom room) {
        log.trace("createRoom start... {}", room);
        BaseRoom roomData = roomService.createRoom(room);
        return roomData;
    }
    //페이징'
//    @GetMapping("/get-page")
//    public CustomBaseResponse getPaging(BoardListSearchDTO boardListSearchDTO) {
//
//        if (boardListSearchDTO.getPageNum() <= 0) {
//            return CustomBaseResponse.error(400, "Bad Request", "요청 정보 확인이 필요합니다!");
//        } else if (boardListSearchDTO.getPageSize() <= 0) {
//            return CustomBaseResponse.error(400, "Bad Request", "요청 정보 확인이 필요합니다!");
//        }
//
//        PageHelper.startPage(boardListSearchDTO);
//
//        return CustomBaseResponse.ok(PageInfo.of(mybatisPagingTestService.getPaging(boardListSearchDTO)));
//
//    } // getPaging() 끝

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