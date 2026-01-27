# UiPath Integration Guide for IACC

## 🎯 Current Status

Your IACC system is **READY** for UiPath integration! The backend code is already configured to connect to UiPath Cloud.

### ✅ What's Already Configured:

**UiPath Cloud Connection Details (in `application.properties`):**
- **Organization**: hindustaninstituteoftechnologycoimbatore
- **Tenant**: DefaultTenant
- **Orchestrator URL**: https://cloud.uipath.com/.../orchestrator_
- **Client ID**: 4dc191ea-234f-424d-bc2f-7c94c339273e
- **Client Secret**: jYUe?tqhBW7VeTUtiN7oDqOMzltVMo1WCMZLMjAUV_M5x2J4Gqb2pGLFs2DtcN21
- **Folder ID**: 5239124
- **Release Key**: rt_512A1634BA1032862612977DE918BD4AF4E4C365C48D319A6383F49D0FBC49E6-1

---

## 📋 What You Need to Do on UiPath Side

### **Step 1: Create Bot Processes in UiPath Studio**

You need to create automation processes for each bot type used in IACC:

#### **Bot Types in IACC:**
1. **REPORT_BOT** - Generates reports
2. **APPROVAL_BOT** - Handles approval workflows
3. **DATA_ENTRY_BOT** - Performs data entry tasks
4. **EMAIL_BOT** - Sends emails/notifications

#### **Creating a Simple Bot (Example: REPORT_BOT):**

1. **Open UiPath Studio**
2. **Create New Process** → Name it: `IACC_ReportBot`
3. **Add Activities:**
   ```
   Main.xaml:
   ├── Log Message: "Report Bot Started"
   ├── Assign: reportData = "Monthly Revenue Report Generated"
   ├── Write Text File: Save report to output folder
   ├── Log Message: "Report Bot Completed Successfully"
   └── End
   ```

4. **Add Input Arguments** (Optional):
   - `in_TaskID` (String) - Task ID from IACC
   - `in_TaskTitle` (String) - Task title
   - `in_Department` (String) - Department name

5. **Add Output Arguments** (Optional):
   - `out_Result` (String) - "Success" or "Failed"
   - `out_FilePath` (String) - Path to generated report

6. **Save and Publish**

---

### **Step 2: Publish to UiPath Orchestrator Cloud**

1. **In UiPath Studio:**
   - Click **Publish** button
   - Select **Orchestrator**
   - Choose your tenant: `DefaultTenant`
   - Choose folder: Your folder (ID: 5239124)
   - Click **Publish**

2. **Verify in Orchestrator:**
   - Go to: https://cloud.uipath.com/hindustaninstituteoftechnologycoimbatore/DefaultTenant/orchestrator_
   - Navigate to **Automations** → **Processes**
   - You should see `IACC_ReportBot` listed

---

### **Step 3: Create Releases in Orchestrator**

For each bot process:

1. **Go to Orchestrator** → **Automations** → **Processes**
2. **Click on your process** (e.g., IACC_ReportBot)
3. **Create Release:**
   - Click **Create Release**
   - Name: `IACC_ReportBot_v1`
   - Description: "Report generation bot for IACC"
   - Click **Create**

4. **Copy the Release Key:**
   - After creating, you'll see a **Release Key** (looks like: `rt_ABC123...`)
   - **IMPORTANT**: Copy this key!

---

### **Step 4: Update IACC Configuration**

Update `application.properties` with your release keys:

```properties
# For REPORT_BOT
uipath.release.key.report=rt_YOUR_REPORT_BOT_RELEASE_KEY

# For APPROVAL_BOT
uipath.release.key.approval=rt_YOUR_APPROVAL_BOT_RELEASE_KEY

# For DATA_ENTRY_BOT
uipath.release.key.dataentry=rt_YOUR_DATA_ENTRY_BOT_RELEASE_KEY

# For EMAIL_BOT
uipath.release.key.email=rt_YOUR_EMAIL_BOT_RELEASE_KEY
```

