package com.academia.backend.repository;
import com.academia.backend.entity.PlacementApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlacementApplicationRepository extends JpaRepository<PlacementApplication, Long> {
    // We'll need this to check if already applied
    boolean existsByStudentIdAndOfferId(Long studentId, Long offerId);
}
