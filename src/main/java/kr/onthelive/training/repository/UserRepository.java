package kr.onthelive.training.repository;

import kr.onthelive.training.repository.mapper.UserMapper;
import kr.onthelive.training.model.BaseUser;
import kr.onthelive.training.model.support.BaseUserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {
    private UserMapper mapper;

    @Autowired
    public UserRepository(UserMapper mapper) {
        this.mapper = mapper;
    }

    public BaseUser selectUser(String id) {
        return mapper.selectUser(id);
    }
    public List<BaseUser> selectUserAll() {
        return mapper.selectUserAll();
    }

    public List<BaseUser> selectUsers(BaseUserType type) {
        return mapper.selectUsersWhereType(type);
    }

    public int insertUser(BaseUser user) {
        return mapper.insertUser(user);
    }

    public int removeUser(int userId) {
        return mapper.removeUser(userId);
    }

    public int updateUser(BaseUser user){
        return mapper.updateUser(user);
    }
}
