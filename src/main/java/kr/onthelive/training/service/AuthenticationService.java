package kr.onthelive.training.service;

import kr.onthelive.training.model.BaseSimpleUser;
import kr.onthelive.training.model.BaseUser;
import kr.onthelive.training.model.BaseUserToken;
import kr.onthelive.training.model.support.BaseUserType;
import kr.onthelive.training.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;


@Service
@Slf4j
public class AuthenticationService {
    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticationService(AuthenticationManager authenticationManager,
                                 UserRepository userRepository,
                                 PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //
    public BaseUserToken getToken(String id, String rawPassword, HttpSession session) {
        final Authentication request = new UsernamePasswordAuthenticationToken(id, rawPassword);
        final Authentication result = authenticationManager.authenticate(request);
        log.trace("AuthenticationService getToken result... {}",result);

        if ((result != null) && (result.isAuthenticated())) {
            SecurityContextHolder.getContext().setAuthentication(result);
        } else {
            return null;
        }

        return BaseUserToken.builder()
                .token(session.getId())
                .user((BaseSimpleUser) result.getDetails())
                .build();
    }

    // email로 user 조회
    public BaseSimpleUser getUserByEmail(String email) {
        final BaseSimpleUser simpleUser  = userRepository.selectUserByEmail(email);
        return simpleUser;
    }


    //
    public BaseSimpleUser getUser() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // spring에서 제공
        log.trace("AuthenticationService getUser authentication... {}", authentication.getDetails());
        return (BaseSimpleUser) authentication.getDetails();
    }

    // 회원정보 수정
//    public int updateUser(BaseUser account){
//        log.trace("service updateUser start... {}", account);
//        BaseUser user = new BaseUser();
//        user.setId(account.getId());
//        user.setEmail(account.getEmail());
//        user.setName(account.getName());
//        user.setType(account.getType());
//
//        int result = userRepository.updateUser(user);
//        log.trace("service updateUser result... {}", result);
//        return result;
//    }

    // 회원가입
    public int signUp(BaseUser account){
        log.debug("test : {}", account);

        BaseUser user = new BaseUser();

        final String encodedPassword = passwordEncoder.encode(account.getPassword());

        user.setEmail(account.getEmail());
        user.setPassword(encodedPassword);
        user.setName(account.getName());
        user.setPhoneNum(account.getPhoneNum());
        user.setType(account.getType());
        user.setPhoneNum(account.getPhoneNum());
        user.setType(BaseUserType.User);
        user.setEnabled(true);

        int result = userRepository.insertUser(user);
        log.trace("service signUp result... {}", result);


//        List<BaseUser> userData = userRepository.selectUser();
//        List<BaseUser> resultList = userRepository.selectUserAll();
        return result;
    }

//    public int removeUser(int userId){
//        log.trace("service removeUser start... {}", userId);
//        int result = userRepository.removeUser(userId);
//        log.trace("service removeUser result... {}",result);
//        return result;
//    }
//
//    public List<BaseUser> getUserlist(){
//        log.trace("service getUserlist start...");
//        List<BaseUser> result= userRepository.selectUserAll();
//        log.trace("service getUserlist result... {}", result);
//        return result;
//    }


//    public List<BaseUser> printMessageAddASD(BaseUser account){
////        String test = message + "asd";
//        log.debug("test : {}", account);
//
//        BaseUser user = new BaseUser();
//
//        user.setEmail(account.getEmail());
//        user.setPassword(account.getPassword());
//        user.setName(account.getName());
//        user.setType(account.getType());
//        user.setEnabled(true);
//
////        BaseUser user = new BaseUser();
////
////        user.setEmail("test@test.com");
////        user.setPassword("1234");
////        user.setName("seoungWoo");
////        user.setType(BaseUserType.Admin);
////        user.setEnabled(true);
//        int a = userRepository.insertUser(user);
//        log.debug("a : {}", a);
//
//        List<BaseUser> resultList = userRepository.selectUserAll();
//        return resultList;
//    }


}
