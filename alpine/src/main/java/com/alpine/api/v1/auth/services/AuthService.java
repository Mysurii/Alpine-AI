package com.alpine.api.v1.auth.services;

import com.alpine.api.v1.auth.dto.SignUpDTO;

public interface AuthService {
    boolean register(SignUpDTO signUpDTO);
    boolean validateToken(String token);
}
