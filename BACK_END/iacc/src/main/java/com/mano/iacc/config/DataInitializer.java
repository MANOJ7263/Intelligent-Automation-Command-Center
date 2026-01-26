package com.mano.iacc.config;

import com.mano.iacc.entity.User;
import com.mano.iacc.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // Runs on application startup
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.count() == 0) {
                System.out.println("No users found. Seeding default users...");

                createUserIsNotExist(userRepository, encoder, "test41", "test41@gmail.com", "ROLE_DEPT_HEAD",
                        "REVENUE");
                createUserIsNotExist(userRepository, encoder, "staff41", "staff41@gmail.com", "ROLE_STAFF", "HEALTH");
                createUserIsNotExist(userRepository, encoder, "auto41", "auto41@gmail.com", "ROLE_AUTO_SUPERVISOR",
                        "TRANSPORT");
                createUserIsNotExist(userRepository, encoder, "collector41", "collector41@gmail.com", "ROLE_COLLECTOR",
                        "ADMIN");

            } else {
                System.out.println("Users already exist. Skipping seed.");
            }
        };
    }

    private void createUserIsNotExist(UserRepository repo, PasswordEncoder encoder, String username, String email,
            String role, String dept) {
        if (repo.findByUsername(username).isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .email(email)
                    .passwordHash(encoder.encode("Test@1234"))
                    .role(role)
                    .department(dept)
                    .build();
            repo.save(user);
            System.out.println("USER SAVED SUCCESSFULLY: " + username);
        }
    }
}
