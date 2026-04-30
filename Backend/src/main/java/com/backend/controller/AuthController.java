package com.backend.controller;

import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.dto.RegisterRequest;
import com.backend.entity.User;
import com.backend.security.JwtUtil;
import com.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest user) {
        try {
            User loggedInUser = userService.login(user.getEmail(), user.getPassword());
            String token = jwtUtil.generateToken(loggedInUser.getEmail());
            LoginResponse logInUser = new LoginResponse(token, loggedInUser.getId(), loggedInUser.getEmail(),
                    loggedInUser.getName());
            return ResponseEntity.status(HttpStatus.OK).body(logInUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody RegisterRequest user) {
        try {
            User savedUser = userService.createUser(user.getName(), user.getEmail(), user.getPassword(),
                    BigDecimal.ZERO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
