package com.pinterest.gateway.config;

import com.pinterest.gateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtAuthenticationFilter filter) {
        return builder.routes()
                .route("user-authentication-service", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f.stripPrefix(0))
                        .uri("lb://user-authentication-service"))
                .route("content-service", r -> r
                        .path("/api/content/**")
                        .filters(f -> f.filter(filter.apply(new JwtAuthenticationFilter.Config())).stripPrefix(0))
                        .uri("lb://content-service"))
                .route("collaboration-service", r -> r
                        .path("/api/collaboration/**")
                        .filters(f -> f.filter(filter.apply(new JwtAuthenticationFilter.Config())).stripPrefix(0))
                        .uri("lb://collaboration-service"))
                .route("business-account-service", r -> r
                        .path("/api/business/**")
                        .filters(f -> f.filter(filter.apply(new JwtAuthenticationFilter.Config())).stripPrefix(0))
                        .uri("lb://business-account-service"))
                .build();
    }
}




