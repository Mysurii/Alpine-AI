package com.alpine.api.v1.email;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Email {
    private String to;
    private String subject;
    private String name;
    private String body;
    private String uri;


}
