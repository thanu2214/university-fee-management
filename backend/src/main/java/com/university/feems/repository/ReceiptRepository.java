package com.university.feems.repository;

import com.university.feems.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    Optional<Receipt> findByPaymentId(Long paymentId);
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    List<Receipt> findByRollNumberOrderByIssueDateDesc(String rollNumber);
    List<Receipt> findAllByOrderByIssueDateDesc();

    @Query("SELECT r FROM Receipt r WHERE " +
           "LOWER(r.receiptNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.studentName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.transactionReference) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY r.issueDate DESC")
    List<Receipt> searchReceipts(@Param("keyword") String keyword);
}
