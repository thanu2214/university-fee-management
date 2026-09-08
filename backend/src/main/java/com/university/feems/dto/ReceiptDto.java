package com.university.feems.dto;

import com.university.feems.entity.PaymentMethod;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReceiptDto {
    private Long id;
    private Long paymentId;
    private String receiptNumber;
    private LocalDateTime issueDate;
    private String studentName;
    private String rollNumber;
    private String registrationNo;
    private String program;
    private Integer semester;
    private String academicYear;
    private BigDecimal amountPaid;
    private PaymentMethod paymentMethod;
    private String transactionReference;
    private BigDecimal balanceRemaining;
    private String authorizedSignatory;
    private String universityName = "Apex Global University";
    private String universityAddress = "Knowledge City Campus, Tech Boulevard, Sector 62";
    private String universityContact = "finance@apexuniv.edu.in | +91 1800 200 4567";

    public ReceiptDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

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

    public String getUniversityName() { return universityName; }
    public void setUniversityName(String universityName) { this.universityName = universityName; }

    public String getUniversityAddress() { return universityAddress; }
    public void setUniversityAddress(String universityAddress) { this.universityAddress = universityAddress; }

    public String getUniversityContact() { return universityContact; }
    public void setUniversityContact(String universityContact) { this.universityContact = universityContact; }
}
