package com.university.feems.repository;

import com.university.feems.entity.Payment;
import com.university.feems.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentIdOrderByPaymentDateDesc(Long studentId);
    List<Payment> findByStudentFeeRecordIdOrderByPaymentDateDesc(Long feeRecordId);
    List<Payment> findByPaymentStatusOrderByPaymentDateDesc(PaymentStatus status);
    Optional<Payment> findByTransactionReference(String transactionReference);
    List<Payment> findAllByOrderByPaymentDateDesc();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    BigDecimal sumTotalSuccessfulCollections();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'SUCCESS' AND p.paymentDate >= :since")
    BigDecimal sumCollectionsSince(@Param("since") LocalDateTime since);

    @Query("SELECT p FROM Payment p WHERE " +
           "LOWER(p.transactionReference) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.student.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.student.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY p.paymentDate DESC")
    List<Payment> searchPayments(@Param("query") String query);
}
