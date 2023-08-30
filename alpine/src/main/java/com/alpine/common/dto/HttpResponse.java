package com.alpine.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@NoArgsConstructor
public class HttpResponse {
    private String timeStamp;
    private int statusCode;
    private HttpStatus status;
    private String message;

    private Map<?,?> data;

    @Builder(toBuilder = true)
    public HttpResponse(HttpStatus status, String message, Map<?,?> data) {
        this.status = status;
        this.statusCode = status.value();
        this.message = message;
        this.data = data;
        this.timeStamp = LocalDateTime.now().toString();
    }
}
