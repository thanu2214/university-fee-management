package com.university.feems.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "receipts")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payment_id", nullable = false, unique = true)
    private Payment payment;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 60)
    private String receiptNumber; // e.g. "UFM-2026-REC-10492"

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate = LocalDateTime.now();

    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @Column(name = "roll_number", nullable = false, length = 50)
    private String rollNumber;

    @Column(name = "registration_no", nullable = false, length = 50)
    private String registrationNo;

    @Column(nullable = false, length = 100)
    private String program;

    @Column(nullable = false)
    private Integer semester;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_reference", nullable = false, length = 80)
    private String transactionReference;

    @Column(name = "balance_remaining", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceRemaining;

    @Column(name = "authorized_signatory", length = 100)
    private String authorizedSignatory = "Controller of Finance, Apex University";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Receipt() {}

    public Receipt(Payment payment, String receiptNumber, String studentName, String rollNumber,
                   String registrationNo, String program, Integer semester, String academicYear,
                   BigDecimal amountPaid, PaymentMethod paymentMethod, String transactionReference,
                   BigDecimal balanceRemaining, String authorizedSignatory) {
        this.payment = payment;
        this.receiptNumber = receiptNumber;
        this.issueDate = LocalDateTime.now();
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.registrationNo = registrationNo;
        this.program = program;
        this.semester = semester;
        this.academicYear = academicYear;
        this.amountPaid = amountPaid;
        this.paymentMethod = paymentMethod;
        this.transactionReference = transactionReference;
        this.balanceRemaining = balanceRemaining;
        this.authorizedSignatory = authorizedSignatory != null ? authorizedSignatory : "Controller of Finance, Apex University";
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.issueDate == null) {
            this.issueDate = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public LocalDateTime getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDateTime issueDate) { this.issueDate = issueDate; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public BigDecimal getBalanceRemaining() { return balanceRemaining; }
    public void setBalanceRemaining(BigDecimal balanceRemaining) { this.balanceRemaining = balanceRemaining; }

    public String getAuthorizedSignatory() { return authorizedSignatory; }
    public void setAuthorizedSignatory(String authorizedSignatory) { this.authorizedSignatory = authorizedSignatory; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
