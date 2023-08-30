package com.alpine.api.v1.auth.services.implementation;

import com.alpine.api.v1.auth.Confirmation;
import com.alpine.api.v1.auth.ConfirmationRepository;
import com.alpine.api.v1.auth.dto.SignUpDTO;
import com.alpine.api.v1.auth.services.AuthService;
import com.alpine.api.v1.email.Email;
import com.alpine.api.v1.email.interfaces.EmailService;
import com.alpine.api.v1.user.User;
import com.alpine.api.v1.user.interfaces.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {
    @Mock
    private  ConfirmationRepository confirmationRepository;
    @Mock
    private  UserService userService;
    @Mock
    private  EmailService emailService;
    @Mock
    private  JwtServiceImpl jwtService;
    @Mock
    private  AuthenticationManager authenticationManager;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(confirmationRepository, userService, emailService, jwtService, authenticationManager);
    }


    @Test
    void canRegister() {
        //given
        SignUpDTO signUpDTO = new SignUpDTO("John Doe", "john@doe.com", "Password");
        //when
        boolean isRegistered = authService.register(signUpDTO);
        //then

        ArgumentCaptor<User> userArgumentCaptor = ArgumentCaptor.forClass(User.class);
        ArgumentCaptor<Confirmation> confirmationArgumentCaptor = ArgumentCaptor.forClass(Confirmation.class);
        ArgumentCaptor<Email> emailArgumentCaptor = ArgumentCaptor.forClass(Email.class);


        verify(userService).createUser(userArgumentCaptor.capture());
        verify(confirmationRepository).save(confirmationArgumentCaptor.capture());
        verify(emailService).sendSimpleMailMessage(emailArgumentCaptor.capture());

        User capturedUser = userArgumentCaptor.getValue();
        Confirmation capturedConfirmation = confirmationArgumentCaptor.getValue();

        assertThat(capturedUser).isEqualTo(capturedConfirmation.getUser());
        assertThat(isRegistered).isTrue();
    }

    @Disabled
    @Test
    void itShouldValidateToken() {



    }
    @Disabled
    @Test
    void login() {
    }
}
