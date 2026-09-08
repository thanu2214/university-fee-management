package com.university.feems.service.impl;

import com.university.feems.dto.ReceiptDto;
import com.university.feems.entity.Receipt;
import com.university.feems.exception.ResourceNotFoundException;
import com.university.feems.repository.ReceiptRepository;
import com.university.feems.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceiptServiceImpl implements ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Override
    @Transactional(readOnly = true)
    public ReceiptDto getReceiptById(Long id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with ID: " + id));
        return mapToDto(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public ReceiptDto getReceiptByPaymentId(Long paymentId) {
        Receipt receipt = receiptRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found for Payment ID: " + paymentId));
        return mapToDto(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public ReceiptDto getReceiptByReceiptNumber(String receiptNumber) {
        Receipt receipt = receiptRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with Receipt Number: " + receiptNumber));
        return mapToDto(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceiptDto> getReceiptsByRollNumber(String rollNumber) {
        return receiptRepository.findByRollNumberOrderByIssueDateDesc(rollNumber).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceiptDto> getAllReceipts() {
        return receiptRepository.findAllByOrderByIssueDateDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceiptDto> searchReceipts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllReceipts();
        }
        return receiptRepository.searchReceipts(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReceiptDto mapToDto(Receipt receipt) {
        ReceiptDto dto = new ReceiptDto();
        dto.setId(receipt.getId());
        dto.setPaymentId(receipt.getPayment().getId());
        dto.setReceiptNumber(receipt.getReceiptNumber());
        dto.setIssueDate(receipt.getIssueDate());
        dto.setStudentName(receipt.getStudentName());
        dto.setRollNumber(receipt.getRollNumber());
        dto.setRegistrationNo(receipt.getRegistrationNo());
        dto.setProgram(receipt.getProgram());
        dto.setSemester(receipt.getSemester());
        dto.setAcademicYear(receipt.getAcademicYear());
        dto.setAmountPaid(receipt.getAmountPaid());
        dto.setPaymentMethod(receipt.getPaymentMethod());
        dto.setTransactionReference(receipt.getTransactionReference());
        dto.setBalanceRemaining(receipt.getBalanceRemaining());
        dto.setAuthorizedSignatory(receipt.getAuthorizedSignatory());
        return dto;
    }
}
