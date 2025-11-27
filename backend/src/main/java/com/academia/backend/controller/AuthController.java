package com.academia.backend.controller;

import com.academia.backend.entity.Student;
import com.academia.backend.repository.StudentRepository;
import com.academia.backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;

import com.academia.backend.dto.LoginRequest;
import jakarta.validation.Valid; // Import this!

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    // Inject PasswordEncoder
    public AuthController(JwtUtil jwtUtil, StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Map<String, String> login(@Valid @RequestBody LoginRequest request) {
        String email = request.getEmail();
        String rawPassword = request.getPassword();

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Proper BCrypt Check: matches(raw, hashed)
        if (!passwordEncoder.matches(rawPassword, student.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(email);

        return Map.of(
                "token", token,
                "studentId", String.valueOf(student.getId())
        );
    }

    @PostMapping("/google")
    public Map<String, String> loginWithGoogle(@RequestBody Map<String, String> payload) {
        String googleToken = payload.get("token");

        // 1. Configure the Verifier
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList("277888567236-68fa06sf332a9ns6feadhd4skiubj4hv.apps.googleusercontent.com")) // YOUR CLIENT ID
                .build();

        try {
            // 2. Verify the Token with Google
            GoogleIdToken idToken = verifier.verify(googleToken);

            if (idToken != null) {
                // 3. Extract Info
                GoogleIdToken.Payload googlePayload = idToken.getPayload();
                String email = googlePayload.getEmail();

                System.out.println(">>> GOOGLE SENT EMAIL: " + email);

                // 4. Check if User Exists in OUR Database
                Student student = studentRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not registered in system. Contact Admin."));
//                        .orElseThrow( () -> {
//                                    System.out.println(">>>ERROR: Email not found in DB");
//                                    return new RuntimeException(("User not registered in the system."));
//                                });

                // 5. Generate OUR Custom JWT (Just like the password login!)
                String token = jwtUtil.generateToken(email);

                return Map.of(
                        "token", token,
                        "studentId", String.valueOf(student.getId())
                );
            } else {
                throw new RuntimeException("Invalid Google Token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google Login Failed: " + e.getMessage());
        }
    }

}
