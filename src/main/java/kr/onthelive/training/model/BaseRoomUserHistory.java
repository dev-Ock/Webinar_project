package kr.onthelive.training.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseRoomUserHistory {

    private String id;
    private String roomId;
    private String playerId;
    private String state;
    private LocalDateTime createdDatetime;

}