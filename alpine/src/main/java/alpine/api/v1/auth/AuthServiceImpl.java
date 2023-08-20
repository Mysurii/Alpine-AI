package alpine.api.v1.auth;

import alpine.api.v1.auth.dto.SignUpDTO;
import alpine.api.v1.auth.dto.TokensDTO;
import alpine.api.v1.auth.interfaces.AuthService;
import alpine.api.v1.user.User;
import alpine.api.v1.user.interfaces.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service("authService")
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserService userService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public TokensDTO register(SignUpDTO signUpDTO) {
        var user = new User();
        user.setName(signUpDTO.name());
        user.setEmail(signUpDTO.email());
        user.setPassword(encoder.encode(signUpDTO.Password()));

        userService.createUser(user);

        return createTokens();


    }

    private TokensDTO createTokens() {
        return new TokensDTO("Hello", "World");
    }

    public User createUser(SignUpDTO signUpDTO) {
        var user = new User();
        user.setName(signUpDTO.name());
        user.setEmail(signUpDTO.email());
        userService.createUser(user);
        return user;
    }
}
