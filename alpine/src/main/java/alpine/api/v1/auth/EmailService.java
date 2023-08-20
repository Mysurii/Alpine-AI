package alpine.api.v1.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("emailService")
public class EmailService {
    private JavaEmailSender javaEmailSender;
    private SimpleE
    @Autowired
    public EmailService(JavaEmailSender javaEmailSender) {
        this.javaEmailSender = javaEmailSender;
    }

}
