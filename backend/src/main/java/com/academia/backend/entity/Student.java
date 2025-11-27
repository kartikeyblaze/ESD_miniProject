package com.academia.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Data // Generates getters, setters, toString automatically
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "student")

public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String password; // In real life, this should be encrypted (e.g., BCrypt)

    @Column(name = "cv_file_path")
    private String cvFilePath; // Path to the CV file stored in the file system like "uploads/cv_1.pdf"

    @Column(unique = true, nullable = false)
    private String rollNumber;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String domain; // "M.Tech CSE", "M.Tech ECE", "M.Tech AI", "M.Tech CS"

    private Double cgpa;

//    private String photoraphPath;

}
