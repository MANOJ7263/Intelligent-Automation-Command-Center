package com.mano.iacc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "automation_jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutomationJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "bot_id")
    private String botId;

    @Column(nullable = false)
    private String status; // PENDING, RUNNING, SUCCESS, FAILED

    @Column(columnDefinition = "TEXT")
    private String logs;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;
}
