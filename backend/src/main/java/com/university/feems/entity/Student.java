package com.university.feems.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "roll_number", nullable = false, unique = true, length = 50)
    private String rollNumber;

    @Column(name = "registration_no", nullable = false, unique = true, length = 50)
    private String registrationNo;

    @Column(nullable = false, length = 100)
    private String program; // e.g. "B.Tech Computer Science & Engineering"

    @Column(nullable = false, length = 100)
    private String department; // e.g. "School of Computing"

    @Column(nullable = false)
    private Integer currentSemester; // 1 to 8

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear; // e.g. "2025-2026"

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Column(name = "guardian_name", length = 100)
    private String guardianName;

    @Column(name = "guardian_phone", length = 20)
    private String guardianPhone;

    @Column(length = 255)
    private String address;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Student() {}

    public Student(User user, String rollNumber, String registrationNo, String program, String department,
                   Integer currentSemester, String academicYear, LocalDate admissionDate,
                   String guardianName, String guardianPhone, String address) {
        this.user = user;
        this.rollNumber = rollNumber;
        this.registrationNo = registrationNo;
        this.program = program;
        this.department = department;
        this.currentSemester = currentSemester;
        this.academicYear = academicYear;
        this.admissionDate = admissionDate;
        this.guardianName = guardianName;
        this.guardianPhone = guardianPhone;
        this.address = address;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
