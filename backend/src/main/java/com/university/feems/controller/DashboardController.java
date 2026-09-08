package com.university.feems.controller;

import com.university.feems.dto.ApiResponse;
import com.university.feems.dto.DashboardStatsDto;
import com.university.feems.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboardStats()));
    }

    @GetMapping("/finance")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getFinanceStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getFinanceDashboardStats()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStudentStats(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStudentDashboardStats(studentId)));
    }
}
