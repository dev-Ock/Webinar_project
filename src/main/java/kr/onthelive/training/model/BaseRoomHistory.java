package kr.onthelive.training.model;

import kr.onthelive.training.model.support.BaseRoomState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseRoomHistory {

    private String id;
    private String roomId;
    private BaseRoomState state;
    private LocalDateTime createdDateTime;


}
