package com.university.feems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FeeStructureDto {
    private Long id;

    @NotBlank(message = "Program name is required")
    private String program;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotNull(message = "Semester is required")
    private Integer semester;

    private BigDecimal tuitionFee = BigDecimal.ZERO;
    private BigDecimal examFee = BigDecimal.ZERO;
    private BigDecimal libraryFee = BigDecimal.ZERO;
    private BigDecimal labFee = BigDecimal.ZERO;
    private BigDecimal hostelFee = BigDecimal.ZERO;
    private BigDecimal sportsFee = BigDecimal.ZERO;
    private BigDecimal totalFee = BigDecimal.ZERO;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private LocalDateTime createdAt;

    public FeeStructureDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public BigDecimal getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(BigDecimal tuitionFee) { this.tuitionFee = tuitionFee; }

    public BigDecimal getExamFee() { return examFee; }
    public void setExamFee(BigDecimal examFee) { this.examFee = examFee; }

    public BigDecimal getLibraryFee() { return libraryFee; }
    public void setLibraryFee(BigDecimal libraryFee) { this.libraryFee = libraryFee; }

    public BigDecimal getLabFee() { return labFee; }
    public void setLabFee(BigDecimal labFee) { this.labFee = labFee; }

    public BigDecimal getHostelFee() { return hostelFee; }
    public void setHostelFee(BigDecimal hostelFee) { this.hostelFee = hostelFee; }

    public BigDecimal getSportsFee() { return sportsFee; }
    public void setSportsFee(BigDecimal sportsFee) { this.sportsFee = sportsFee; }

    public BigDecimal getTotalFee() { return totalFee; }
    public void setTotalFee(BigDecimal totalFee) { this.totalFee = totalFee; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
