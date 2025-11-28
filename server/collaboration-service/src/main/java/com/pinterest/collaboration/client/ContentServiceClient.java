package com.pinterest.collaboration.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "content-service")
public interface ContentServiceClient {
    @PostMapping("/api/content/boards/{boardId}/collaborators/{userId}")
    void addCollaborator(@PathVariable("boardId") Long boardId, @PathVariable("userId") Long userId);
}
