package com.alpine.api.v1.user.exceptions;

import com.alpine.common.exceptions.BadRequestException;


public class UserAlreadyExistsException extends BadRequestException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
