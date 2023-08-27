package alpine.api.v1.auth.services.implementation;

import alpine.api.v1.auth.Confirmation;
import alpine.api.v1.auth.ConfirmationRepository;
import alpine.api.v1.auth.dto.SignInDTO;
import alpine.api.v1.auth.dto.SignUpDTO;
import alpine.api.v1.auth.dto.TokensDTO;
import alpine.api.v1.auth.services.AuthService;
import alpine.api.v1.email.Email;
import alpine.api.v1.email.interfaces.EmailService;
import alpine.api.v1.user.User;
import alpine.api.v1.user.UserRepository;
import alpine.api.v1.user.interfaces.UserService;
import alpine.common.exceptions.BadRequestException;
import alpine.common.exceptions.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Optional;

@Service("authService")
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final ConfirmationRepository confirmationRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final JwtServiceImpl jwtService;
    private final AuthenticationManager authenticationManager;


    @Override
    public boolean register(SignUpDTO signUpDTO) {
        var user = new User();
        user.setName(signUpDTO.name());
        user.setEmail(signUpDTO.email());
        user.setPassword(signUpDTO.password());
        userService.createUser(user);

        Confirmation confirmation = new Confirmation(user);

        confirmationRepository.save(confirmation);

        Email email = Email.builder()
                .to(user.getEmail())
                .name(user.getName())
                .subject("New User Account Verification")
                .body("Your account has been created. Please click the link below to verify your account.")
                .uri("auth/verify?token="+confirmation.getToken())
                .build();

        emailService.sendSimpleMailMessage(email);
        return true;
    }

    private TokensDTO createTokens() {
        return new TokensDTO("Hello", "World");
    }

    @Override
    public boolean validateToken(String token) throws BadRequestException {
        Optional<Confirmation> foundCode = confirmationRepository.findByToken(token);
        if (foundCode.isEmpty()) throw new BadRequestException("Invalid verification code");



        var theToken = foundCode.get();

        // Delete token even if its expired.
        confirmationRepository.delete(theToken);

        User user = theToken.getUser();
        if (user.getVerified())
            throw new BadRequestException("User is already verified.");

        Calendar calendar = Calendar.getInstance();
        if ((theToken.getExpirationDate().getTime() - calendar.getTime().getTime() < 0)) {
            throw new BadRequestException("Token already expired");
        }

        user.setVerified(true);
        userRepository.save(user);
        return true;
    }

    public String login(SignInDTO signInDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInDTO.email(), signInDTO.password())
        );
        // user is authenticated
        var user = userService.findByEmail(signInDTO.email()).orElseThrow(() -> new NotFoundException("User not found"));

        if (!user.getVerified()) throw new BadRequestException("User not verified.");

        return jwtService.generateToken(user);
    }
}
