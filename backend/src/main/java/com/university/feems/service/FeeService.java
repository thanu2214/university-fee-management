package com.university.feems.service;

import com.university.feems.dto.FeeRecordDto;
import com.university.feems.dto.FeeStructureDto;
import com.university.feems.entity.FeeStatus;

import java.math.BigDecimal;
import java.util.List;

public interface FeeService {
    // Fee Structures
    FeeStructureDto createFeeStructure(FeeStructureDto dto);
    FeeStructureDto updateFeeStructure(Long id, FeeStructureDto dto);
    FeeStructureDto getFeeStructureById(Long id);
    List<FeeStructureDto> getAllFeeStructures();
    void deleteFeeStructure(Long id);

    // Student Fee Records
    FeeRecordDto createStudentFeeRecord(Long studentId, Long feeStructureId);
    FeeRecordDto getFeeRecordById(Long id);
    List<FeeRecordDto> getFeeRecordsByStudentId(Long studentId);
    List<FeeRecordDto> getAllFeeRecords();
    List<FeeRecordDto> getFeeRecordsByStatus(FeeStatus status);
    List<FeeRecordDto> searchFeeRecords(String query);
    List<FeeRecordDto> getDefaulters();

    FeeRecordDto applyConcession(Long recordId, BigDecimal concessionAmount, String reason);
}
