package com.academia.backend.repository;

import com.academia.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>{
// This allows us to find a student by their email (for login later)
    Optional<Student> findByEmail(String email);
}
