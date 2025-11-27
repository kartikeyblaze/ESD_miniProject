package com.academia.backend;

import com.academia.backend.entity.PlacementOffer;
import com.academia.backend.entity.Student;
import com.academia.backend.repository.PlacementOfferRepository;
import com.academia.backend.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder; // Import this

@SpringBootApplication
public class AcademiaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademiaBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner resetPassword(StudentRepository studentRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            // Update Rahul's password
            Student s1 = studentRepo.findByEmail("kartikeyblaze@gmail.com").orElse(null);
            if (s1 != null) {
                s1.setPassword(passwordEncoder.encode("secret123"));
                studentRepo.save(s1);
                System.out.println(">>> PASSWORD FIXED FOR KD7 <<<");
            }

            // Update Priya's password too
            Student s2 = studentRepo.findByEmail("priya@iiitb.ac.in").orElse(null);
            if (s2 != null) {
                s2.setPassword(passwordEncoder.encode("secret123"));
                studentRepo.save(s2);
                System.out.println(">>> PASSWORD FIXED FOR PRIYA <<<");
            }
            Student s3 = studentRepo.findByEmail("amit@iiitb.ac.in").orElse(null);
            if (s3 != null) {
                s2.setPassword(passwordEncoder.encode("secret123"));
                studentRepo.save(s2);
                System.out.println(">>> PASSWORD FIXED FOR AMIT <<<");
            }
        };
    }
}
