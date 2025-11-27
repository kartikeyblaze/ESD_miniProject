package com.academia.backend.service;

import com.academia.backend.entity.Student;
import com.academia.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
public class StudentService {

    private final StudentRepository studentRepository;
    // Folder where we save files
    private final String UPLOAD_DIR = "uploads/";

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
        // Create the directory if it doesn't exist
        new File(UPLOAD_DIR).mkdirs();
    }

    public Student getStudent(Long id) {
        return studentRepository.findById(id).orElse(null);
    }


    public String uploadCv(Long studentId, MultipartFile file) throws IOException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 1. Generate a unique filename (e.g., "cv_1.pdf")
        String filename = "cv_" + studentId + ".pdf";
        Path filePath = Paths.get(UPLOAD_DIR + filename);

        // 2. Save the file to disk
        Files.write(filePath, file.getBytes());

        // 3. Update the database with the path
        student.setCvFilePath(filePath.toString());
        studentRepository.save(student);

        return "File uploaded successfully: " + filename;
    }
}
