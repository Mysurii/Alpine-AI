package alpine.api.v1.email.interfaces;

import alpine.api.v1.email.Email;

import java.util.Optional;

public interface EmailService {
    void sendSimpleMailMessage(Email email);
}
