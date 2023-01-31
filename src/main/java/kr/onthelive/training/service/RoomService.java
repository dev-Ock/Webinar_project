package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.repository.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RoomService {
    private RoomRepository roomRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository){
        this.roomRepository = roomRepository;
    }

    public void write(BaseRoom baseRoom) {

        roomRepository.insertRoom(baseRoom);
    }


}