package com.mano.iacc.controller;

import com.mano.iacc.entity.User;
import com.mano.iacc.payload.JwtResponse;
import com.mano.iacc.payload.LoginRequest;
import com.mano.iacc.payload.SignupRequest;
import com.mano.iacc.repository.UserRepository;
import com.mano.iacc.security.JwtUtils;
import com.mano.iacc.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        UserRepository userRepository;

        @Autowired
        PasswordEncoder encoder;

        @Autowired
        JwtUtils jwtUtils;

        @Autowired
        com.mano.iacc.service.UserService userService;

        @PostMapping("/signin")
        public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList());

                // Fetch user again to get department if needed
                User user = userRepository.findById(userDetails.getId()).orElse(new User());

                // Returning JSON body explicitly
                return ResponseEntity.ok(new JwtResponse(jwt,
                                userDetails.getId(),
                                userDetails.getUsername(),
                                userDetails.getEmail(),
                                roles,
                                user.getDepartment()));
        }

        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
                if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
                        return ResponseEntity
                                        .badRequest()
                                        .body("Error: Username is already taken!");
                }

                // Create new user object (password will be encoded in service)
                User user = User.builder()
                                .username(signUpRequest.getUsername())
                                .email(signUpRequest.getEmail())
                                .passwordHash(signUpRequest.getPassword()) // Service will encode this
                                .role(signUpRequest.getRole())
                                .department(signUpRequest.getDepartment())
                                .build();

                // Use service to save and log
                userService.createUser(user);

                return ResponseEntity.ok("User registered successfully!");
        }
}
