package com.university.feems.dto;

import com.university.feems.entity.FeeStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FeeRecordDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String registrationNo;
    private String program;
    private String department;
    private Long feeStructureId;
    private String academicYear;
    private Integer semester;

    // Fee breakdown from fee structure
    private BigDecimal tuitionFee;
    private BigDecimal examFee;
    private BigDecimal libraryFee;
    private BigDecimal labFee;
    private BigDecimal hostelFee;
    private BigDecimal sportsFee;

    // Financial calculations
    private BigDecimal totalFeeAmount;
    private BigDecimal concessionAmount;
    private BigDecimal netPayableAmount;
    private BigDecimal paidAmount;
    private BigDecimal dueAmount;
    private FeeStatus feeStatus;
    private LocalDate dueDate;
    private LocalDateTime lastPaymentDate;
    private LocalDateTime createdAt;

    public FeeRecordDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getFeeStructureId() { return feeStructureId; }
    public void setFeeStructureId(Long feeStructureId) { this.feeStructureId = feeStructureId; }

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

    public BigDecimal getTotalFeeAmount() { return totalFeeAmount; }
    public void setTotalFeeAmount(BigDecimal totalFeeAmount) { this.totalFeeAmount = totalFeeAmount; }

    public BigDecimal getConcessionAmount() { return concessionAmount; }
    public void setConcessionAmount(BigDecimal concessionAmount) { this.concessionAmount = concessionAmount; }

    public BigDecimal getNetPayableAmount() { return netPayableAmount; }
    public void setNetPayableAmount(BigDecimal netPayableAmount) { this.netPayableAmount = netPayableAmount; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public BigDecimal getDueAmount() { return dueAmount; }
    public void setDueAmount(BigDecimal dueAmount) { this.dueAmount = dueAmount; }

    public FeeStatus getFeeStatus() { return feeStatus; }
    public void setFeeStatus(FeeStatus feeStatus) { this.feeStatus = feeStatus; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getLastPaymentDate() { return lastPaymentDate; }
    public void setLastPaymentDate(LocalDateTime lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
