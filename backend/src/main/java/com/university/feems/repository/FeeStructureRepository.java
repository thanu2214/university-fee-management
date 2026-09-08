package com.university.feems.repository;

import com.university.feems.entity.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeStructureRepository extends JpaRepository<FeeStructure, Long> {
    Optional<FeeStructure> findByProgramAndAcademicYearAndSemester(String program, String academicYear, Integer semester);
    List<FeeStructure> findByProgram(String program);
    List<FeeStructure> findByAcademicYear(String academicYear);
    List<FeeStructure> findAllByOrderByAcademicYearDescSemesterAsc();
}
