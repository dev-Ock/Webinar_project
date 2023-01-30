package kr.onthelive.training.controller;

import kr.onthelive.training.exception.BaseException;
import kr.onthelive.training.exception.ErrorCode;
import kr.onthelive.training.service.AuthenticationService;
import kr.onthelive.training.model.BaseSimpleUser;
import kr.onthelive.training.model.BaseUser;
import kr.onthelive.training.model.BaseUserToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1/authentications/")
public class AuthenticationController {
    private AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    // 회원가입
    @PostMapping("/signUp")
    public ResponseEntity signUp(HttpServletRequest httpRequest, HttpSession session, @RequestBody BaseUser account) {
        log.trace("printMessage start... {}", account);
        int result = authenticationService.signUp(account);
// 47번 참고
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<BaseUserToken> getLoginToken(HttpServletRequest httpRequest, HttpSession session, @RequestBody BaseUser account) {
        final BaseUserToken token = authenticationService.getToken(account.getId(), account.getPassword(), session);
        log.trace("token... {}", token);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    // 로그인한 회원인지 check
    @GetMapping("/signcheck")
    public ResponseEntity<BaseSimpleUser> check(HttpServletRequest httpRequest) {
        final BaseSimpleUser user = authenticationService.getUser();

        if(user == null) {
            throw new BaseException(ErrorCode.CanNotFoundUser, "Can not found a user");
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // 로그아웃
    @PostMapping("/signout")
    public ResponseEntity logout(HttpServletRequest httpRequest, HttpServletResponse resp) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null){
            new SecurityContextLogoutHandler().logout(httpRequest, resp, auth);
        }

        return new ResponseEntity(HttpStatus.OK);
    }

    // 회원정보 수정
//    @PutMapping("/update/user")
//    public ResponseEntity updateUser(HttpServletRequest httpRequest, @RequestBody BaseUser account){
//        log.trace("controller updateUser start... {}", account);
//        int result = authenticationService.updateUser(account);
//        if(result == 1){
//            return new ResponseEntity(result, HttpStatus.OK);
//        }else{
//            return new ResponseEntity(HttpStatus.EXPECTATION_FAILED);
//        }
//    }

    // 회원 삭제 or 탈퇴
//    @DeleteMapping("/delete/user/{userId}")
//    public ResponseEntity removeUser(HttpServletRequest httpRequest,@PathVariable("userId") int userId) {
//        log.trace("controller removeUser start... {}", userId);
//        int result = authenticationService.removeUser(userId);
//        if(result == 1){
//            return new ResponseEntity(result, HttpStatus.OK);
//        }else{
//            return new ResponseEntity(HttpStatus.EXPECTATION_FAILED);
//        }
//    }

//    // 전체 사용자 조회
//    @GetMapping("/get/userlist")
//    public List<BaseUser> getUserlist(HttpServletRequest httpRequest){
//        log.trace("controller getUserlist start...");
//        List <BaseUser> result = authenticationService.getUserlist();
//        return result;
//    }


    // 예시
//    @PostMapping("/printMessage")
//    public ResponseEntity printMessage(HttpServletRequest httpRequest, HttpSession session, @RequestBody BaseUser account) {
//        log.trace("printMessage start... {}", account);
//        List<BaseUser> result = authenticationService.printMessageAddASD(account);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }
//
//    @PostMapping("/printMessage2")
//    public List<BaseUser> printMessage2(HttpServletRequest httpRequest,  HttpSession session,
//                                       @RequestParam("data") String message){
//        log.trace("printMessage start... {}", httpRequest);
////        log.debug("success...! {}", account);
//        // service 정의
//        // service 로직을 실행
//        List<BaseUser> result = authenticationService.printMessageAddASD(message);
//        return result;
//    }

}


