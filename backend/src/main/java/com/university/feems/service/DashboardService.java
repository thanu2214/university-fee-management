package com.university.feems.service;

import com.university.feems.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getAdminDashboardStats();
    DashboardStatsDto getFinanceDashboardStats();
    DashboardStatsDto getStudentDashboardStats(Long studentId);
}
