package com.university.feems.repository;

import com.university.feems.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByRegistrationNo(String registrationNo);
    Optional<Student> findByUserId(Long userId);
    Boolean existsByRollNumber(String rollNumber);
    Boolean existsByRegistrationNo(String registrationNo);

    List<Student> findByProgram(String program);
    List<Student> findByDepartment(String department);
    List<Student> findByAcademicYear(String academicYear);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.registrationNo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.program) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.department) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchStudents(@Param("keyword") String keyword);
}
