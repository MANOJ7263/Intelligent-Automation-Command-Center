package com.mano.iacc.service;

import com.mano.iacc.entity.AutomationJob;
import com.mano.iacc.entity.Task;
import com.mano.iacc.integration.uipath.service.UiPathJobService;
import com.mano.iacc.repository.AutomationJobRepository;
import com.mano.iacc.repository.TaskRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EnhancedTaskService {

    private final TaskRepository taskRepository;
    private final PredictiveEngineService predictiveEngine;
    private final UiPathJobService uiPathService;
    private final AutomationJobRepository automationJobRepository;
    private final GovernanceAuditService auditService;

    public EnhancedTaskService(TaskRepository taskRepository,
            PredictiveEngineService predictiveEngine,
            UiPathJobService uiPathService,
            AutomationJobRepository automationJobRepository,
            GovernanceAuditService auditService) {
        this.taskRepository = taskRepository;
        this.predictiveEngine = predictiveEngine;
        this.uiPathService = uiPathService;
        this.automationJobRepository = automationJobRepository;
        this.auditService = auditService;
    }

    @Transactional
    public Task createTaskWithAI(Task task, String createdByUsername) {
        // Step 1: AI Intent Detection
        detectIntent(task);

        // Step 2: Predictive Risk Scoring
        calculateRiskScore(task);

        // Step 3: Auto-Routing Logic
        if (task.getIntentType() != null) {
            autoAssignBot(task);
        }

        // Save Task
        task.setStatus("PENDING");
        Task savedTask = taskRepository.save(task);

        // Step 4: Governance Audit
        auditService.logTaskCreation(savedTask.getId(), createdByUsername,
                "Intent: " + task.getIntentType() + ", Risk: " + task.getRiskScore());

        // Step 5: Trigger Automation if applicable
        if (task.getAssignedBotType() != null) {
            triggerAutomation(savedTask, createdByUsername);
        }

        return savedTask;
    }

    private void detectIntent(Task task) {
        String description = (task.getDescription() + " " + task.getTitle()).toLowerCase();

        if (description.contains("report") || description.contains("generate")) {
            task.setIntentType("REPORT_GENERATION");
            task.setAssignedBotType("REPORT_BOT");
        } else if (description.contains("approval") || description.contains("approve")) {
            task.setIntentType("APPROVAL_WORKFLOW");
            task.setAssignedBotType("APPROVAL_BOT");
        } else if (description.contains("data entry") || description.contains("input")) {
            task.setIntentType("DATA_ENTRY");
            task.setAssignedBotType("DATA_ENTRY_BOT");
        } else if (description.contains("email") || description.contains("send") || description.contains("notify")) {
            task.setIntentType("COMMUNICATION");
            task.setAssignedBotType("EMAIL_BOT");
        } else {
            task.setIntentType("MANUAL_REVIEW");
            task.setAssignedBotType(null);
        }

        log.info("AI Intent Detection: {} -> {}", task.getTitle(), task.getIntentType());
    }

    private void calculateRiskScore(Task task) {
        int score = 0;

        // Priority-based scoring
        if ("HIGH".equalsIgnoreCase(task.getPriority())) {
            score += 40;
        } else if ("MEDIUM".equalsIgnoreCase(task.getPriority())) {
            score += 20;
        }

        // Deadline-based scoring
        if (task.getDeadline() != null) {
            long daysUntilDeadline = ChronoUnit.DAYS.between(LocalDateTime.now(), task.getDeadline());
            if (daysUntilDeadline < 2) {
                score += 30;
            } else if (daysUntilDeadline < 7) {
                score += 15;
            }
        }

        // Department-based scoring (critical departments)
        if ("HEALTH".equalsIgnoreCase(task.getDepartment()) || "REVENUE".equalsIgnoreCase(task.getDepartment())) {
            score += 20;
        }

        // Intent-based scoring
        if ("APPROVAL_WORKFLOW".equals(task.getIntentType())) {
            score += 10;
        }

        task.setRiskScore(Math.min(score, 100));

        // Set risk level
        if (score > 75) {
            task.setRiskLevel("HIGH");
            task.setRisk_reason("Critical: High priority with tight deadline");
        } else if (score > 40) {
            task.setRiskLevel("MEDIUM");
            task.setRisk_reason("Moderate: Requires attention");
        } else {
            task.setRiskLevel("LOW");
            task.setRisk_reason("Standard processing");
        }

        log.info("Risk Score Calculated: {} -> Score: {}, Level: {}", task.getTitle(), score, task.getRiskLevel());
    }

    private void autoAssignBot(Task task) {
        // Already assigned in detectIntent, but we can add additional logic here
        log.info("Auto-assigned bot: {} for task: {}", task.getAssignedBotType(), task.getTitle());
    }

    private void triggerAutomation(Task task, String triggeredBy) {
        try {
            // Start Job via UiPath
            String jobKey = uiPathService.startJob(task.getAssignedBotType());
            task.setUipathJobKey(jobKey);

            // Log Automation Job
            AutomationJob job = AutomationJob.builder()
                    .task(task)
                    .botId(jobKey)
                    .status("RUNNING")
                    .startTime(LocalDateTime.now())
                    .logs("Job initiated via UiPath Orchestrator for " + task.getAssignedBotType())
                    .build();
            automationJobRepository.save(job);

            // Update Task Status
            String oldStatus = task.getStatus();
            task.setStatus("IN_PROGRESS");
            taskRepository.save(task);

            // Audit Trail
            auditService.logTaskStatusChange(task.getId(), oldStatus, "IN_PROGRESS", triggeredBy,
                    "Automation triggered");
            auditService.logAutomationTrigger(task.getId(), task.getAssignedBotType(), jobKey, "SYSTEM");

            log.info("Automation triggered successfully for task: {}", task.getId());

        } catch (Exception e) {
            log.error("Failed to trigger automation for task: {}", task.getId(), e);

            AutomationJob errorJob = AutomationJob.builder()
                    .task(task)
                    .status("FAILED")
                    .startTime(LocalDateTime.now())
                    .logs("Failed to start job: " + e.getMessage())
                    .build();
            automationJobRepository.save(errorJob);
        }
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Map<String, Object> getTaskAnalytics() {
        List<Task> allTasks = taskRepository.findAll();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalTasks", allTasks.size());
        analytics.put("pendingTasks", allTasks.stream().filter(t -> "PENDING".equals(t.getStatus())).count());
        analytics.put("inProgressTasks", allTasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count());
        analytics.put("completedTasks", allTasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count());
        analytics.put("highRiskTasks",
                allTasks.stream().filter(t -> t.getRiskScore() != null && t.getRiskScore() > 75).count());
        analytics.put("automatedTasks", allTasks.stream().filter(t -> t.getAssignedBotType() != null).count());

        return analytics;
    }

    public List<Task> getHighRiskTasks() {
        return taskRepository.findAll().stream()
                .filter(t -> t.getRiskScore() != null && t.getRiskScore() > 75)
                .toList();
    }
}
