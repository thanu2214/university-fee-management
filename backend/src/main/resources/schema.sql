-- =========================================================================================
-- APEX GLOBAL UNIVERSITY — UNIVERSITY FEE MANAGEMENT SYSTEM
-- Relational MySQL Schema DDL Definition
-- Database: university_fee_db
-- =========================================================================================

CREATE DATABASE IF NOT EXISTS university_fee_db;
USE university_fee_db;

-- 1. Users Table (Authentication & Core Identity)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    phone VARCHAR(20),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    registration_no VARCHAR(50) NOT NULL UNIQUE,
    program VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    current_semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    admission_date DATE,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    address VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Fee Structures Table (Standard Rate Cards)
CREATE TABLE IF NOT EXISTS fee_structures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    program VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    tuition_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    exam_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    library_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    lab_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    hostel_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    sports_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    due_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_prog_year_sem UNIQUE (program, academic_year, semester)
);

-- 4. Student Fee Records Ledger Table
CREATE TABLE IF NOT EXISTS student_fee_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    fee_structure_id BIGINT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    total_fee_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    due_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    concession_amount DECIMAL(10,2) DEFAULT 0.00,
    fee_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    due_date DATE NOT NULL,
    last_payment_date DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sfr_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_sfr_structure FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id)
);

-- 5. Payments Table (Transaction History)
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_fee_record_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(30) NOT NULL,
    transaction_reference VARCHAR(80) NOT NULL UNIQUE,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    payment_notes VARCHAR(255),
    processed_by VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_sfr FOREIGN KEY (student_fee_record_id) REFERENCES student_fee_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_pay_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 6. Receipts Table (Official Generated Documents)
CREATE TABLE IF NOT EXISTS receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL UNIQUE,
    receipt_number VARCHAR(60) NOT NULL UNIQUE,
    issue_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    student_name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    registration_no VARCHAR(50) NOT NULL,
    program VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_reference VARCHAR(80) NOT NULL,
    balance_remaining DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    authorized_signatory VARCHAR(100) DEFAULT 'Controller of Finance, Apex University',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);
