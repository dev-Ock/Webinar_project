package kr.onthelive.training.repository;

import kr.onthelive.training.model.BaseRoom;
import kr.onthelive.training.repository.mapper.RoomMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@Repository
public class RoomRepository {
    private RoomMapper mapper;

    @Autowired
    public RoomRepository(RoomMapper mapper) {
        this.mapper = mapper;
    }

    //select
    public BaseRoom selectRoom(String id) {
        return mapper.selectRoom(id);
    }

    //insert
    public int insertRoom(BaseRoom room) {
        return mapper.insertRoom(room);
    }
}

