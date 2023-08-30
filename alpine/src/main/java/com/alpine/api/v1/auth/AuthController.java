package com.alpine.api.v1.auth;

import com.alpine.api.v1.auth.dto.SignInDTO;
import com.alpine.api.v1.auth.dto.SignUpDTO;
import com.alpine.api.v1.auth.services.implementation.AuthServiceImpl;
import com.alpine.common.dto.HttpResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthServiceImpl authService;

    @PostMapping("/signup")
    public ResponseEntity<HttpResponse> SignUpUser(@RequestBody  SignUpDTO signUpDTO, final HttpServletRequest request) {

        authService.register(signUpDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                HttpResponse.builder()
                        .message("User created")
                        .status(HttpStatus.CREATED)
                        .build()

        );
    }

    @GetMapping("/verify")
    public ResponseEntity<HttpResponse> verifyUser(@RequestParam("token") String token) {
        authService.validateToken(token);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                HttpResponse.builder()
                        .message("User verified. You can now login on the website.")
                        .status(HttpStatus.OK)
                        .build());
    }


    @GetMapping("/signin")
    public ResponseEntity<HttpResponse> signIn(@RequestBody SignInDTO signInDTO) {

        String token = authService.login(signInDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                HttpResponse.builder()
                        .message("Succesfully logged in")
                        .status(HttpStatus.OK)
                        .data(Map.of("token", token))
                        .build());
    }

}
