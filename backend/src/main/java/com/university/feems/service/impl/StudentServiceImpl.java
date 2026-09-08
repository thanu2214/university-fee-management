package com.university.feems.service.impl;

import com.university.feems.dto.StudentCreateRequest;
import com.university.feems.dto.StudentDto;
import com.university.feems.entity.*;
import com.university.feems.exception.BadRequestException;
import com.university.feems.exception.ResourceNotFoundException;
import com.university.feems.repository.FeeStructureRepository;
import com.university.feems.repository.StudentFeeRecordRepository;
import com.university.feems.repository.StudentRepository;
import com.university.feems.repository.UserRepository;
import com.university.feems.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentFeeRecordRepository feeRecordRepository;

    @Autowired
    private FeeStructureRepository feeStructureRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StudentDto createStudent(StudentCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already in use: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use: " + request.getEmail());
        }
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new BadRequestException("Roll Number already exists: " + request.getRollNumber());
        }
        if (studentRepository.existsByRegistrationNo(request.getRegistrationNo())) {
            throw new BadRequestException("Registration Number already exists: " + request.getRegistrationNo());
        }

        String rawPassword = request.getPassword() != null && !request.getPassword().trim().isEmpty()
                ? request.getPassword()
                : "Student@123";

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(rawPassword),
                request.getEmail(),
                request.getFullName(),
                Role.ROLE_STUDENT,
                request.getPhone()
        );

        Student student = new Student(
                user,
                request.getRollNumber(),
                request.getRegistrationNo(),
                request.getProgram(),
                request.getDepartment(),
                request.getCurrentSemester(),
                request.getAcademicYear(),
                request.getAdmissionDate(),
                request.getGuardianName(),
                request.getGuardianPhone(),
                request.getAddress()
        );

        Student savedStudent = studentRepository.save(student);

        // Auto-assign matching fee structure for this semester if exists
        Optional<FeeStructure> structureOpt = feeStructureRepository
                .findByProgramAndAcademicYearAndSemester(savedStudent.getProgram(), savedStudent.getAcademicYear(), savedStudent.getCurrentSemester());

        if (structureOpt.isPresent()) {
            FeeStructure structure = structureOpt.get();
            StudentFeeRecord record = new StudentFeeRecord(
                    savedStudent,
                    structure,
                    savedStudent.getAcademicYear(),
                    savedStudent.getCurrentSemester(),
                    structure.getTotalFee(),
                    structure.getDueDate()
            );
            record.recalculateStatus();
            feeRecordRepository.save(record);
        }

        return mapToDto(savedStudent);
    }

    @Override
    @Transactional
    public StudentDto updateStudent(Long id, StudentCreateRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        User user = student.getUser();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        student.setProgram(request.getProgram());
        student.setDepartment(request.getDepartment());
        student.setCurrentSemester(request.getCurrentSemester());
        student.setAcademicYear(request.getAcademicYear());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhone());
        student.setAddress(request.getAddress());

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentByRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with Roll Number: " + rollNumber));
        return mapToDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student record not found for User ID: " + userId));
        return mapToDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }

    @Override
    @Transactional
    public void toggleStudentActive(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        User user = student.getUser();
        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        userRepository.save(user);
    }

    private StudentDto mapToDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setUsername(student.getUser().getUsername());
        dto.setFullName(student.getUser().getFullName());
        dto.setEmail(student.getUser().getEmail());
        dto.setPhone(student.getUser().getPhone());
        dto.setRollNumber(student.getRollNumber());
        dto.setRegistrationNo(student.getRegistrationNo());
        dto.setProgram(student.getProgram());
        dto.setDepartment(student.getDepartment());
        dto.setCurrentSemester(student.getCurrentSemester());
        dto.setAcademicYear(student.getAcademicYear());
        dto.setAdmissionDate(student.getAdmissionDate());
        dto.setGuardianName(student.getGuardianName());
        dto.setGuardianPhone(student.getGuardianPhone());
        dto.setAddress(student.getAddress());
        dto.setActive(student.getUser().getActive());
        dto.setCreatedAt(student.getCreatedAt());

        // Calculate financial summaries across all semesters
        List<StudentFeeRecord> records = feeRecordRepository.findByStudentId(student.getId());
        BigDecimal totalFees = BigDecimal.ZERO;
        BigDecimal totalPaid = BigDecimal.ZERO;
        BigDecimal totalDue = BigDecimal.ZERO;
        boolean hasOverdue = false;
        boolean hasPartial = false;

        for (StudentFeeRecord record : records) {
            totalFees = totalFees.add(record.getTotalFeeAmount());
            totalPaid = totalPaid.add(record.getPaidAmount());
            totalDue = totalDue.add(record.getDueAmount());
            if (record.getFeeStatus() == FeeStatus.OVERDUE) hasOverdue = true;
            if (record.getFeeStatus() == FeeStatus.PARTIALLY_PAID) hasPartial = true;
        }

        dto.setTotalFeesAllSemesters(totalFees);
        dto.setTotalPaidAllSemesters(totalPaid);
        dto.setTotalDueAllSemesters(totalDue);

        if (totalDue.compareTo(BigDecimal.ZERO) == 0 && totalFees.compareTo(BigDecimal.ZERO) > 0) {
            dto.setFeeStatusOverview("PAID");
        } else if (hasOverdue) {
            dto.setFeeStatusOverview("OVERDUE");
        } else if (hasPartial) {
            dto.setFeeStatusOverview("PARTIALLY_PAID");
        } else {
            dto.setFeeStatusOverview("PENDING");
        }

        return dto;
    }
}
