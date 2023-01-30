package kr.onthelive.training.model;

import kr.onthelive.training.model.support.BaseUserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseUser {
    private String id;
    private String email;
    private String password;
    private String name;
    private String phoneNum;
    private BaseUserType type;
    private boolean enabled;
    private LocalDateTime createdDatetime;
    private LocalDateTime updatedDatetime;
}
