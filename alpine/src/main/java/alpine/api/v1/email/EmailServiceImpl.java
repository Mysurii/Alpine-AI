package alpine.api.v1.email;

import alpine.api.v1.email.interfaces.EmailService;
import alpine.api.v1.email.utils.EmailUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailsender;
    @Value("${spring.mail.verify.host}")
    private String host;
    @Value("${spring.mail.username}")
    private String fromEmail;


    @Override
    public void sendSimpleMailMessage(Email email) {
        StringBuilder builder = new StringBuilder(EmailUtil.getHeader(email.getName()));

        builder.append(email.getBody());

        if (email.getUri() != null) {
            builder.append(EmailUtil.getUrl(host, email.getUri()));
        }
        builder.append(EmailUtil.getFooter());

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setSubject(email.getSubject());
            message.setFrom(fromEmail);
            message.setTo(email.getTo());
            message.setText(builder.toString());
            mailsender.send(message);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            throw new RuntimeException(ex);
        }
    }
}
