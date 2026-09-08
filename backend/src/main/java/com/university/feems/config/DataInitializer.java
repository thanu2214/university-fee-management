package com.university.feems.config;

import com.university.feems.entity.*;
import com.university.feems.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FeeStructureRepository feeStructureRepository;

    @Autowired
    private StudentFeeRecordRepository feeRecordRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with university records.");
            return;
        }

        logger.info("Seeding initial enterprise university data...");

        // 1. Create Administrator
        User adminUser = new User(
                "admin",
                passwordEncoder.encode("password123"),
                "admin@apexuniv.edu.in",
                "Dr. Robert Vance",
                Role.ROLE_ADMIN,
                "+91 9876543210"
        );
        userRepository.save(adminUser);

        // 2. Create Finance Staff
        User finance1 = new User(
                "finance1",
                passwordEncoder.encode("password123"),
                "s.jenkins@apexuniv.edu.in",
                "Sarah Jenkins",
                Role.ROLE_FINANCE_STAFF,
                "+91 9876543211"
        );
        User finance2 = new User(
                "finance2",
                passwordEncoder.encode("password123"),
                "d.miller@apexuniv.edu.in",
                "David Miller",
                Role.ROLE_FINANCE_STAFF,
                "+91 9876543212"
        );
        userRepository.save(finance1);
        userRepository.save(finance2);

        // 3. Create Fee Structures
        LocalDate dueDateNear = LocalDate.now().plusDays(25);
        LocalDate dueDatePast = LocalDate.now().minusDays(15);
        LocalDate dueDateFar = LocalDate.now().plusMonths(2);

        FeeStructure fsBTechCseSem3 = new FeeStructure(
                "B.Tech Computer Science & Engineering",
                "2025-2026",
                3,
                new BigDecimal("50000.00"),
                new BigDecimal("5000.00"),
                new BigDecimal("3000.00"),
                new BigDecimal("10000.00"),
                new BigDecimal("5000.00"),
                new BigDecimal("2000.00"),
                dueDateNear
        );
        feeStructureRepository.save(fsBTechCseSem3);

        FeeStructure fsBTechEceSem2 = new FeeStructure(
                "B.Tech Electronics & Communication",
                "2025-2026",
                2,
                new BigDecimal("45000.00"),
                new BigDecimal("5000.00"),
                new BigDecimal("3000.00"),
                new BigDecimal("10000.00"),
                new BigDecimal("5000.00"),
                new BigDecimal("2000.00"),
                dueDatePast
        );
        feeStructureRepository.save(fsBTechEceSem2);

        FeeStructure fsMbaSem1 = new FeeStructure(
                "MBA Finance & Marketing",
                "2025-2026",
                1,
                new BigDecimal("65000.00"),
                new BigDecimal("6000.00"),
                new BigDecimal("5000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00"),
                dueDateNear
        );
        feeStructureRepository.save(fsMbaSem1);

        FeeStructure fsMbbsSem2 = new FeeStructure(
                "MBBS Medicine & Surgery",
                "2025-2026",
                2,
                new BigDecimal("95000.00"),
                new BigDecimal("10000.00"),
                new BigDecimal("5000.00"),
                new BigDecimal("20000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("2000.00"),
                dueDatePast
        );
        feeStructureRepository.save(fsMbbsSem2);

        FeeStructure fsDscSem1 = new FeeStructure(
                "B.Sc Data Science & AI",
                "2025-2026",
                1,
                new BigDecimal("35000.00"),
                new BigDecimal("4000.00"),
                new BigDecimal("2000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("4000.00"),
                new BigDecimal("2000.00"),
                dueDateFar
        );
        feeStructureRepository.save(fsDscSem1);

        // 4. Create Students and Fee Records

        // Student 1: Aarav Sharma (Partial Payment)
        User u1 = new User("student1", passwordEncoder.encode("password123"), "aarav.sharma@student.apexuniv.edu.in", "Aarav Sharma", Role.ROLE_STUDENT, "+91 9811002201");
        userRepository.save(u1);
        Student s1 = new Student(u1, "2024-CSE-0101", "REG-2024-00101", "B.Tech Computer Science & Engineering", "School of Computing", 3, "2025-2026", LocalDate.of(2023, 8, 10), "Rajesh Sharma", "+91 9811002299", "Flat 402, Royal Palms, Cyber City");
        studentRepository.save(s1);

        StudentFeeRecord sfr1 = new StudentFeeRecord(s1, fsBTechCseSem3, "2025-2026", 3, fsBTechCseSem3.getTotalFee(), fsBTechCseSem3.getDueDate());
        sfr1.setPaidAmount(new BigDecimal("45000.00"));
        sfr1.setLastPaymentDate(LocalDateTime.now().minusDays(5));
        sfr1.recalculateStatus();
        feeRecordRepository.save(sfr1);

        Payment p1 = new Payment(sfr1, s1, new BigDecimal("45000.00"), PaymentMethod.UPI, "TXN-20260901-A48FE1", PaymentStatus.SUCCESS, "Online UPI Semester 3 Partial Payment", "STUDENT_ONLINE_PORTAL");
        p1.setPaymentDate(LocalDateTime.now().minusDays(5));
        paymentRepository.save(p1);

        Receipt r1 = new Receipt(p1, "UFM-2026-REC-10001", s1.getUser().getFullName(), s1.getRollNumber(), s1.getRegistrationNo(), s1.getProgram(), s1.getCurrentSemester(), s1.getAcademicYear(), new BigDecimal("45000.00"), PaymentMethod.UPI, "TXN-20260901-A48FE1", sfr1.getDueAmount(), "Controller of Finance, Apex University");
        r1.setIssueDate(LocalDateTime.now().minusDays(5));
        receiptRepository.save(r1);

        // Student 2: Priya Patel (Fully Paid)
        User u2 = new User("student2", passwordEncoder.encode("password123"), "priya.patel@student.apexuniv.edu.in", "Priya Patel", Role.ROLE_STUDENT, "+91 9811002202");
        userRepository.save(u2);
        Student s2 = new Student(u2, "2024-CSE-0102", "REG-2024-00102", "B.Tech Computer Science & Engineering", "School of Computing", 3, "2025-2026", LocalDate.of(2023, 8, 10), "Kishore Patel", "+91 9811002298", "B-12, Greenview Enclave");
        studentRepository.save(s2);

        StudentFeeRecord sfr2 = new StudentFeeRecord(s2, fsBTechCseSem3, "2025-2026", 3, fsBTechCseSem3.getTotalFee(), fsBTechCseSem3.getDueDate());
        sfr2.setPaidAmount(fsBTechCseSem3.getTotalFee());
        sfr2.setLastPaymentDate(LocalDateTime.now().minusDays(10));
        sfr2.recalculateStatus();
        feeRecordRepository.save(sfr2);

        Payment p2 = new Payment(sfr2, s2, fsBTechCseSem3.getTotalFee(), PaymentMethod.NET_BANKING, "TXN-20260829-B99AC2", PaymentStatus.SUCCESS, "Full Semester 3 Payment via HDFC Net Banking", "STUDENT_ONLINE_PORTAL");
        p2.setPaymentDate(LocalDateTime.now().minusDays(10));
        paymentRepository.save(p2);

        Receipt r2 = new Receipt(p2, "UFM-2026-REC-10002", s2.getUser().getFullName(), s2.getRollNumber(), s2.getRegistrationNo(), s2.getProgram(), s2.getCurrentSemester(), s2.getAcademicYear(), fsBTechCseSem3.getTotalFee(), PaymentMethod.NET_BANKING, "TXN-20260829-B99AC2", BigDecimal.ZERO, "Controller of Finance, Apex University");
        r2.setIssueDate(LocalDateTime.now().minusDays(10));
        receiptRepository.save(r2);

        // Student 3: Rohan Gupta (Overdue Dues)
        User u3 = new User("student3", passwordEncoder.encode("password123"), "rohan.gupta@student.apexuniv.edu.in", "Rohan Gupta", Role.ROLE_STUDENT, "+91 9811002203");
        userRepository.save(u3);
        Student s3 = new Student(u3, "2024-ECE-0205", "REG-2024-00205", "B.Tech Electronics & Communication", "School of Electrical Sciences", 2, "2025-2026", LocalDate.of(2024, 1, 15), "Suresh Gupta", "+91 9811002297", "44, Lake Road, Model Town");
        studentRepository.save(s3);

        StudentFeeRecord sfr3 = new StudentFeeRecord(s3, fsBTechEceSem2, "2025-2026", 2, fsBTechEceSem2.getTotalFee(), fsBTechEceSem2.getDueDate());
        sfr3.setPaidAmount(BigDecimal.ZERO);
        sfr3.recalculateStatus();
        feeRecordRepository.save(sfr3);

        // Student 4: Ananya Desai (MBA - Partial)
        User u4 = new User("student4", passwordEncoder.encode("password123"), "ananya.desai@student.apexuniv.edu.in", "Ananya Desai", Role.ROLE_STUDENT, "+91 9811002204");
        userRepository.save(u4);
        Student s4 = new Student(u4, "2025-MBA-0014", "REG-2025-00914", "MBA Finance & Marketing", "Apex Business School", 1, "2025-2026", LocalDate.of(2025, 7, 20), "Arvind Desai", "+91 9811002296", "Tower 8, Regency Court");
        studentRepository.save(s4);

        StudentFeeRecord sfr4 = new StudentFeeRecord(s4, fsMbaSem1, "2025-2026", 1, fsMbaSem1.getTotalFee(), fsMbaSem1.getDueDate());
        sfr4.setPaidAmount(new BigDecimal("50000.00"));
        sfr4.setLastPaymentDate(LocalDateTime.now().minusDays(2));
        sfr4.recalculateStatus();
        feeRecordRepository.save(sfr4);

        Payment p4 = new Payment(sfr4, s4, new BigDecimal("50000.00"), PaymentMethod.CREDIT_CARD, "TXN-20260906-C339F0", PaymentStatus.SUCCESS, "Installment 1 Payment via Visa Corporate Card", "STUDENT_ONLINE_PORTAL");
        p4.setPaymentDate(LocalDateTime.now().minusDays(2));
        paymentRepository.save(p4);

        Receipt r4 = new Receipt(p4, "UFM-2026-REC-10003", s4.getUser().getFullName(), s4.getRollNumber(), s4.getRegistrationNo(), s4.getProgram(), s4.getCurrentSemester(), s4.getAcademicYear(), new BigDecimal("50000.00"), PaymentMethod.CREDIT_CARD, "TXN-20260906-C339F0", sfr4.getDueAmount(), "Controller of Finance, Apex University");
        r4.setIssueDate(LocalDateTime.now().minusDays(2));
        receiptRepository.save(r4);

        // Student 5: Vikram Reddy (Medical - Fully Paid)
        User u5 = new User("student5", passwordEncoder.encode("password123"), "vikram.reddy@student.apexuniv.edu.in", "Dr. Vikram Reddy (Intern)", Role.ROLE_STUDENT, "+91 9811002205");
        userRepository.save(u5);
        Student s5 = new Student(u5, "2024-MED-0032", "REG-2024-00632", "MBBS Medicine & Surgery", "Faculty of Medical Sciences", 2, "2025-2026", LocalDate.of(2023, 9, 01), "V. R. Reddy", "+91 9811002295", "Staff Quarters, Medical College Campus");
        studentRepository.save(s5);

        StudentFeeRecord sfr5 = new StudentFeeRecord(s5, fsMbbsSem2, "2025-2026", 2, fsMbbsSem2.getTotalFee(), fsMbbsSem2.getDueDate());
        sfr5.setPaidAmount(fsMbbsSem2.getTotalFee());
        sfr5.setLastPaymentDate(LocalDateTime.now().minusDays(20));
        sfr5.recalculateStatus();
        feeRecordRepository.save(sfr5);

        Payment p5 = new Payment(sfr5, s5, fsMbbsSem2.getTotalFee(), PaymentMethod.BANK_CHALLAN, "TXN-20260819-D1198A", PaymentStatus.SUCCESS, "State Bank of India Challan Ref #CHL-99823", "FINANCE_STAFF: sarah.jenkins");
        p5.setPaymentDate(LocalDateTime.now().minusDays(20));
        paymentRepository.save(p5);

        Receipt r5 = new Receipt(p5, "UFM-2026-REC-10004", s5.getUser().getFullName(), s5.getRollNumber(), s5.getRegistrationNo(), s5.getProgram(), s5.getCurrentSemester(), s5.getAcademicYear(), fsMbbsSem2.getTotalFee(), PaymentMethod.BANK_CHALLAN, "TXN-20260819-D1198A", BigDecimal.ZERO, "Controller of Finance, Apex University");
        r5.setIssueDate(LocalDateTime.now().minusDays(20));
        receiptRepository.save(r5);

        // Student 6: Sneha Nair (B.Sc Data Science - Pending)
        User u6 = new User("student6", passwordEncoder.encode("password123"), "sneha.nair@student.apexuniv.edu.in", "Sneha Nair", Role.ROLE_STUDENT, "+91 9811002206");
        userRepository.save(u6);
        Student s6 = new Student(u6, "2025-DSC-0008", "REG-2025-00708", "B.Sc Data Science & AI", "Department of Mathematical Sciences", 1, "2025-2026", LocalDate.of(2025, 8, 1), "Madhavan Nair", "+91 9811002294", "18, Palm Meadows");
        studentRepository.save(s6);

        StudentFeeRecord sfr6 = new StudentFeeRecord(s6, fsDscSem1, "2025-2026", 1, fsDscSem1.getTotalFee(), fsDscSem1.getDueDate());
        sfr6.setPaidAmount(BigDecimal.ZERO);
        sfr6.recalculateStatus();
        feeRecordRepository.save(sfr6);

        logger.info("Successfully seeded university records: 1 Admin, 2 Finance Staff, 6 Students with live fee records & receipts!");
    }
}
