package com.university.feems.dto;

import com.university.feems.entity.PaymentMethod;
import com.university.feems.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
    private Long id;
    private Long studentFeeRecordId;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String program;
    private Integer semester;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private PaymentMethod paymentMethod;
    private String transactionReference;
    private PaymentStatus paymentStatus;
    private String paymentNotes;
    private String processedBy;

    // Remaining balances after payment
    private BigDecimal updatedPaidAmount;
    private BigDecimal remainingDueAmount;
    private String updatedFeeStatus;

    // Linked Receipt information
    private Long receiptId;
    private String receiptNumber;

    public PaymentResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentFeeRecordId() { return studentFeeRecordId; }
    public void setStudentFeeRecordId(Long studentFeeRecordId) { this.studentFeeRecordId = studentFeeRecordId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentNotes() { return paymentNotes; }
    public void setPaymentNotes(String paymentNotes) { this.paymentNotes = paymentNotes; }

    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }

    public BigDecimal getUpdatedPaidAmount() { return updatedPaidAmount; }
    public void setUpdatedPaidAmount(BigDecimal updatedPaidAmount) { this.updatedPaidAmount = updatedPaidAmount; }

    public BigDecimal getRemainingDueAmount() { return remainingDueAmount; }
    public void setRemainingDueAmount(BigDecimal remainingDueAmount) { this.remainingDueAmount = remainingDueAmount; }

    public String getUpdatedFeeStatus() { return updatedFeeStatus; }
    public void setUpdatedFeeStatus(String updatedFeeStatus) { this.updatedFeeStatus = updatedFeeStatus; }

    public Long getReceiptId() { return receiptId; }
    public void setReceiptId(Long receiptId) { this.receiptId = receiptId; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
}
