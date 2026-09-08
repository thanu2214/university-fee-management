package com.university.feems.controller;

import com.university.feems.dto.ApiResponse;
import com.university.feems.dto.StudentCreateRequest;
import com.university.feems.dto.StudentDto;
import com.university.feems.security.UserPrincipal;
import com.university.feems.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentDto>> createStudent(@Valid @RequestBody StudentCreateRequest request) {
        StudentDto created = studentService.createStudent(request);
        return new ResponseEntity<>(ApiResponse.success("Student registered successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF')")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentCreateRequest request) {
        StudentDto updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    @GetMapping("/roll/{rollNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentByRollNumber(@PathVariable String rollNumber) {
        StudentDto student = studentService.getStudentByRollNumber(rollNumber);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentDto>> getMyProfile(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        StudentDto student = studentService.getStudentByUserId(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF')")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents(@RequestParam(required = false) String search) {
        List<StudentDto> students = (search != null && !search.trim().isEmpty())
                ? studentService.searchStudents(search)
                : studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> toggleStudentActive(@PathVariable Long id) {
        studentService.toggleStudentActive(id);
        return ResponseEntity.ok(ApiResponse.success("Student active status toggled", null));
    }
}
