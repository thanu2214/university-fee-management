package com.university.feems.controller;

import com.university.feems.dto.ApiResponse;
import com.university.feems.dto.FeeRecordDto;
import com.university.feems.dto.FeeStructureDto;
import com.university.feems.entity.FeeStatus;
import com.university.feems.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "*")
public class FeeController {

    @Autowired
    private FeeService feeService;

    // Fee Structures
    @GetMapping("/structures")
    public ResponseEntity<ApiResponse<List<FeeStructureDto>>> getAllStructures() {
        return ResponseEntity.ok(ApiResponse.success(feeService.getAllFeeStructures()));
    }

    @GetMapping("/structures/{id}")
    public ResponseEntity<ApiResponse<FeeStructureDto>> getStructureById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(feeService.getFeeStructureById(id)));
    }

    // Fee Records
    @GetMapping("/records")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF')")
    public ResponseEntity<ApiResponse<List<FeeRecordDto>>> getAllFeeRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) FeeStatus status) {
        List<FeeRecordDto> records;
        if (status != null) {
            records = feeService.getFeeRecordsByStatus(status);
        } else if (search != null && !search.trim().isEmpty()) {
            records = feeService.searchFeeRecords(search);
        } else {
            records = feeService.getAllFeeRecords();
        }
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/records/{id}")
    public ResponseEntity<ApiResponse<FeeRecordDto>> getFeeRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(feeService.getFeeRecordById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<FeeRecordDto>>> getFeeRecordsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(feeService.getFeeRecordsByStudentId(studentId)));
    }
}
