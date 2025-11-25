package com.pinterest.content.controller;

import com.pinterest.content.entity.Report;
import com.pinterest.content.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/content/reports")
@RequiredArgsConstructor
@Tag(name = "Report Management", description = "APIs for managing reports")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @Operation(summary = "Create a new report")
    public ResponseEntity<Report> createReport(
            @RequestBody ReportRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        Report report = reportService.createReport(request.getTitle(), request.getMessage(), request.getPinId(),
                userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(report);
    }

    @Data
    public static class ReportRequest {
        private String title;
        private String message;
        private Long pinId;
    }
}
