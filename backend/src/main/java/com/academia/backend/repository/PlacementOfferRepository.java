package com.academia.backend.repository;

import com.academia.backend.entity.PlacementOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementOfferRepository extends JpaRepository<PlacementOffer, Long>{
    // This custom query fetches offers that match a student's domain and grade
    // "Find offers where eligibleDomain equals X AND minCgpa is less than or equal to Y"
    List<PlacementOffer> findByEligibleDomainAndMinCgpaLessThanEqual(String domain, Double studentCgpa);
}
