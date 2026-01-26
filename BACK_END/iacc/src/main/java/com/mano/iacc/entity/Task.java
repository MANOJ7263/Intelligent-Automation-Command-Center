package com.mano.iacc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String department; // HEALTH, REVENUE, EDUCATION, etc.

    @Column(nullable = false)
    private String priority; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, IN_PROGRESS, COMPLETED

    @Column(name = "ai_classification")
    private String aiClassification;

    @Column(name = "assigned_bot_type")
    private String assignedBotType;

    @Column(name = "risk_level")
    private String riskLevel; // LOW, MEDIUM, HIGH

    @Column(name = "risk_score")
    private Integer riskScore; // 0-100

    @Column(columnDefinition = "TEXT")
    private String risk_reason;

    @Column(name = "intent_type")
    private String intentType; // REPORT_GENERATION, DATA_ENTRY, APPROVAL_WORKFLOW, etc.

    @Column(name = "uipath_job_key")
    private String uipathJobKey; // Job ID from UiPath Orchestrator

    private LocalDateTime deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", referencedColumnName = "id")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