---

### **Step 5: Set Up Robots (Unattended)**

1. **In Orchestrator** → **Tenant** → **Robots**
2. **Create Robot:**
   - Name: `IACC_Worker_01`
   - Type: **Unattended**
   - Machine: Select your machine or create new
   - Folder: Select your folder (5239124)

3. **Assign Robot to Folder:**
   - Go to **Folders** → Your folder
   - Click **Robots** tab
   - Add `IACC_Worker_01`

---

## 🔧 How IACC Triggers UiPath Bots

### **Automatic Workflow:**

```
1. Staff creates task in IACC
   ↓
2. AI classifies task → Assigns bot type (e.g., REPORT_BOT)
   ↓
3. Dept Head approves task
   ↓
4. IACC Backend calls UiPath API:
   - POST /odata/Jobs/UiPath.Server.Configuration.OData.StartJobs
   - Sends Release Key
   - UiPath starts the bot
   ↓
5. Bot executes in UiPath Cloud
   ↓
6. IACC polls for status every 30 seconds
   - GET /odata/Jobs({jobKey})
   ↓
7. When bot completes:
   - Status: "Successful" → Task status: COMPLETED
   - Status: "Faulted" → Task status: FAILED
```

---

## 🧪 Testing the Integration

### **Method 1: Test from IACC**

1. **Create a task** in IACC Staff Portal
2. **Dept Head approves** the task
3. **Check UiPath Orchestrator:**
   - Go to **Jobs** section
   - You should see a new job running
   - Status will be: Pending → Running → Successful/Faulted

### **Method 2: Test Manually in Orchestrator**

1. **Go to Orchestrator** → **Jobs**
2. **Click "Start Job"**
3. **Select your process** (e.g., IACC_ReportBot)
4. **Click "Start"**
5. **Monitor the job** execution

---

## 📊 Where to See Bot Execution

### **In UiPath Cloud Orchestrator:**

1. **Jobs Dashboard:**
   - URL: `https://cloud.uipath.com/.../orchestrator_/jobs`
   - Shows all running/completed jobs
   - Real-time status updates

2. **Job Details:**
   - Click on any job to see:
     - Start time
     - End time
     - Status (Pending/Running/Successful/Faulted)
     - Logs
     - Screenshots (if enabled)

3. **Logs:**
   - Each job has detailed logs
   - Shows all "Log Message" activities from your bot
   - Error messages if bot fails

### **In IACC Dashboards:**

1. **Automation Supervisor Dashboard** (`/active-monitoring`):
   - Login as: `auto41` / `Test@1234`
   - Shows all automation jobs
   - Real-time status monitoring

2. **Collector Dashboard** (`/admin-dashboard`):
   - Shows task status
   - High-risk escalations
   - System activity logs

---

## 🎨 Simple Bot Templates

### **Template 1: Report Bot**

```xml
<Sequence DisplayName="IACC Report Bot">
  <Sequence.Variables>
    <Variable x:TypeArguments="x:String" Name="reportContent" />
  </Sequence.Variables>
  
  <LogMessage Message="[IACC] Report Bot Started - Task: [in_TaskID]" />
  
  <Assign>
    <Assign.To>
      <OutArgument x:TypeArguments="x:String">[reportContent]</OutArgument>
    </Assign.To>
    <Assign.Value>
      <InArgument x:TypeArguments="x:String">"Report generated for: " + in_Department</InArgument>
    </Assign.Value>
  </Assign>
  
  <WriteTextFile Text="[reportContent]" FileName="C:\Reports\report_[in_TaskID].txt" />
  
  <LogMessage Message="[IACC] Report Bot Completed Successfully" />
  
  <Assign>
    <Assign.To>
      <OutArgument x:TypeArguments="x:String">[out_Result]</OutArgument>
    </Assign.To>
    <Assign.Value>
      <InArgument x:TypeArguments="x:String">"Success"</InArgument>
    </Assign.Value>
  </Assign>
</Sequence>
```

