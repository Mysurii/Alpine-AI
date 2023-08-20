package alpine.api.v1.auth.events;

import alpine.api.v1.user.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.time.Clock;

@Getter
@Setter
public class SignUpCompleteEvent extends ApplicationEvent {
    private User user;
    private String applicationUrl;


    public SignUpCompleteEvent(User user, String applicationUrl) {
        super(user);
        this.user = user;
        this.applicationUrl = applicationUrl;
    }
}
