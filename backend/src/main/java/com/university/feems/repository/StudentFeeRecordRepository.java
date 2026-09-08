package com.university.feems.repository;

import com.university.feems.entity.FeeStatus;
import com.university.feems.entity.StudentFeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentFeeRecordRepository extends JpaRepository<StudentFeeRecord, Long> {
    List<StudentFeeRecord> findByStudentId(Long studentId);
    List<StudentFeeRecord> findByStudentIdOrderBySemesterAsc(Long studentId);
    Optional<StudentFeeRecord> findByStudentIdAndAcademicYearAndSemester(Long studentId, String academicYear, Integer semester);
    List<StudentFeeRecord> findByFeeStatus(FeeStatus feeStatus);
    List<StudentFeeRecord> findByAcademicYear(String academicYear);

    @Query("SELECT r FROM StudentFeeRecord r WHERE " +
           "LOWER(r.student.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.student.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.student.program) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<StudentFeeRecord> searchRecords(@Param("query") String query);

    @Query("SELECT SUM(r.totalFeeAmount) FROM StudentFeeRecord r")
    BigDecimal sumTotalFees();

    @Query("SELECT SUM(r.paidAmount) FROM StudentFeeRecord r")
    BigDecimal sumPaidFees();

    @Query("SELECT SUM(r.dueAmount) FROM StudentFeeRecord r")
    BigDecimal sumDueFees();

    @Query("SELECT COUNT(r) FROM StudentFeeRecord r WHERE r.feeStatus = :status")
    Long countByFeeStatus(@Param("status") FeeStatus status);

    @Query("SELECT r FROM StudentFeeRecord r WHERE r.dueAmount > 0 ORDER BY r.dueDate ASC")
    List<StudentFeeRecord> findDefaulters();
}
