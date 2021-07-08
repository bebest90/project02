package com.hh99_spring.article.service;

import com.hh99_spring.article.domain.User;
import com.hh99_spring.article.dto.SignupRequestDto;
import com.hh99_spring.article.repository.UserRepository;
import com.hh99_spring.article.security.UserDetailsImpl;
import com.hh99_spring.article.security.kakao.KakaoOAuth;
import com.hh99_spring.article.security.kakao.KakaoUserInfo;
import com.hh99_spring.article.util.SignupValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final KakaoOAuth kakaoOAuth;
    private final AuthenticationManager authenticationManager;
    private static final String SCERET_KEY="AWDSDV_/xASDqDEDS34f0FSAvcvsZwddsffwooo";

    //화원가입
    public void registerUser(SignupRequestDto signupRequestDto) {
        //ID
        String username = signupRequestDto.getUsername();
        //정규식 검사
        if(!SignupValidator.idValid(username)){
            throw new IllegalArgumentException("idValid");
        }
        //중복검사
        Optional<User> found = userRepository.findByUsername(username);
        if (found.isPresent()) {
            throw new IllegalArgumentException("duplicate");
        }

        //PW
        String password = signupRequestDto.getPassword();
        String password_check = signupRequestDto.getPassword_check();
        //정규식 검사
        if(!SignupValidator.pwValid(username, password)){
            throw new IllegalArgumentException("pwValid");
        }
        //비밀번호 재입력 일치 검사
        if (!password.equals(password_check)) {
            throw new IllegalArgumentException("notequal");
        }
        //모든조건 충족시 비밀번호 암호화
        password = passwordEncoder.encode(signupRequestDto.getPassword());

        //Email
        String email = signupRequestDto.getEmail();
        if (!SignupValidator.emailValid(email)){
            throw new IllegalArgumentException("emailValid");
        }
        //중복검사
        Optional<User> found2 = userRepository.findByEmail(email);
        if (found2.isPresent()) {
            throw new IllegalArgumentException("Emailduplicate");
        }

         // 모든 조건 통과 및 암호화된 사용자 계정정보를 DB에 저장
        User user = new User(username, password, email);
        userRepository.save(user);
    }

    //카카오 가입
    public void kakaoLogin(String authorizedCode) {
        // 카카오 OAuth2 를 통해 카카오 사용자 정보 조회
        KakaoUserInfo userInfo = kakaoOAuth.getUserInfo(authorizedCode);
        Long kakaoId = userInfo.getId();
        String nickname = userInfo.getNickname();
        String email = userInfo.getEmail();

        // DB 에 중복된 Kakao Id 가 있는지 확인
        User kakaoUser = userRepository.findByKakaoId(kakaoId)
                .orElse(null);
        System.out.println(kakaoUser);
        if (kakaoUser == null) {
            // 카카오 이메일과 동일한 이메일을 가진 회원이 있는지 확인
            User sameEmailUser = userRepository.findByEmail(email).orElse(null);
            if (sameEmailUser != null) {
                kakaoUser = sameEmailUser;
                // 카카오 이메일과 동일한 이메일 회원이 있는 경우
                // 카카오 Id 를 회원정보에 저장
                kakaoUser.setKakaoId(kakaoId);
                userRepository.save(kakaoUser);

            } else {
                // 카카오 정보로 회원가입
                // username = 카카오 nickname
                String username = nickname;
                // password = 카카오 Id + ADMIN TOKEN
                String password = kakaoId + SCERET_KEY;
                // 패스워드 인코딩
                String encodedPassword = passwordEncoder.encode(password);

                kakaoUser = new User(username, encodedPassword, email, kakaoId);
                userRepository.save(kakaoUser);
            }
        }

        // 강제 로그인 처리
        UserDetailsImpl userDetails = new UserDetailsImpl(kakaoUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
