package com.academia.backend.dto;

import lombok.Data;

@Data
public class StudentProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String rollNumber;
    private String domain;
    private Double cgpa;
    private String cvFilePath;

    // Constructor to convert Entity -> DTO manually
    // (In large projects, we use tools like MapStruct, but this is clearer for now)
    public StudentProfileDTO(Long id, String firstName, String lastName, String email, String rollNumber, String domain, Double cgpa, String cvFilePath) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.rollNumber = rollNumber;
        this.domain = domain;
        this.cgpa = cgpa;
        this.cvFilePath = cvFilePath;
    }
}
