package com.university.feems.service;

import com.university.feems.dto.StudentCreateRequest;
import com.university.feems.dto.StudentDto;

import java.util.List;

public interface StudentService {
    StudentDto createStudent(StudentCreateRequest request);
    StudentDto updateStudent(Long id, StudentCreateRequest request);
    StudentDto getStudentById(Long id);
    StudentDto getStudentByRollNumber(String rollNumber);
    StudentDto getStudentByUserId(Long userId);
    List<StudentDto> getAllStudents();
    List<StudentDto> searchStudents(String query);
    void deleteStudent(Long id);
    void toggleStudentActive(Long id);
}
