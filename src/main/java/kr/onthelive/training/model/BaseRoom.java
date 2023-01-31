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
public class BaseRoom {
    private String id;
    private String title;
    private String publisherId;
    private String description;
    private String password;
    private String maximum;
    private BaseRoomState state;
    private String streamUrl;
    private String startTime;
    private String link;
    private LocalDateTime createdDatetime;
    private LocalDateTime updatedDatetime;
}
