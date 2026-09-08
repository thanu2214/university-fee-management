package com.university.feems.service.impl;

import com.university.feems.dto.DashboardStatsDto;
import com.university.feems.dto.FeeRecordDto;
import com.university.feems.dto.PaymentResponse;
import com.university.feems.entity.FeeStatus;
import com.university.feems.entity.Role;
import com.university.feems.repository.*;
import com.university.feems.service.DashboardService;
import com.university.feems.service.FeeService;
import com.university.feems.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentFeeRecordRepository feeRecordRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private FeeService feeService;

    @Autowired
    private PaymentService paymentService;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getAdminDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalStudents(studentRepository.count());
        stats.setTotalStaff((long) userRepository.findByRole(Role.ROLE_FINANCE_STAFF).size());

        BigDecimal totalBilled = feeRecordRepository.sumTotalFees();
        BigDecimal totalCollected = feeRecordRepository.sumPaidFees();
        BigDecimal totalDue = feeRecordRepository.sumDueFees();

        stats.setTotalFeeBilled(totalBilled != null ? totalBilled : BigDecimal.ZERO);
        stats.setTotalFeeCollected(totalCollected != null ? totalCollected : BigDecimal.ZERO);
        stats.setTotalFeePending(totalDue != null ? totalDue : BigDecimal.ZERO);

        if (totalBilled != null && totalBilled.compareTo(BigDecimal.ZERO) > 0 && totalCollected != null) {
            double rate = totalCollected.divide(totalBilled, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
            stats.setCollectionRatePercentage(Math.round(rate * 10.0) / 10.0);
        } else {
            stats.setCollectionRatePercentage(0.0);
        }

        stats.setFullyPaidCount(feeRecordRepository.countByFeeStatus(FeeStatus.PAID));
        stats.setPartiallyPaidCount(feeRecordRepository.countByFeeStatus(FeeStatus.PARTIALLY_PAID));
        stats.setPendingCount(feeRecordRepository.countByFeeStatus(FeeStatus.PENDING));
        stats.setOverdueCount(feeRecordRepository.countByFeeStatus(FeeStatus.OVERDUE));

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        BigDecimal todayColl = paymentRepository.sumCollectionsSince(startOfToday);
        stats.setTodayCollections(todayColl != null ? todayColl : BigDecimal.ZERO);

        // Recent 5 payments
        List<PaymentResponse> allPayments = paymentService.getAllPayments();
        stats.setRecentPayments(allPayments.stream().limit(6).collect(Collectors.toList()));

        // Program wise aggregates
        stats.setProgramWiseStats(computeProgramWiseStats());

        // Overdue list
        stats.setOverdueRecords(feeService.getDefaulters().stream().limit(5).collect(Collectors.toList()));

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getFinanceDashboardStats() {
        return getAdminDashboardStats();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getStudentDashboardStats(Long studentId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<FeeRecordDto> records = feeService.getFeeRecordsByStudentId(studentId);
        BigDecimal totalBilled = BigDecimal.ZERO;
        BigDecimal totalPaid = BigDecimal.ZERO;
        BigDecimal totalDue = BigDecimal.ZERO;

        long paidCount = 0;
        long partialCount = 0;
        long pendingCount = 0;
        long overdueCount = 0;

        for (FeeRecordDto r : records) {
            totalBilled = totalBilled.add(r.getTotalFeeAmount());
            totalPaid = totalPaid.add(r.getPaidAmount());
            totalDue = totalDue.add(r.getDueAmount());

            if (r.getFeeStatus() == FeeStatus.PAID) paidCount++;
            else if (r.getFeeStatus() == FeeStatus.PARTIALLY_PAID) partialCount++;
            else if (r.getFeeStatus() == FeeStatus.OVERDUE) overdueCount++;
            else pendingCount++;
        }

        stats.setTotalFeeBilled(totalBilled);
        stats.setTotalFeeCollected(totalPaid);
        stats.setTotalFeePending(totalDue);

        if (totalBilled.compareTo(BigDecimal.ZERO) > 0) {
            double rate = totalPaid.divide(totalBilled, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
            stats.setCollectionRatePercentage(Math.round(rate * 10.0) / 10.0);
        }

        stats.setFullyPaidCount(paidCount);
        stats.setPartiallyPaidCount(partialCount);
        stats.setPendingCount(pendingCount);
        stats.setOverdueCount(overdueCount);

        stats.setRecentPayments(paymentService.getPaymentsByStudentId(studentId).stream().limit(5).collect(Collectors.toList()));

        return stats;
    }

    private List<Map<String, Object>> computeProgramWiseStats() {
        List<FeeRecordDto> all = feeService.getAllFeeRecords();
        Map<String, List<FeeRecordDto>> grouped = all.stream()
                .collect(Collectors.groupingBy(FeeRecordDto::getProgram));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<FeeRecordDto>> entry : grouped.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("program", entry.getKey());
            BigDecimal billed = entry.getValue().stream().map(FeeRecordDto::getTotalFeeAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal collected = entry.getValue().stream().map(FeeRecordDto::getPaidAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal due = entry.getValue().stream().map(FeeRecordDto::getDueAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            map.put("totalBilled", billed);
            map.put("totalCollected", collected);
            map.put("totalDue", due);
            map.put("studentsCount", entry.getValue().size());
            result.add(map);
        }
        return result;
    }
}
