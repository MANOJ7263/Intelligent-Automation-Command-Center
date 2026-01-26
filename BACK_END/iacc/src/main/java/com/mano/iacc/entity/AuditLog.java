package com.mano.iacc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String username; // Store username to keep log even if user is deleted

    @Column(nullable = false)
    private String action;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String details;

    // Additional fields for governance audit
    @Column(name = "entity_type")
    private String entityType; // e.g., "TASK", "AUTOMATION"

    @Column(name = "entity_id")
    private Long entityId; // ID of the entity being audited

    @Column(name = "old_value")
    private String oldValue; // Previous value before change

    @Column(name = "new_value")
    private String newValue; // New value after change

    @Column(name = "performed_by")
    private String performedBy; // Username who performed the action

    @Column(columnDefinition = "TEXT")
    private String reason; // Reason for the action

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
