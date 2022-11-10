package com.ssafy.developermaker.domain.user.application;

import com.ssafy.developermaker.domain.user.dto.LoginDto;
import com.ssafy.developermaker.domain.user.dto.UserDto;
import com.ssafy.developermaker.domain.user.entity.LoginType;
import com.ssafy.developermaker.domain.user.entity.User;
import com.ssafy.developermaker.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoUserService implements SocialUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserLoginService userLoginService;

    @Override
    @Transactional
    public UserDto getUserInfoByAccessToken(String access_token) {
        String reqURL = "https://kapi.kakao.com/v2/user/me";
        String result = "";
        try {

            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");

            // 전송할 header 작성
            conn.setDoOutput(true);
            conn.setRequestProperty("Authorization", "Bearer " + access_token);
            conn.setRequestProperty("charset", "UTF-8");

            // 결과 확인
            int responseCode = conn.getResponseCode();
            log.debug("responseCode : " + responseCode);

            // 요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line;

            while ((line = br.readLine()) != null) {
                result += line;
            }
            log.debug("response body : " + result);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 수정
        UserDto userDto = StringToDto(result);
        Optional<User> findUser = userRepository.findByEmail(userDto.getEmail());
        // 일치하는 회원이 없으면 회원가입
        if (!findUser.isPresent()) {
            userLoginService.signup(userDto, LoginType.KAKAO);
        }
        return userDto;
    }

    @Override
    public HttpEntity<? extends Object> login(UserDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail()).orElse(null);
        // 존재하지않는 회원
        if(user == null) {
            return new ResponseEntity<>("존재하지않는 회원입니다.", HttpStatus.NO_CONTENT);
        }

        LoginDto loginDto = new LoginDto();
        loginDto.setEmail(userDto.getEmail());
        loginDto.setPassword(userDto.getSocialId());
        return userLoginService.login(loginDto);
    }

    @Override
    public UserDto StringToDto(String userInfo) {
        UserDto userDto = new UserDto();
        try {
            // JSON 파싱
            JSONParser parser = new JSONParser();
            JSONObject jsonObj = (JSONObject) parser.parse(userInfo);

            JSONObject kakao_account = (JSONObject) jsonObj.get("kakao_account");
            JSONObject profile = (JSONObject) kakao_account.get("profile");

            String email = jsonObj.get("id").toString();
            userDto.setEmail(email+"KAKAO");
            userDto.setSocialId(jsonObj.get("id").toString());

            Optional<User> findUser = userRepository.findByEmail(email);
            if(findUser.isPresent()){
                return userDto;
            }

            String temp_nickname = UUID.randomUUID().toString().replaceAll("-", "");
            temp_nickname = "User"+temp_nickname.substring(0, 10);

            String nickname = (String)profile.getOrDefault("nickname", temp_nickname);
            userDto.setNickname(nickname);

        } catch (ParseException e) {
            e.printStackTrace();
        }
        return userDto;
    }
}
