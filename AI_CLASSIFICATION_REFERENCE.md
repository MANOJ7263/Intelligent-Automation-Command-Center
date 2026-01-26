# AI Classification & Risk Scoring - Quick Reference

## Intent Detection Keywords

### REPORT_GENERATION
**Triggers:** report, generate, create report, monthly report, statistics  
**Bot Assigned:** REPORT_BOT  
**Example:** "Generate Health Department Monthly Report"

### APPROVAL_WORKFLOW
**Triggers:** approval, approve, review, authorize, sign off  
**Bot Assigned:** APPROVAL_BOT  
**Example:** "Approval needed for budget allocation"

### DATA_ENTRY
**Triggers:** data entry, input, enter data, update records  
**Bot Assigned:** DATA_ENTRY_BOT  
**Example:** "Input citizen registration data"

### COMMUNICATION
**Triggers:** email, send, notify, message, communicate  
**Bot Assigned:** EMAIL_BOT  
**Example:** "Send notification to all department heads"

### MANUAL_REVIEW
**Triggers:** (no match)  
**Bot Assigned:** None  
**Example:** "Custom task requiring human review"

---

## Risk Scoring Algorithm

### Priority Component (0-40 points)
- **HIGH**: +40 points
- **MEDIUM**: +20 points
- **LOW**: +0 points

### Deadline Urgency (0-30 points)
- **< 2 days**: +30 points
- **< 7 days**: +15 points
- **> 7 days**: +0 points

### Department Criticality (0-20 points)
- **HEALTH**: +20 points
- **REVENUE**: +20 points
- **Other**: +0 points

### Intent Complexity (0-10 points)
- **APPROVAL_WORKFLOW**: +10 points
- **Other**: +0 points

### Risk Level Thresholds
- **HIGH**: Score > 75
- **MEDIUM**: Score 40-75
- **LOW**: Score < 40

---

## Example Calculations

### Example 1: Critical Health Report
```
Task: "Generate Health Department Monthly Report"
Priority: HIGH
Deadline: Tomorrow (1 day)
Department: HEALTH

Calculation:
  Priority (HIGH):        +40
  Deadline (<2 days):     +30
  Department (HEALTH):    +20
  Intent (REPORT):        +0
  ─────────────────────────
  Total Risk Score:       90
  Risk Level:            HIGH
  Risk Reason:           "Critical: High priority with tight deadline"
```

### Example 2: Standard Approval
```
Task: "Approval for office supplies purchase"
Priority: MEDIUM
Deadline: Next week (5 days)
Department: ADMIN

Calculation:
  Priority (MEDIUM):      +20
  Deadline (<7 days):     +15
  Department (ADMIN):     +0
  Intent (APPROVAL):      +10
  ─────────────────────────
  Total Risk Score:       45
  Risk Level:            MEDIUM
  Risk Reason:           "Moderate: Requires attention"
```

### Example 3: Low Priority Data Entry
```
Task: "Update employee contact information"
Priority: LOW
Deadline: End of month (15 days)
Department: TRANSPORT

Calculation:
  Priority (LOW):         +0
  Deadline (>7 days):     +0
  Department (TRANSPORT): +0
  Intent (DATA_ENTRY):    +0
  ─────────────────────────
  Total Risk Score:       0
  Risk Level:            LOW
  Risk Reason:           "Standard processing"
```

---

## Testing Scenarios

### Scenario 1: High-Risk Report
```json
{
  "title": "Generate Health Report",
  "description": "Urgent monthly health statistics report",
  "department": "HEALTH",
  "priority": "HIGH",
  "deadline": "2026-01-27T10:00:00"
}

Expected:
  Intent: REPORT_GENERATION
  Bot: REPORT_BOT
  Risk Score: 90
  Risk Level: HIGH
```

### Scenario 2: Approval Workflow
```json
{
  "title": "Budget Approval Required",
  "description": "Need approval for Q1 budget allocation",
  "department": "REVENUE",
  "priority": "HIGH",
  "deadline": "2026-01-28T17:00:00"
}

Expected:
  Intent: APPROVAL_WORKFLOW
  Bot: APPROVAL_BOT
  Risk Score: 75
  Risk Level: MEDIUM
```

### Scenario 3: Email Notification
```json
{
  "title": "Send Monthly Newsletter",
  "description": "Email newsletter to all staff members",
  "department": "ADMIN",
  "priority": "LOW",
  "deadline": "2026-02-01T09:00:00"
}

Expected:
  Intent: COMMUNICATION
  Bot: EMAIL_BOT
  Risk Score: 0
  Risk Level: LOW
```

---

## Customization Guide

### Adding New Intent Types

**Location:** `EnhancedTaskService.java` → `detectIntent()` method

```java
// Add new intent
else if (description.contains("invoice") || description.contains("billing")) {
    task.setIntentType("INVOICE_PROCESSING");
    task.setAssignedBotType("INVOICE_BOT");
}
```

### Adjusting Risk Weights

**Location:** `EnhancedTaskService.java` → `calculateRiskScore()` method

```java
// Increase priority weight
if ("HIGH".equalsIgnoreCase(task.getPriority())) {
    score += 50; // Changed from 40
}

// Add new department
if ("EDUCATION".equalsIgnoreCase(task.getDepartment())) {
    score += 15; // New critical department
}
```

### Modifying Risk Thresholds

```java
// Change risk level boundaries
if (score > 80) {  // Changed from 75
    task.setRiskLevel("HIGH");
} else if (score > 50) {  // Changed from 40
    task.setRiskLevel("MEDIUM");
}
```

---

## API Response Examples

### Task Creation Response
```json
{
  "id": 1,
  "title": "Generate Health Report",
  "description": "Monthly health statistics",
  "department": "HEALTH",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "intentType": "REPORT_GENERATION",
  "assignedBotType": "REPORT_BOT",
  "riskScore": 90,
  "riskLevel": "HIGH",
  "risk_reason": "Critical: High priority with tight deadline",
  "uipathJobKey": "mock-job-xyz-123",
  "createdAt": "2026-01-26T20:00:00"
}
```

### Analytics Response
```json
{
  "totalTasks": 5,
  "pendingTasks": 1,
  "inProgressTasks": 2,
  "completedTasks": 2,
  "highRiskTasks": 1,
  "automatedTasks": 4
}
```

### High-Risk Tasks Response
```json
[
  {
    "id": 1,
    "title": "Generate Health Report",
    "riskScore": 90,
    "riskLevel": "HIGH",
    "status": "IN_PROGRESS",
    "intentType": "REPORT_GENERATION",
    "assignedBotType": "REPORT_BOT"
  }
]
```

---

## Audit Log Examples

### Task Creation
```
Entity Type: TASK
Entity ID: 1
Action: CREATED
New Value: PENDING
Performed By: staff41
Reason: Intent: REPORT_GENERATION, Risk: 90
Timestamp: 2026-01-26 20:00:00
```

### Status Change
```
Entity Type: TASK
Entity ID: 1
Action: STATUS_CHANGE
Old Value: PENDING
New Value: IN_PROGRESS
Performed By: staff41
Reason: Automation triggered
Timestamp: 2026-01-26 20:00:05
```

### Automation Trigger
```
Entity Type: AUTOMATION
Entity ID: 1
Action: BOT_TRIGGERED
New Value: REPORT_BOT | Job: mock-job-xyz-123
Performed By: SYSTEM
Reason: AI-driven automation triggered
Timestamp: 2026-01-26 20:00:05
```

---

**Use this reference to understand and customize the AI engine behavior.**
