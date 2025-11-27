package com.academia.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "placement_application")
public class PlacementApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "offer_id")
    private PlacementOffer offer;

    private LocalDate applicationDate;
    private String status; // "APPLIED", "ACCEPTED", "REJECTED"
}
