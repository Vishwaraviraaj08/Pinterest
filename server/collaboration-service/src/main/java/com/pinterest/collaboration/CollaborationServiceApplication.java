package com.pinterest.collaboration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class CollaborationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollaborationServiceApplication.class, args);
    }

}
