package com.university.feems.controller;

import com.university.feems.dto.ApiResponse;
import com.university.feems.dto.ReceiptDto;
import com.university.feems.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "*")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReceiptDto>> getReceiptById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(receiptService.getReceiptById(id)));
    }

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<ApiResponse<ReceiptDto>> getReceiptByPaymentId(@PathVariable Long paymentId) {
        return ResponseEntity.ok(ApiResponse.success(receiptService.getReceiptByPaymentId(paymentId)));
    }

    @GetMapping("/number/{receiptNumber}")
    public ResponseEntity<ApiResponse<ReceiptDto>> getReceiptByNumber(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(ApiResponse.success(receiptService.getReceiptByReceiptNumber(receiptNumber)));
    }

    @GetMapping("/student/{rollNumber}")
    public ResponseEntity<ApiResponse<List<ReceiptDto>>> getReceiptsByRollNumber(@PathVariable String rollNumber) {
        return ResponseEntity.ok(ApiResponse.success(receiptService.getReceiptsByRollNumber(rollNumber)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_STAFF')")
    public ResponseEntity<ApiResponse<List<ReceiptDto>>> getAllReceipts(@RequestParam(required = false) String search) {
        List<ReceiptDto> receipts = (search != null && !search.trim().isEmpty())
                ? receiptService.searchReceipts(search)
                : receiptService.getAllReceipts();
        return ResponseEntity.ok(ApiResponse.success(receipts));
    }
}
