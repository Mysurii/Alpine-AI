package com.alpine.api.v1.auth.services.implementation;

import com.alpine.api.v1.auth.Confirmation;
import com.alpine.api.v1.auth.ConfirmationRepository;
import com.alpine.api.v1.auth.dto.SignInDTO;
import com.alpine.api.v1.auth.dto.SignUpDTO;
import com.alpine.api.v1.auth.dto.TokensDTO;
import com.alpine.api.v1.auth.services.AuthService;
import com.alpine.api.v1.email.Email;
import com.alpine.api.v1.email.interfaces.EmailService;
import com.alpine.api.v1.user.User;
import com.alpine.api.v1.user.UserRepository;
import com.alpine.api.v1.user.interfaces.UserService;
import com.alpine.common.exceptions.BadRequestException;
import com.alpine.common.exceptions.NotFoundException;
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
    private final UserService userService;
    private final EmailService emailService;
    private final JwtServiceImpl jwtService;
    private final AuthenticationManager authenticationManager;


    @Override
    public boolean register(SignUpDTO signUpDTO) {
        var user = SignUpDTO.mapToUser(signUpDTO);
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

    @Override
    public boolean validateToken(String token) throws BadRequestException {
       Confirmation theToken = confirmationRepository.findByToken(token).orElseThrow(() -> new NotFoundException("Token not found"));

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
        userService.updateUser(user.getId(), user);
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
