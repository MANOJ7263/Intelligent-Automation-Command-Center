package com.mano.iacc.controller;

import com.mano.iacc.entity.Task;
import com.mano.iacc.entity.User;
import com.mano.iacc.repository.UserRepository;
import com.mano.iacc.service.EnhancedTaskService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
@Slf4j
public class EnhancedTaskController {

    @Autowired
    EnhancedTaskService enhancedTaskService;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_STAFF', 'ROLE_AUTO_SUPERVISOR')")
    public List<Task> getAllTasks() {
        return enhancedTaskService.getAllTasks();
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_AUTO_SUPERVISOR')")
    public ResponseEntity<Map<String, Object>> getTaskAnalytics() {
        Map<String, Object> analytics = enhancedTaskService.getTaskAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/high-risk")
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_AUTO_SUPERVISOR')")
    public ResponseEntity<List<Task>> getHighRiskTasks() {
        List<Task> highRiskTasks = enhancedTaskService.getHighRiskTasks();
        return ResponseEntity.ok(highRiskTasks);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_STAFF')")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        task.setCreatedBy(currentUser);

        // Use Enhanced AI Service
        Task savedTask = enhancedTaskService.createTaskWithAI(task, currentUser.getUsername());

        log.info("Task created by {}: {} (Intent: {}, Risk Score: {})",
                currentUser.getUsername(), savedTask.getTitle(), savedTask.getIntentType(), savedTask.getRiskScore());

        return ResponseEntity.ok(savedTask);
    }
}
