package com.mano.iacc.integration.uipath.service;

import com.mano.iacc.entity.Task;
import com.mano.iacc.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UiPathService {

    private static final Logger logger = LoggerFactory.getLogger(UiPathService.class);

    @Autowired
    private TaskRepository taskRepository;

    public void triggerBot(Task task) {
        // Mocking Orchestrator API Call
        logger.info("Calling UiPath Orchestrator for Task ID: {}", task.getId());
        logger.info("Bot assigned: {}", task.getAssignedBotType());
        logger.info("Payload sent to Bot: {}", task.getDescription());

        // Simulate async bot execution status update
        mockBotExecution(task);
    }

    private void mockBotExecution(Task task) {
        // In a real scenario, this would be a webhook callback
        // Here we just simulate immediate success/failure
        logger.info("UiPath Bot Started Execution...");

        try {
            Thread.sleep(1000); // Simulate network latency
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 90% Success Rate Mock
        boolean success = new Random().nextInt(10) > 0;

        if (success) {
            task.setStatus("COMPLETED");
            logger.info("UiPath Bot Execution SUCCESS. Task marked as COMPLETED.");
        } else {
            task.setStatus("FAILED");
            logger.error("UiPath Bot Execution FAILED. Task marked as FAILED.");
        }

        // Save the updated status
        taskRepository.save(task);
    }
}
