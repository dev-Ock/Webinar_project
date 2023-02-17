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
public class BaseRoomUserWithUserName {

    private String id;
    private String roomId;
    private String publisherId;
    private String playerId;
    private BaseRoomUserState state;
    private String streamUrl;
    private LocalDateTime createdDatetime;
    private LocalDateTime updatedDatetime;
    private String name;

}