package com.academia.backend.service;

import com.academia.backend.entity.PlacementOffer;
import com.academia.backend.entity.Student;
import com.academia.backend.repository.PlacementOfferRepository;
import com.academia.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // this tells spring: "you manage this class. Don't make me use 'new' "

public class PlacementService {
    private final StudentRepository studentRepo;
    private final PlacementOfferRepository offerRepo;

    // Constructor Injection: Spring automatically fills these variables

    public PlacementService(PlacementOfferRepository offerRepo, StudentRepository studentRepo) {
        this.offerRepo = offerRepo;
        this.studentRepo = studentRepo;
    }

    //Logic: Find offers valid for a specific student
    public List<PlacementOffer> getEligibleOffersForStudent(Long studentId) {
        //1. Find the student by ID
        Student student = studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        //2. Ask the repository for matching offers
        return offerRepo.findByEligibleDomainAndMinCgpaLessThanEqual(student.getDomain(), student.getCgpa());
    };
}
