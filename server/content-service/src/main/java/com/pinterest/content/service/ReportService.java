package com.pinterest.content.service;

import com.pinterest.content.entity.Report;
import com.pinterest.content.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    @Transactional
    public Report createReport(String title, String message, Long pinId, Long reporterId) {
        Report report = new Report();
        report.setTitle(title);
        report.setMessage(message);
        report.setPinId(pinId);
        report.setReporterId(reporterId);
        return reportRepository.save(report);
    }
}
