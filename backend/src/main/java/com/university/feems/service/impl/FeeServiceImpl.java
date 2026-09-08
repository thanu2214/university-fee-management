package com.university.feems.service.impl;

import com.university.feems.dto.FeeRecordDto;
import com.university.feems.dto.FeeStructureDto;
import com.university.feems.entity.FeeStatus;
import com.university.feems.entity.FeeStructure;
import com.university.feems.entity.Student;
import com.university.feems.entity.StudentFeeRecord;
import com.university.feems.exception.BadRequestException;
import com.university.feems.exception.ResourceNotFoundException;
import com.university.feems.repository.FeeStructureRepository;
import com.university.feems.repository.StudentFeeRecordRepository;
import com.university.feems.repository.StudentRepository;
import com.university.feems.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeeServiceImpl implements FeeService {

    @Autowired
    private FeeStructureRepository feeStructureRepository;

    @Autowired
    private StudentFeeRecordRepository feeRecordRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    @Transactional
    public FeeStructureDto createFeeStructure(FeeStructureDto dto) {
        Optional<FeeStructure> existing = feeStructureRepository
                .findByProgramAndAcademicYearAndSemester(dto.getProgram(), dto.getAcademicYear(), dto.getSemester());

        if (existing.isPresent()) {
            throw new BadRequestException("Fee structure already exists for " + dto.getProgram() +
                    " (" + dto.getAcademicYear() + " - Semester " + dto.getSemester() + ")");
        }

        FeeStructure structure = new FeeStructure(
                dto.getProgram(),
                dto.getAcademicYear(),
                dto.getSemester(),
                dto.getTuitionFee(),
                dto.getExamFee(),
                dto.getLibraryFee(),
                dto.getLabFee(),
                dto.getHostelFee(),
                dto.getSportsFee(),
                dto.getDueDate()
        );

        FeeStructure saved = feeStructureRepository.save(structure);
        return mapStructureToDto(saved);
    }

    @Override
    @Transactional
    public FeeStructureDto updateFeeStructure(Long id, FeeStructureDto dto) {
        FeeStructure structure = feeStructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee Structure not found with ID: " + id));

        structure.setProgram(dto.getProgram());
        structure.setAcademicYear(dto.getAcademicYear());
        structure.setSemester(dto.getSemester());
        structure.setTuitionFee(dto.getTuitionFee());
        structure.setExamFee(dto.getExamFee());
        structure.setLibraryFee(dto.getLibraryFee());
        structure.setLabFee(dto.getLabFee());
        structure.setHostelFee(dto.getHostelFee());
        structure.setSportsFee(dto.getSportsFee());
        structure.setDueDate(dto.getDueDate());
        structure.recalculateTotal();

        FeeStructure updated = feeStructureRepository.save(structure);
        return mapStructureToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public FeeStructureDto getFeeStructureById(Long id) {
        FeeStructure structure = feeStructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee Structure not found with ID: " + id));
        return mapStructureToDto(structure);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeStructureDto> getAllFeeStructures() {
        return feeStructureRepository.findAllByOrderByAcademicYearDescSemesterAsc().stream()
                .map(this::mapStructureToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteFeeStructure(Long id) {
        FeeStructure structure = feeStructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee Structure not found with ID: " + id));
        feeStructureRepository.delete(structure);
    }

    @Override
    @Transactional
    public FeeRecordDto createStudentFeeRecord(Long studentId, Long feeStructureId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        FeeStructure structure = feeStructureRepository.findById(feeStructureId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee Structure not found with ID: " + feeStructureId));

        Optional<StudentFeeRecord> existing = feeRecordRepository
                .findByStudentIdAndAcademicYearAndSemester(studentId, structure.getAcademicYear(), structure.getSemester());

        if (existing.isPresent()) {
            throw new BadRequestException("Fee record already assigned to student for " + structure.getAcademicYear() + " Semester " + structure.getSemester());
        }

        StudentFeeRecord record = new StudentFeeRecord(
                student,
                structure,
                structure.getAcademicYear(),
                structure.getSemester(),
                structure.getTotalFee(),
                structure.getDueDate()
        );
        record.recalculateStatus();

        StudentFeeRecord saved = feeRecordRepository.save(record);
        return mapRecordToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FeeRecordDto getFeeRecordById(Long id) {
        StudentFeeRecord record = feeRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee Record not found with ID: " + id));
        return mapRecordToDto(record);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeRecordDto> getFeeRecordsByStudentId(Long studentId) {
        return feeRecordRepository.findByStudentIdOrderBySemesterAsc(studentId).stream()
                .map(this::mapRecordToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeRecordDto> getAllFeeRecords() {
        return feeRecordRepository.findAll().stream()
                .map(this::mapRecordToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeRecordDto> getFeeRecordsByStatus(FeeStatus status) {
        return feeRecordRepository.findByFeeStatus(status).stream()
                .map(this::mapRecordToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeRecordDto> searchFeeRecords(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllFeeRecords();
        }
        return feeRecordRepository.searchRecords(query.trim()).stream()
                .map(this::mapRecordToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeRecordDto> getDefaulters() {
        return feeRecordRepository.findDefaulters().stream()
                .map(this::mapRecordToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FeeRecordDto applyConcession(Long recordId, BigDecimal concessionAmount, String reason) {
        StudentFeeRecord record = feeRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee Record not found with ID: " + recordId));

        if (concessionAmount == null || concessionAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Invalid concession amount");
        }

        if (concessionAmount.compareTo(record.getTotalFeeAmount()) > 0) {
            throw new BadRequestException("Concession cannot exceed total fee amount");
        }

        record.setConcessionAmount(concessionAmount);
        record.recalculateStatus();
        StudentFeeRecord updated = feeRecordRepository.save(record);
        return mapRecordToDto(updated);
    }

    private FeeStructureDto mapStructureToDto(FeeStructure structure) {
        FeeStructureDto dto = new FeeStructureDto();
        dto.setId(structure.getId());
        dto.setProgram(structure.getProgram());
        dto.setAcademicYear(structure.getAcademicYear());
        dto.setSemester(structure.getSemester());
        dto.setTuitionFee(structure.getTuitionFee());
        dto.setExamFee(structure.getExamFee());
        dto.setLibraryFee(structure.getLibraryFee());
        dto.setLabFee(structure.getLabFee());
        dto.setHostelFee(structure.getHostelFee());
        dto.setSportsFee(structure.getSportsFee());
        dto.setTotalFee(structure.getTotalFee());
        dto.setDueDate(structure.getDueDate());
        dto.setCreatedAt(structure.getCreatedAt());
        return dto;
    }

    private FeeRecordDto mapRecordToDto(StudentFeeRecord record) {
        FeeRecordDto dto = new FeeRecordDto();
        dto.setId(record.getId());
        dto.setStudentId(record.getStudent().getId());
        dto.setStudentName(record.getStudent().getUser().getFullName());
        dto.setRollNumber(record.getStudent().getRollNumber());
        dto.setRegistrationNo(record.getStudent().getRegistrationNo());
        dto.setProgram(record.getStudent().getProgram());
        dto.setDepartment(record.getStudent().getDepartment());
        dto.setFeeStructureId(record.getFeeStructure() != null ? record.getFeeStructure().getId() : null);
        dto.setAcademicYear(record.getAcademicYear());
        dto.setSemester(record.getSemester());

        if (record.getFeeStructure() != null) {
            dto.setTuitionFee(record.getFeeStructure().getTuitionFee());
            dto.setExamFee(record.getFeeStructure().getExamFee());
            dto.setLibraryFee(record.getFeeStructure().getLibraryFee());
            dto.setLabFee(record.getFeeStructure().getLabFee());
            dto.setHostelFee(record.getFeeStructure().getHostelFee());
            dto.setSportsFee(record.getFeeStructure().getSportsFee());
        }

        dto.setTotalFeeAmount(record.getTotalFeeAmount());
        dto.setConcessionAmount(record.getConcessionAmount());
        BigDecimal netPayable = record.getTotalFeeAmount().subtract(
                record.getConcessionAmount() != null ? record.getConcessionAmount() : BigDecimal.ZERO);
        dto.setNetPayableAmount(netPayable.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : netPayable);
        dto.setPaidAmount(record.getPaidAmount());
        dto.setDueAmount(record.getDueAmount());
        dto.setFeeStatus(record.getFeeStatus());
        dto.setDueDate(record.getDueDate());
        dto.setLastPaymentDate(record.getLastPaymentDate());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }
}
