package com.alpine.api.v1.email.interfaces;

import com.alpine.api.v1.email.Email;

public interface EmailService {
    void sendSimpleMailMessage(Email email);
}
