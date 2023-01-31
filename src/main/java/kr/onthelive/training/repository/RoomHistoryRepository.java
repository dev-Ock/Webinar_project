package kr.onthelive.training.repository;

import kr.onthelive.training.repository.mapper.RoomHistoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RoomHistoryRepository {
    private RoomHistoryMapper mapper;

    @Autowired
    public RoomHistoryRepository(RoomHistoryMapper mapper) { this.mapper = mapper;}

}
