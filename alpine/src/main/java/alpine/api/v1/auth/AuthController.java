package alpine.api.v1.auth;

import alpine.api.v1.auth.dto.SignUpDTO;
import alpine.common.dto.HttpResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
