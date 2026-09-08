package com.university.feems.controller;

import com.university.feems.dto.ApiResponse;
import com.university.feems.dto.PaymentRequest;
import com.university.feems.dto.PaymentResponse;
import com.university.feems.entity.PaymentStatus;
import com.university.feems.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process-demo")
    public ResponseEntity<ApiResponse<PaymentResponse>> processDemoPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processDemoPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Fee payment processed successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentById(id)));
    }

    @GetMapping("/ref/{txRef}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByTxRef(@PathVariable String txRef) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentByTransactionReference(txRef)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentsByStudentId(studentId)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PaymentStatus status) {
        List<PaymentResponse> payments;
        if (status != null) {
            payments = paymentService.getPaymentsByStatus(status);
        } else if (search != null && !search.trim().isEmpty()) {
            payments = paymentService.searchPayments(search);
        } else {
            payments = paymentService.getAllPayments();
        }
        return ResponseEntity.ok(ApiResponse.success(payments));
    }
}
