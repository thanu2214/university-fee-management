package com.university.feems.controller;

import com.university.feems.dto.*;
import com.university.feems.service.FeeService;
import com.university.feems.service.StaffService;
import com.university.feems.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private FeeService feeService;

    // Staff Management
    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<UserDto>> createStaff(@Valid @RequestBody StaffCreateRequest request) {
        UserDto staff = staffService.createStaff(request);
        return new ResponseEntity<>(ApiResponse.success("Finance staff created successfully", staff), HttpStatus.CREATED);
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateStaff(@PathVariable Long id, @Valid @RequestBody StaffCreateRequest request) {
        UserDto staff = staffService.updateStaff(id, request);
        return ResponseEntity.ok(ApiResponse.success("Finance staff updated successfully", staff));
    }

    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllFinanceStaff() {
        return ResponseEntity.ok(ApiResponse.success(staffService.getAllFinanceStaff()));
    }

    @PatchMapping("/staff/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleStaffStatus(@PathVariable Long id) {
        staffService.toggleStaffStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Staff status updated", "Status toggled"));
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<String>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Finance staff deleted successfully", null));
    }

    // Fee Structure Management
    @PostMapping("/fee-structures")
    public ResponseEntity<ApiResponse<FeeStructureDto>> createFeeStructure(@Valid @RequestBody FeeStructureDto dto) {
        FeeStructureDto created = feeService.createFeeStructure(dto);
        return new ResponseEntity<>(ApiResponse.success("Fee structure created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/fee-structures/{id}")
    public ResponseEntity<ApiResponse<FeeStructureDto>> updateFeeStructure(@PathVariable Long id, @Valid @RequestBody FeeStructureDto dto) {
        FeeStructureDto updated = feeService.updateFeeStructure(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Fee structure updated successfully", updated));
    }

    @DeleteMapping("/fee-structures/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFeeStructure(@PathVariable Long id) {
        feeService.deleteFeeStructure(id);
        return ResponseEntity.ok(ApiResponse.success("Fee structure deleted successfully", null));
    }

    // Allocate Fee Record to a Student
    @PostMapping("/allocate-fee")
    public ResponseEntity<ApiResponse<FeeRecordDto>> allocateFeeRecord(@RequestParam Long studentId, @RequestParam Long feeStructureId) {
        FeeRecordDto record = feeService.createStudentFeeRecord(studentId, feeStructureId);
        return new ResponseEntity<>(ApiResponse.success("Fee record assigned to student successfully", record), HttpStatus.CREATED);
    }
}
