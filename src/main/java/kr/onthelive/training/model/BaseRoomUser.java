package kr.onthelive.training.model;

import kr.onthelive.training.model.support.BaseRoomUserState;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseRoomUser {

    private String id;
    private String roomId;
    private String publisherId;
    private String playerId;
    private BaseRoomUserState state;
    private LocalDateTime createdDatetime;
    private LocalDateTime updatedDatetime;

}