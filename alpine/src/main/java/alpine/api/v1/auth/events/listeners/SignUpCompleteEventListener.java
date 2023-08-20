package alpine.api.v1.auth.events.listeners;

import alpine.api.v1.auth.AuthServiceImpl;
import alpine.api.v1.auth.events.SignUpCompleteEvent;
import alpine.api.v1.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Component
@RequiredArgsConstructor
public class SignUpCompleteEventListener implements ApplicationListener<SignUpCompleteEvent> {

    private final AuthServiceImpl authService;

    @Override
    public void onApplicationEvent(SignUpCompleteEvent event) {
        User user = event.getUser();
        String verificationCode = UUID.randomUUID().toString();
        authService.saveVerificationCode(verificationCode, user);


        String url = String.format("%s/api/v1/auth/verify?token=%s", event.getApplicationUrl(), verificationCode);


    }
}
