package com.university.feems.service;

import com.university.feems.dto.PaymentRequest;
import com.university.feems.dto.PaymentResponse;
import com.university.feems.entity.PaymentStatus;

import java.util.List;

public interface PaymentService {
    PaymentResponse processDemoPayment(PaymentRequest request);
    PaymentResponse recordOfflinePayment(PaymentRequest request, String staffUsername);
    PaymentResponse getPaymentById(Long id);
    PaymentResponse getPaymentByTransactionReference(String txRef);
    List<PaymentResponse> getPaymentsByStudentId(Long studentId);
    List<PaymentResponse> getAllPayments();
    List<PaymentResponse> getPaymentsByStatus(PaymentStatus status);
    List<PaymentResponse> searchPayments(String query);
}
