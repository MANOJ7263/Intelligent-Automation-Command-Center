package com.mano.iacc.service;

import com.mano.iacc.entity.AuditLog;
import com.mano.iacc.repository.AuditLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
public class GovernanceAuditService {

    private final AuditLogRepository auditLogRepository;

    public GovernanceAuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void logTaskStatusChange(Long taskId, String oldStatus, String newStatus, String performedBy,
            String reason) {
        AuditLog auditLog = AuditLog.builder()
                .entityType("TASK")
                .entityId(taskId)
                .action("STATUS_CHANGE")
                .oldValue(oldStatus)
                .newValue(newStatus)
                .performedBy(performedBy)
                .reason(reason)
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
        log.info("Audit Log Created: Task {} status changed from {} to {} by {}", taskId, oldStatus, newStatus,
                performedBy);
    }

    @Transactional
    public void logTaskCreation(Long taskId, String createdBy, String details) {
        AuditLog auditLog = AuditLog.builder()
                .entityType("TASK")
                .entityId(taskId)
                .action("CREATED")
                .newValue("PENDING")
                .performedBy(createdBy)
                .reason(details)
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
        log.info("Audit Log Created: Task {} created by {}", taskId, createdBy);
    }

    @Transactional
    public void logAutomationTrigger(Long taskId, String botType, String jobKey, String triggeredBy) {
        AuditLog auditLog = AuditLog.builder()
                .entityType("AUTOMATION")
                .entityId(taskId)
                .action("BOT_TRIGGERED")
                .newValue(botType + " | Job: " + jobKey)
                .performedBy(triggeredBy)
                .reason("AI-driven automation triggered")
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
        log.info("Audit Log Created: Automation triggered for Task {} with bot {}", taskId, botType);
    }
}
