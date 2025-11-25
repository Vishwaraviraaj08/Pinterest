package com.pinterest.content.repository;

import com.pinterest.content.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByPinId(Long pinId);

    List<Report> findByReporterId(Long reporterId);
}
