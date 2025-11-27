package com.academia.backend.controller;

import com.academia.backend.dto.StudentProfileDTO; // Import the DTO
import com.academia.backend.entity.Student;
import com.academia.backend.service.StudentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // --- UPDATED METHOD: Returns DTO instead of Entity ---
    @GetMapping("/{id}")
    public ResponseEntity<StudentProfileDTO> getStudentProfile(@PathVariable Long id) {
        Student student = studentService.getStudent(id);

        if (student != null) {
            // MAP Entity -> DTO
            // We act as a filter here, copying only the safe fields
            StudentProfileDTO dto = new StudentProfileDTO(
                    student.getId(),
                    student.getFirstName(),
                    student.getLastName(),
                    student.getEmail(),
                    student.getRollNumber(),
                    student.getDomain(),
                    student.getCgpa(),
                    student.getCvFilePath()
                    // Note: 'password' is NOT passed here
            );
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    // --- (Existing Methods remain unchanged below) ---

    @PostMapping("/{id}/upload-cv")
    public ResponseEntity<String> uploadCv(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String message = studentService.uploadCv(id, file);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<Resource> downloadCv(@PathVariable Long id) {
        try {
            Student student = studentService.getStudent(id);
            if (student == null || student.getCvFilePath() == null) {
                return ResponseEntity.notFound().build();
            }

            Path path = Paths.get(student.getCvFilePath());
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
