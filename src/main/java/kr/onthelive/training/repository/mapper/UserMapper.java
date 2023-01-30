package kr.onthelive.training.repository.mapper;

import kr.onthelive.training.model.BaseUser;
import kr.onthelive.training.model.support.BaseUserType;

import java.util.List;

public interface UserMapper {
    BaseUser selectUser(String id);
    List<BaseUser> selectUserAll();
    List<BaseUser> selectUsersWhereType(BaseUserType type);
    int insertUser(BaseUser user);
    int removeUser(int userId);
    int updateUser(BaseUser user);
}