### **Template 2: Email Bot**

```xml
<Sequence DisplayName="IACC Email Bot">
  <LogMessage Message="[IACC] Email Bot Started" />
  
  <SendMail>
    <SendMail.To>
      <InArgument x:TypeArguments="x:String">"recipient@example.com"</InArgument>
    </SendMail.To>
    <SendMail.Subject>
      <InArgument x:TypeArguments="x:String">"Task Notification: " + in_TaskTitle</InArgument>
    </SendMail.Subject>
    <SendMail.Body>
      <InArgument x:TypeArguments="x:String">"Task has been processed successfully."</InArgument>
    </SendMail.Body>
  </SendMail>
  
  <LogMessage Message="[IACC] Email Sent Successfully" />
</Sequence>
```

---

## 🔐 Security & Authentication

Your configuration uses **OAuth 2.0 Client Credentials**:

- **Client ID**: Used to identify your application
- **Client Secret**: Password for authentication
- **Token Endpoint**: `https://cloud.uipath.com/identity_/connect/token`

**IACC automatically:**
1. Requests access token from UiPath
2. Uses token to authenticate API calls
3. Refreshes token when expired

---

## 🚀 Quick Start Checklist

- [ ] **Create at least one bot** in UiPath Studio (e.g., REPORT_BOT)
- [ ] **Publish bot** to Orchestrator
- [ ] **Create release** and copy release key
- [ ] **Update** `application.properties` with release key
- [ ] **Set up unattended robot** in Orchestrator
- [ ] **Restart IACC backend** to load new config
- [ ] **Test**: Create task in IACC → Approve → Check Orchestrator Jobs

---

## 📝 Example: Complete Setup for REPORT_BOT

### **1. UiPath Studio:**
```
Create new process: IACC_ReportBot
Add Main.xaml with simple workflow
Publish to Orchestrator
```

### **2. Orchestrator:**
```
Create Release: IACC_ReportBot_v1
Copy Release Key: rt_ABC123XYZ...
```

### **3. application.properties:**
```properties
uipath.release.key=rt_ABC123XYZ...
```

### **4. Test:**
```
1. Login to IACC as staff41
2. Create task: "Generate Monthly Revenue Report"
3. Login as test41 (Dept Head)
4. Approve the task
5. Check UiPath Orchestrator → Jobs
6. See your bot running!
```

---

## 🎯 Current Bot Mapping in IACC

| Task Keywords | Bot Type | UiPath Process Name (Suggested) |
|---------------|----------|--------------------------------|
| "report", "generate" | REPORT_BOT | IACC_ReportBot |
| "approval", "approve" | APPROVAL_BOT | IACC_ApprovalBot |
| "data entry", "input" | DATA_ENTRY_BOT | IACC_DataEntryBot |
| "email", "send", "notify" | EMAIL_BOT | IACC_EmailBot |

---

## ❓ FAQ

**Q: Do I need UiPath Assistant?**
A: No, for cloud automation you only need UiPath Orchestrator Cloud. Assistant is for attended bots.

**Q: Can I test without creating bots?**
A: Currently, the system will try to call UiPath API. If no bot exists, the job will fail but IACC will handle it gracefully.

**Q: How do I see bot execution logs?**
A: In Orchestrator → Jobs → Click on job → View Logs tab

**Q: Can I use UiPath Community Edition?**
A: Yes! Your credentials appear to be for UiPath Cloud (Community or Enterprise).

---

## 🎉 Summary

**You have:**
- ✅ UiPath Cloud account configured
- ✅ Backend code ready to integrate
- ✅ API authentication set up
- ✅ Automatic job triggering implemented

**You need:**
- 📝 Create bot processes in UiPath Studio
- 📤 Publish to Orchestrator
- 🔑 Update release keys in config
- 🤖 Set up unattended robots

**Once done, bots will automatically run when tasks are approved in IACC!** 🚀
