package com.university.feems.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_structures")
public class FeeStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String program; // e.g. "B.Tech Computer Science & Engineering"

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear; // e.g. "2025-2026"

    @Column(nullable = false)
    private Integer semester;

    @Column(name = "tuition_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal tuitionFee = BigDecimal.ZERO;

    @Column(name = "exam_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal examFee = BigDecimal.ZERO;

    @Column(name = "library_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal libraryFee = BigDecimal.ZERO;

    @Column(name = "lab_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal labFee = BigDecimal.ZERO;

    @Column(name = "hostel_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal hostelFee = BigDecimal.ZERO;

    @Column(name = "sports_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal sportsFee = BigDecimal.ZERO;

    @Column(name = "total_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalFee = BigDecimal.ZERO;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FeeStructure() {}

    public FeeStructure(String program, String academicYear, Integer semester,
                        BigDecimal tuitionFee, BigDecimal examFee, BigDecimal libraryFee,
                        BigDecimal labFee, BigDecimal hostelFee, BigDecimal sportsFee,
                        LocalDate dueDate) {
        this.program = program;
        this.academicYear = academicYear;
        this.semester = semester;
        this.tuitionFee = tuitionFee != null ? tuitionFee : BigDecimal.ZERO;
        this.examFee = examFee != null ? examFee : BigDecimal.ZERO;
        this.libraryFee = libraryFee != null ? libraryFee : BigDecimal.ZERO;
        this.labFee = labFee != null ? labFee : BigDecimal.ZERO;
        this.hostelFee = hostelFee != null ? hostelFee : BigDecimal.ZERO;
        this.sportsFee = sportsFee != null ? sportsFee : BigDecimal.ZERO;
        this.dueDate = dueDate;
        this.totalFee = this.tuitionFee.add(this.examFee).add(this.libraryFee)
                .add(this.labFee).add(this.hostelFee).add(this.sportsFee);
        this.createdAt = LocalDateTime.now();
    }

    public void recalculateTotal() {
        this.totalFee = (tuitionFee != null ? tuitionFee : BigDecimal.ZERO)
                .add(examFee != null ? examFee : BigDecimal.ZERO)
                .add(libraryFee != null ? libraryFee : BigDecimal.ZERO)
                .add(labFee != null ? labFee : BigDecimal.ZERO)
                .add(hostelFee != null ? hostelFee : BigDecimal.ZERO)
                .add(sportsFee != null ? sportsFee : BigDecimal.ZERO);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public BigDecimal getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(BigDecimal tuitionFee) { this.tuitionFee = tuitionFee; recalculateTotal(); }

    public BigDecimal getExamFee() { return examFee; }
    public void setExamFee(BigDecimal examFee) { this.examFee = examFee; recalculateTotal(); }

    public BigDecimal getLibraryFee() { return libraryFee; }
    public void setLibraryFee(BigDecimal libraryFee) { this.libraryFee = libraryFee; recalculateTotal(); }

    public BigDecimal getLabFee() { return labFee; }
    public void setLabFee(BigDecimal labFee) { this.labFee = labFee; recalculateTotal(); }

    public BigDecimal getHostelFee() { return hostelFee; }
    public void setHostelFee(BigDecimal hostelFee) { this.hostelFee = hostelFee; recalculateTotal(); }

    public BigDecimal getSportsFee() { return sportsFee; }
    public void setSportsFee(BigDecimal sportsFee) { this.sportsFee = sportsFee; recalculateTotal(); }

    public BigDecimal getTotalFee() { return totalFee; }
    public void setTotalFee(BigDecimal totalFee) { this.totalFee = totalFee; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
