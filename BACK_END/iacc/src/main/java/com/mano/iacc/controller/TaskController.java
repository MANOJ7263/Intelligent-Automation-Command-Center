package com.mano.iacc.controller;

import com.mano.iacc.entity.Task;
import com.mano.iacc.entity.User;
import com.mano.iacc.repository.TaskRepository;
import com.mano.iacc.repository.UserRepository;
import com.mano.iacc.service.TaskRoutingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
// @RestController - Disabled: EnhancedTaskController is now handling /api/tasks
// endpoints
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TaskRoutingService taskRoutingService;

    @Autowired
    com.mano.iacc.service.TaskService taskService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_STAFF')")
    public List<Task> getAllTasks() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // In a real app, filter based on role/department
        return taskRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_STAFF')")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        task.setCreatedBy(currentUser);
        task.setCreatedAt(LocalDateTime.now());

        if (task.getStatus() == null) {
            task.setStatus("PENDING");
        }

        // Use AI Routing Service
        Task savedTask = taskRoutingService.processTaskSubmission(task);

        return ResponseEntity.ok(savedTask);
    }
}
