package alpine.api.v1.auth;

import alpine.api.v1.auth.dto.SignUpDTO;
import alpine.api.v1.auth.dto.TokensDTO;
import alpine.api.v1.auth.events.SignUpCompleteEvent;
import alpine.api.v1.user.User;
import alpine.api.v1.user.interfaces.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.antlr.v4.runtime.Token;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthServiceImpl authService;
    private final UserService userService;
    private final ApplicationEventPublisher publisher;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, TokensDTO>> SignUpUser(@RequestBody  SignUpDTO signUpDTO, final HttpServletRequest request) {

        User user = authService.createUser(signUpDTO);
        String applicationUrl = getApplicationUrl(request);

        publisher.publishEvent(new SignUpCompleteEvent(user, applicationUrl));

        System.out.println(signUpDTO);


        var tokens = new TokensDTO("this is aacces", "this is refresh");
        Map<String, TokensDTO> response = new HashMap<>();
        response.put("tokens", tokens);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    private String getApplicationUrl(HttpServletRequest request) {
        return String.format("https://%s:%s", request.getServerName(), request.getServerPort());
    }
}
