package com.university.feems.service.impl;

import com.university.feems.dto.PaymentRequest;
import com.university.feems.dto.PaymentResponse;
import com.university.feems.entity.*;
import com.university.feems.exception.PaymentValidationException;
import com.university.feems.exception.ResourceNotFoundException;
import com.university.feems.repository.PaymentRepository;
import com.university.feems.repository.ReceiptRepository;
import com.university.feems.repository.StudentFeeRecordRepository;
import com.university.feems.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StudentFeeRecordRepository feeRecordRepository;

    @Autowired
    private ReceiptRepository receiptRepository;

    @Override
    @Transactional
    public PaymentResponse processDemoPayment(PaymentRequest request) {
        return executePayment(request, "STUDENT_ONLINE_PORTAL");
    }

    @Override
    @Transactional
    public PaymentResponse recordOfflinePayment(PaymentRequest request, String staffUsername) {
        String processedBy = "FINANCE_STAFF: " + (staffUsername != null ? staffUsername : "Authorized Counter");
        return executePayment(request, processedBy);
    }

    private PaymentResponse executePayment(PaymentRequest request, String processedBy) {
        StudentFeeRecord record = feeRecordRepository.findById(request.getStudentFeeRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee Record not found with ID: " + request.getStudentFeeRecordId()));

        BigDecimal amount = request.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentValidationException("Payment amount must be greater than zero");
        }

        if (amount.compareTo(record.getDueAmount()) > 0) {
            throw new PaymentValidationException("Payment amount (₹" + amount + ") cannot exceed outstanding due amount (₹" + record.getDueAmount() + ")");
        }

        // Generate realistic transaction reference
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String txRef = "TXN-" + timestamp + "-" + randomSuffix;

        Payment payment = new Payment(
                record,
                record.getStudent(),
                amount,
                request.getPaymentMethod(),
                txRef,
                PaymentStatus.SUCCESS,
                request.getPaymentNotes(),
                processedBy
        );

        Payment savedPayment = paymentRepository.save(payment);

        // Update fee record
        record.setPaidAmount(record.getPaidAmount().add(amount));
        record.setLastPaymentDate(LocalDateTime.now());
        record.recalculateStatus();
        StudentFeeRecord updatedRecord = feeRecordRepository.save(record);

        // Auto-generate official university receipt
        String receiptNumber = "UFM-" + LocalDateTime.now().getYear() + "-REC-" + (10000 + savedPayment.getId());
        Receipt receipt = new Receipt(
                savedPayment,
                receiptNumber,
                record.getStudent().getUser().getFullName(),
                record.getStudent().getRollNumber(),
                record.getStudent().getRegistrationNo(),
                record.getStudent().getProgram(),
                record.getSemester(),
                record.getAcademicYear(),
                amount,
                request.getPaymentMethod(),
                txRef,
                updatedRecord.getDueAmount(),
                "Controller of Finance, Apex University"
        );
        Receipt savedReceipt = receiptRepository.save(receipt);

        return mapToPaymentResponse(savedPayment, updatedRecord, savedReceipt);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + id));
        return mapToPaymentResponse(payment, payment.getStudentFeeRecord(), receiptRepository.findByPaymentId(payment.getId()).orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByTransactionReference(String txRef) {
        Payment payment = paymentRepository.findByTransactionReference(txRef)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with Transaction Reference: " + txRef));
        return mapToPaymentResponse(payment, payment.getStudentFeeRecord(), receiptRepository.findByPaymentId(payment.getId()).orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStudentId(Long studentId) {
        return paymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId).stream()
                .map(p -> mapToPaymentResponse(p, p.getStudentFeeRecord(), receiptRepository.findByPaymentId(p.getId()).orElse(null)))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc().stream()
                .map(p -> mapToPaymentResponse(p, p.getStudentFeeRecord(), receiptRepository.findByPaymentId(p.getId()).orElse(null)))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByPaymentStatusOrderByPaymentDateDesc(status).stream()
                .map(p -> mapToPaymentResponse(p, p.getStudentFeeRecord(), receiptRepository.findByPaymentId(p.getId()).orElse(null)))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> searchPayments(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllPayments();
        }
        return paymentRepository.searchPayments(query.trim()).stream()
                .map(p -> mapToPaymentResponse(p, p.getStudentFeeRecord(), receiptRepository.findByPaymentId(p.getId()).orElse(null)))
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToPaymentResponse(Payment payment, StudentFeeRecord record, Receipt receipt) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setStudentFeeRecordId(record.getId());
        response.setStudentId(record.getStudent().getId());
        response.setStudentName(record.getStudent().getUser().getFullName());
        response.setRollNumber(record.getStudent().getRollNumber());
        response.setProgram(record.getStudent().getProgram());
        response.setSemester(record.getSemester());
        response.setAmount(payment.getAmount());
        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setTransactionReference(payment.getTransactionReference());
        response.setPaymentStatus(payment.getPaymentStatus());
        response.setPaymentNotes(payment.getPaymentNotes());
        response.setProcessedBy(payment.getProcessedBy());

        response.setUpdatedPaidAmount(record.getPaidAmount());
        response.setRemainingDueAmount(record.getDueAmount());
        response.setUpdatedFeeStatus(record.getFeeStatus().name());

        if (receipt != null) {
            response.setReceiptId(receipt.getId());
            response.setReceiptNumber(receipt.getReceiptNumber());
        }
        return response;
    }
}
