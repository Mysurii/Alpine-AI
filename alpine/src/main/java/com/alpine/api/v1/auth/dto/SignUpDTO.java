package com.alpine.api.v1.auth.dto;

import com.alpine.api.v1.user.User;

public record SignUpDTO(String name, String email, String password) {

    public static User mapToUser(SignUpDTO dto) {
        return User.builder().name(dto.name()).email(dto.email()).password(dto.password()).build();
    }
}
