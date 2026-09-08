package com.university.feems.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    // High level metrics
    private Long totalStudents = 0L;
    private Long totalStaff = 0L;
    private BigDecimal totalFeeBilled = BigDecimal.ZERO;
    private BigDecimal totalFeeCollected = BigDecimal.ZERO;
    private BigDecimal totalFeePending = BigDecimal.ZERO;
    private Double collectionRatePercentage = 0.0;

    // Status counts
    private Long fullyPaidCount = 0L;
    private Long partiallyPaidCount = 0L;
    private Long pendingCount = 0L;
    private Long overdueCount = 0L;

    // Daily & Monthly collections
    private BigDecimal todayCollections = BigDecimal.ZERO;
    private Long todayTransactionsCount = 0L;

    // Program breakdown
    private List<Map<String, Object>> programWiseStats;

    // Recent payments for ledger preview
    private List<PaymentResponse> recentPayments;

    // High priority defaulters list
    private List<FeeRecordDto> overdueRecords;

    public DashboardStatsDto() {}

    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getTotalStaff() { return totalStaff; }
    public void setTotalStaff(Long totalStaff) { this.totalStaff = totalStaff; }

    public BigDecimal getTotalFeeBilled() { return totalFeeBilled; }
    public void setTotalFeeBilled(BigDecimal totalFeeBilled) { this.totalFeeBilled = totalFeeBilled; }

    public BigDecimal getTotalFeeCollected() { return totalFeeCollected; }
    public void setTotalFeeCollected(BigDecimal totalFeeCollected) { this.totalFeeCollected = totalFeeCollected; }

    public BigDecimal getTotalFeePending() { return totalFeePending; }
    public void setTotalFeePending(BigDecimal totalFeePending) { this.totalFeePending = totalFeePending; }

    public Double getCollectionRatePercentage() { return collectionRatePercentage; }
    public void setCollectionRatePercentage(Double collectionRatePercentage) { this.collectionRatePercentage = collectionRatePercentage; }

    public Long getFullyPaidCount() { return fullyPaidCount; }
    public void setFullyPaidCount(Long fullyPaidCount) { this.fullyPaidCount = fullyPaidCount; }

    public Long getPartiallyPaidCount() { return partiallyPaidCount; }
    public void setPartiallyPaidCount(Long partiallyPaidCount) { this.partiallyPaidCount = partiallyPaidCount; }

    public Long getPendingCount() { return pendingCount; }
    public void setPendingCount(Long pendingCount) { this.pendingCount = pendingCount; }

    public Long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(Long overdueCount) { this.overdueCount = overdueCount; }

    public BigDecimal getTodayCollections() { return todayCollections; }
    public void setTodayCollections(BigDecimal todayCollections) { this.todayCollections = todayCollections; }

    public Long getTodayTransactionsCount() { return todayTransactionsCount; }
    public void setTodayTransactionsCount(Long todayTransactionsCount) { this.todayTransactionsCount = todayTransactionsCount; }

    public List<Map<String, Object>> getProgramWiseStats() { return programWiseStats; }
    public void setProgramWiseStats(List<Map<String, Object>> programWiseStats) { this.programWiseStats = programWiseStats; }

    public List<PaymentResponse> getRecentPayments() { return recentPayments; }
    public void setRecentPayments(List<PaymentResponse> recentPayments) { this.recentPayments = recentPayments; }

    public List<FeeRecordDto> getOverdueRecords() { return overdueRecords; }
    public void setOverdueRecords(List<FeeRecordDto> overdueRecords) { this.overdueRecords = overdueRecords; }
}
