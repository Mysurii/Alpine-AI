package alpine.api.v1.auth.events.listeners;

import alpine.api.v1.auth.events.SignUpCompleteEvent;
import alpine.api.v1.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Slf4j
@Component
@RequiredArgsConstructor
public class SignUpCompleteEventListener implements ApplicationListener<SignUpCompleteEvent> {
    @Override
    public void onApplicationEvent(SignUpCompleteEvent event) {
        User user = event.getUser();
        String verificationCode = UUID.randomUUID().toString();
        String url = String.format("%s/api/v1/auth/verify?token=%s", event.getApplicationUrl(), verificationCode);


    }
}
