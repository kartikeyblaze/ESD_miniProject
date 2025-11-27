-- ==========================================
-- 1. DATABASE SETUP
-- ==========================================
CREATE DATABASE IF NOT EXISTS academia_erp;
USE academia_erp;

-- Disable foreign key checks temporarily to allow dropping/creating freely
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist (Fresh Start)
DROP TABLE IF EXISTS placement_application;
DROP TABLE IF EXISTS placement_offer;
DROP TABLE IF EXISTS student;

-- ==========================================
-- 2. TABLE CREATION (No Foreign Keys yet)
-- ==========================================

-- Table: Student
CREATE TABLE student (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE,
    domain VARCHAR(100),
    cgpa DOUBLE,
    cv_file_path VARCHAR(500)
);

-- Table: Placement Offer (Jobs)
CREATE TABLE placement_offer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    eligible_domain VARCHAR(100),
    min_cgpa DOUBLE
);

-- Table: Placement Application (Join Table)
CREATE TABLE placement_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_date DATE,
    status VARCHAR(50),
    offer_id BIGINT,
    student_id BIGINT
);

-- ==========================================
-- 3. ADD CONSTRAINTS (Relationships)
-- ==========================================

-- Link Application -> Student
ALTER TABLE placement_application
ADD CONSTRAINT fk_student
FOREIGN KEY (student_id) REFERENCES student(id)
ON DELETE CASCADE;

-- Link Application -> Offer
ALTER TABLE placement_application
ADD CONSTRAINT fk_offer
FOREIGN KEY (offer_id) REFERENCES placement_offer(id)
ON DELETE CASCADE;

-- Prevent duplicate applications
ALTER TABLE placement_application
ADD CONSTRAINT unique_application
UNIQUE (student_id, offer_id);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;


-- ==========================================
-- 4. DUMMY DATA INSERTION
-- ==========================================

-- STUDENTS
-- Password for all users is: "secret123"
-- The hash is: $2a$10$s4T6QzKk0j/1.a.s123456789012345678901234567890123456
-- IMPORTANT: Replace 'YOUR_GOOGLE_EMAIL@gmail.com' with your real email to test Google Login.

INSERT INTO student (first_name, last_name, email, password, roll_number, domain, cgpa, cv_file_path) VALUES
('Kartikey', 'Dubey', 'kartikeyblaze@gmail.com', '$2a$10$ZBssmLTB/W4aN/YQwN/uJ.6G5.Lld5V3loRahPciOWba/Ake2G1c2', 'MT2023001', 'M.Tech CSE', 3.8, NULL),
('Priya', 'Verma', 'priya@iiitb.ac.in', '$2a$10$YvlADVKbspJ3F6UNpNDuqOO.AHHjJNTrjbes1P4Y8TEMTFNGPbY9y', 'MT2023002', 'M.Tech CSE', 2.8, NULL),
('Amit', 'Kumar', 'amit@iiitb.ac.in', '$2a$10$s4T6QzKk0j/1.a.s123456789012345678901234567890123456', 'MT2023003', 'M.Tech ECE', 3.5, NULL);


-- PLACEMENT OFFERS
INSERT INTO placement_offer (organization_name, role, eligible_domain, min_cgpa) VALUES
('Google', 'Software Engineer', 'M.Tech CSE', 3.5),
('Microsoft', 'SDE-1', 'M.Tech CSE', 3.2),
('TCS', 'System Engineer', 'M.Tech CSE', 2.5),
('Intel', 'Hardware Engineer', 'M.Tech ECE', 3.0),
('Qualcomm', 'Embedded Systems', 'M.Tech ECE', 3.2),
('Amazon', 'Cloud Associate', 'M.Tech CSE', 3.0);

-- EXISTING APPLICATIONS
-- Rahul (ID 1) has already applied to Google (ID 1)
INSERT INTO placement_application (student_id, offer_id, application_date, status) VALUES
(1, 1, CURDATE(), 'APPLIED');

-- Amit (ID 3) has applied to Intel (ID 4)
INSERT INTO placement_application (student_id, offer_id, application_date, status) VALUES
(3, 4, CURDATE(), 'SELECTED');

-- ==========================================
-- 5. VERIFICATION
-- ==========================================
SELECT * FROM student;
SELECT * FROM placement_offer;
SELECT * FROM placement_application;
