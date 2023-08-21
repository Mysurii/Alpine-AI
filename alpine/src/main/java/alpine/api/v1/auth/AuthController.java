package alpine.api.v1.auth;

import alpine.api.v1.auth.dto.SignUpDTO;
import alpine.api.v1.auth.events.SignUpCompleteEvent;
import alpine.api.v1.user.User;
import alpine.common.dto.HttpResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthServiceImpl authService;
    private final ApplicationEventPublisher publisher;

    @PostMapping("/signup")
    public ResponseEntity<HttpResponse> SignUpUser(@RequestBody  SignUpDTO signUpDTO, final HttpServletRequest request) {

        authService.register(signUpDTO);
        String applicationUrl = getApplicationUrl(request);
//
//        publisher.publishEvent(new SignUpCompleteEvent(user, applicationUrl));

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
                        .message("User verified")
                        .status(HttpStatus.OK)
                        .build());
    }

    private String getApplicationUrl(HttpServletRequest request) {
        return String.format("https://%s:%s", request.getServerName(), request.getServerPort());
    }
}
