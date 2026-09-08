package com.university.feems.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_fee_records")
public class StudentFeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fee_structure_id", nullable = false)
    private FeeStructure feeStructure;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(nullable = false)
    private Integer semester;

    @Column(name = "total_fee_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalFeeAmount = BigDecimal.ZERO;

    @Column(name = "paid_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "due_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal dueAmount = BigDecimal.ZERO;

    @Column(name = "concession_amount", precision = 10, scale = 2)
    private BigDecimal concessionAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "fee_status", nullable = false, length = 30)
    private FeeStatus feeStatus = FeeStatus.PENDING;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "last_payment_date")
    private LocalDateTime lastPaymentDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public StudentFeeRecord() {}

    public StudentFeeRecord(Student student, FeeStructure feeStructure, String academicYear,
                            Integer semester, BigDecimal totalFeeAmount, LocalDate dueDate) {
        this.student = student;
        this.feeStructure = feeStructure;
        this.academicYear = academicYear;
        this.semester = semester;
        this.totalFeeAmount = totalFeeAmount;
        this.paidAmount = BigDecimal.ZERO;
        this.concessionAmount = BigDecimal.ZERO;
        this.dueAmount = totalFeeAmount;
        this.feeStatus = FeeStatus.PENDING;
        this.dueDate = dueDate;
        this.createdAt = LocalDateTime.now();
    }

    public void recalculateStatus() {
        BigDecimal netPayable = (totalFeeAmount != null ? totalFeeAmount : BigDecimal.ZERO)
                .subtract(concessionAmount != null ? concessionAmount : BigDecimal.ZERO);
        if (netPayable.compareTo(BigDecimal.ZERO) < 0) {
            netPayable = BigDecimal.ZERO;
        }

        BigDecimal currentPaid = paidAmount != null ? paidAmount : BigDecimal.ZERO;
        this.dueAmount = netPayable.subtract(currentPaid);
        if (this.dueAmount.compareTo(BigDecimal.ZERO) < 0) {
            this.dueAmount = BigDecimal.ZERO;
        }

        if (this.dueAmount.compareTo(BigDecimal.ZERO) == 0 && currentPaid.compareTo(BigDecimal.ZERO) > 0) {
            this.feeStatus = FeeStatus.PAID;
        } else if (currentPaid.compareTo(BigDecimal.ZERO) > 0 && this.dueAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.feeStatus = FeeStatus.PARTIALLY_PAID;
        } else {
            if (this.dueDate != null && LocalDate.now().isAfter(this.dueDate)) {
                this.feeStatus = FeeStatus.OVERDUE;
            } else {
                this.feeStatus = FeeStatus.PENDING;
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public FeeStructure getFeeStructure() { return feeStructure; }
    public void setFeeStructure(FeeStructure feeStructure) { this.feeStructure = feeStructure; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public BigDecimal getTotalFeeAmount() { return totalFeeAmount; }
    public void setTotalFeeAmount(BigDecimal totalFeeAmount) { this.totalFeeAmount = totalFeeAmount; recalculateStatus(); }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; recalculateStatus(); }

    public BigDecimal getDueAmount() { return dueAmount; }
    public void setDueAmount(BigDecimal dueAmount) { this.dueAmount = dueAmount; }

    public BigDecimal getConcessionAmount() { return concessionAmount; }
    public void setConcessionAmount(BigDecimal concessionAmount) { this.concessionAmount = concessionAmount; recalculateStatus(); }

    public FeeStatus getFeeStatus() { return feeStatus; }
    public void setFeeStatus(FeeStatus feeStatus) { this.feeStatus = feeStatus; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getLastPaymentDate() { return lastPaymentDate; }
    public void setLastPaymentDate(LocalDateTime lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
