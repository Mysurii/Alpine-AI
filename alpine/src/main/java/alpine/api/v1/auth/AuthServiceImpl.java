package alpine.api.v1.auth;

import alpine.api.v1.auth.dto.SignUpDTO;
import alpine.api.v1.auth.dto.TokensDTO;
import alpine.api.v1.auth.interfaces.AuthService;
import alpine.api.v1.email.Email;
import alpine.api.v1.email.interfaces.EmailService;
import alpine.api.v1.user.User;
import alpine.api.v1.user.interfaces.UserService;
import alpine.common.exceptions.BadRequestException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Optional;

@Service("authService")
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserService userService;
    private final ConfirmationRepository confirmationRepository;
    private final EmailService emailService;

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
                .body(getEmailMessage(user.getName()))
                .uri("?token="+confirmation.getToken())
                .build();

        emailService.sendSimpleMailMessage(email);
        return true;
    }

    public void saveVerificationCode(String code, User user) {
        var verificationCode = new Confirmation(user);
        confirmationRepository.save(verificationCode);
    }

    private TokensDTO createTokens() {
        return new TokensDTO("Hello", "World");
    }

    public Optional<Confirmation> findVerificationCode(String code) {
        return confirmationRepository.findByToken(code);
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
        userService.createUser(user);
        return true;
    }

    private String getEmailMessage(String name) {
        return "Hello " +
                name +
                "\n\nYour account has been created. Please click the link below to verify your account. \n\n";
    }
}
