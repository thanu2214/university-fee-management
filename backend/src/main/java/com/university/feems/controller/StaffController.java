package com.university.feems.controller;

import com.university.feems.dto.ApiResponse;
import com.university.feems.dto.FeeRecordDto;
import com.university.feems.dto.PaymentRequest;
import com.university.feems.dto.PaymentResponse;
import com.university.feems.service.FeeService;
import com.university.feems.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
@PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF')")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private FeeService feeService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/defaulters")
    public ResponseEntity<ApiResponse<List<FeeRecordDto>>> getDefaulters() {
        return ResponseEntity.ok(ApiResponse.success(feeService.getDefaulters()));
    }

    @PostMapping("/concession")
    public ResponseEntity<ApiResponse<FeeRecordDto>> applyConcession(
            @RequestParam Long recordId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String reason) {
        FeeRecordDto updated = feeService.applyConcession(recordId, amount, reason);
        return ResponseEntity.ok(ApiResponse.success("Fee concession applied successfully", updated));
    }

    @PostMapping("/record-offline-payment")
    public ResponseEntity<ApiResponse<PaymentResponse>> recordOfflinePayment(
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {
        String staffUsername = authentication != null ? authentication.getName() : "Finance Staff";
        PaymentResponse response = paymentService.recordOfflinePayment(request, staffUsername);
        return ResponseEntity.ok(ApiResponse.success("Offline payment recorded and verified successfully", response));
    }
}
