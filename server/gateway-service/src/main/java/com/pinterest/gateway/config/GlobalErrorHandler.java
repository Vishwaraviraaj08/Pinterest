package com.pinterest.gateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
@Order(-1)
@Slf4j
public class GlobalErrorHandler implements ErrorWebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        
        log.error("Gateway error occurred for path: {} | Method: {} | Error Type: {}",
                exchange.getRequest().getPath(),
                exchange.getRequest().getMethod(),
                ex.getClass().getSimpleName(),
                ex);

        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        
        Throwable rootCause = ex;
        while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
            rootCause = rootCause.getCause();
        }

        String errorMessage = String.format(
                "{\"timestamp\":\"%s\",\"path\":\"%s\",\"status\":500,\"error\":\"Internal Server Error\",\"message\":\"%s\",\"type\":\"%s\"}",
                java.time.Instant.now().toString(),
                exchange.getRequest().getPath(),
                rootCause.getMessage() != null ? rootCause.getMessage().replace("\"", "'") : "Unknown error",
                ex.getClass().getSimpleName());

        byte[] bytes = errorMessage.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);

        return response.writeWith(Mono.just(buffer));
    }
}
