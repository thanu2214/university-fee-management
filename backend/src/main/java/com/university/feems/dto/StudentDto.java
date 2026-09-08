package com.university.feems.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class StudentDto {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String rollNumber;
    private String registrationNo;
    private String program;
    private String department;
    private Integer currentSemester;
    private String academicYear;
    private LocalDate admissionDate;
    private String guardianName;
    private String guardianPhone;
    private String address;
    private Boolean active;
    private LocalDateTime createdAt;

    // Financial aggregates for fast rendering
    private BigDecimal totalFeesAllSemesters = BigDecimal.ZERO;
    private BigDecimal totalPaidAllSemesters = BigDecimal.ZERO;
    private BigDecimal totalDueAllSemesters = BigDecimal.ZERO;
    private String feeStatusOverview; // PAID, PARTIAL, OVERDUE, PENDING

    public StudentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate admissionDate) { this.admissionDate = admissionDate; }

    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

    public String getGuardianPhone() { return guardianPhone; }
    public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public BigDecimal getTotalFeesAllSemesters() { return totalFeesAllSemesters; }
    public void setTotalFeesAllSemesters(BigDecimal totalFeesAllSemesters) { this.totalFeesAllSemesters = totalFeesAllSemesters; }

    public BigDecimal getTotalPaidAllSemesters() { return totalPaidAllSemesters; }
    public void setTotalPaidAllSemesters(BigDecimal totalPaidAllSemesters) { this.totalPaidAllSemesters = totalPaidAllSemesters; }

    public BigDecimal getTotalDueAllSemesters() { return totalDueAllSemesters; }
    public void setTotalDueAllSemesters(BigDecimal totalDueAllSemesters) { this.totalDueAllSemesters = totalDueAllSemesters; }

    public String getFeeStatusOverview() { return feeStatusOverview; }
    public void setFeeStatusOverview(String feeStatusOverview) { this.feeStatusOverview = feeStatusOverview; }
}
