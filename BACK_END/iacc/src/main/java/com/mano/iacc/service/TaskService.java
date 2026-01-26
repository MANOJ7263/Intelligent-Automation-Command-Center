package com.mano.iacc.service;

import com.mano.iacc.entity.AutomationJob;
import com.mano.iacc.entity.Task;
import com.mano.iacc.integration.uipath.service.UiPathJobService;
import com.mano.iacc.repository.AutomationJobRepository;
import com.mano.iacc.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final PredictiveEngineService predictiveEngine;
    private final UiPathJobService uiPathService;
    private final AutomationJobRepository automationJobRepository;

    public TaskService(TaskRepository taskRepository,
            PredictiveEngineService predictiveEngine,
            UiPathJobService uiPathService,
            AutomationJobRepository automationJobRepository) {
        this.taskRepository = taskRepository;
        this.predictiveEngine = predictiveEngine;
        this.uiPathService = uiPathService;
        this.automationJobRepository = automationJobRepository;
    }

    @Transactional
    public Task createTask(Task task) {
        // 1. NLP Simulation (Intent Detection)
        if (task.getTitle() != null) {
            String lower = task.getTitle().toLowerCase();
            if (lower.contains("report")) {
                task.setAiClassification("GENERATING_REPORT");
                task.setAssignedBotType("REPORT_BOT");
            } else if (lower.contains("send") || lower.contains("email")) {
                task.setAiClassification("COMMUNICATION");
                task.setAssignedBotType("EMAIL_BOT");
            }
        }

        // 2. Predictive Risk Analysis
        var riskReport = predictiveEngine.analyzeRisk(task);
        task.setRiskLevel(riskReport.level().name());
        task.setRisk_reason(String.join(", ", riskReport.reasons()));

        // Save Task
        task.setStatus("PENDING");
        Task savedTask = taskRepository.save(task);

        // 3. Trigger Automation if applicable
        if (task.getAssignedBotType() != null) {
            triggerAutomation(savedTask);
        }

        return savedTask;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    private void triggerAutomation(Task task) {
        try {
            // Start Job
            String jobKey = uiPathService.startJob(task.getAssignedBotType());

            // Log Job
            AutomationJob job = AutomationJob.builder()
                    .task(task)
                    .botId(jobKey)
                    .status("PENDING")
                    .startTime(LocalDateTime.now())
                    .logs("Job initiated via UiPath Orchestrator")
                    .build();

            automationJobRepository.save(job);

            // Update Task Status
            task.setStatus("IN_PROGRESS");
            taskRepository.save(task);

        } catch (Exception e) {
            AutomationJob errorJob = AutomationJob.builder()
                    .task(task)
                    .status("FAILED")
                    .startTime(LocalDateTime.now())
                    .logs("Failed to start job: " + e.getMessage())
                    .build();
            automationJobRepository.save(errorJob);
        }
    }
}
