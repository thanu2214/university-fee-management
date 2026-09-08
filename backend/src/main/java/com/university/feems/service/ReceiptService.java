package com.university.feems.service;

import com.university.feems.dto.ReceiptDto;

import java.util.List;

public interface ReceiptService {
    ReceiptDto getReceiptById(Long id);
    ReceiptDto getReceiptByPaymentId(Long paymentId);
    ReceiptDto getReceiptByReceiptNumber(String receiptNumber);
    List<ReceiptDto> getReceiptsByRollNumber(String rollNumber);
    List<ReceiptDto> getAllReceipts();
    List<ReceiptDto> searchReceipts(String query);
}
