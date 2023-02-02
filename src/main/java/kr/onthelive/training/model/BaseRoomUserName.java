package kr.onthelive.training.model;

import kr.onthelive.training.model.support.BaseRoomState;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BaseRoomUserName {
    private String id;
    private String title;
    private String publisherId;
    private String description;
    private String maximum;
    private BaseRoomState state;
    private String streamUrl;
    private String startTime;
    private String link;
    private LocalDateTime createdDatetime;
    private LocalDateTime updatedDatetime;
    private String name;
}
