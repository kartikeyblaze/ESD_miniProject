package com.academia.backend.controller;

import com.academia.backend.entity.PlacementApplication;
import com.academia.backend.entity.PlacementOffer;
import com.academia.backend.entity.Student;
import com.academia.backend.repository.PlacementApplicationRepository;
import com.academia.backend.repository.PlacementOfferRepository;
import com.academia.backend.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/placement")
@CrossOrigin(origins = "http://localhost:5173")
public class PlacementController {

    private final PlacementOfferRepository placementOfferRepository;
    private final StudentRepository studentRepository;
    // 1. NEW: Repository for saving applications
    private final PlacementApplicationRepository applicationRepository;

    // 2. UPDATED CONSTRUCTOR: Inject all 3 repositories
    public PlacementController(PlacementOfferRepository placementOfferRepository,
                               StudentRepository studentRepository,
                               PlacementApplicationRepository applicationRepository) {
        this.placementOfferRepository = placementOfferRepository;
        this.studentRepository = studentRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/eligible/{studentId}")
    public List<PlacementOffer> getEligibleOffers(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return placementOfferRepository.findByEligibleDomainAndMinCgpaLessThanEqual(
                student.getDomain(), student.getCgpa());
    }

    // 3. NEW ENDPOINT: Handle Job Application
    @PostMapping("/apply")
    public ResponseEntity<String> applyForJob(@RequestBody Map<String, Long> request) {
        Long studentId = request.get("studentId");
        Long offerId = request.get("offerId");

        // A. Check if student already applied
        if (applicationRepository.existsByStudentIdAndOfferId(studentId, offerId)) {
            return ResponseEntity.badRequest().body("You have already applied for this job!");
        }

        // B. Fetch Student and Offer entities
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        PlacementOffer offer = placementOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        // C. Create and Save the Application
        PlacementApplication app = new PlacementApplication();
        app.setStudent(student);
        app.setOffer(offer);
        app.setApplicationDate(LocalDate.now());
        app.setStatus("APPLIED");

        applicationRepository.save(app);

        return ResponseEntity.ok("Application Submitted Successfully!");
    }
}
