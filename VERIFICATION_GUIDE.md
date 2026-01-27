# IACC Application Verification Guide

## ✅ Backend Status: RUNNING (Port 8081)
## ✅ Frontend Status: RUNNING (Port 5173)
## ✅ Authentication: WORKING
## ✅ UiPath Integration: CONFIGURED

---

## Test Credentials

### Pre-seeded Users (from DataInitializer):
1. **Collector**: 
   - Username: `collector41`
   - Password: `Test@1234`
   - Role: ROLE_COLLECTOR
   - Department: ADMIN

2. **Department Head**: 
   - Username: `test41`
   - Password: `Test@1234`
   - Role: ROLE_DEPT_HEAD
   - Department: REVENUE

3. **Staff**: 
   - Username: `staff41`
   - Password: `Test@1234`
   - Role: ROLE_STAFF
   - Department: HEALTH

4. **Automation Supervisor**: 
   - Username: `auto41`
   - Password: `Test@1234`
   - Role: ROLE_AUTO_SUPERVISOR
   - Department: TRANSPORT

### Test User (Created during verification):
- Username: `verifier_user`
- Password: `password123`
- Role: ROLE_COLLECTOR
- Department: REVENUE

---

## How to Access the Application

### Step 1: Open the Frontend
1. Open your browser
2. Navigate to: **http://localhost:5173**
3. You should see the login page

### Step 2: Login
1. Use any of the credentials above (recommended: `collector41` / `Test@1234`)
2. Click "Sign In"
3. You will be redirected to the Dashboard

### Step 3: Create a Task with UiPath Automation
1. On the Dashboard, click **"Create Task"** button
2. Fill in the form:
   - **Title**: "Generate Monthly Revenue Report"
   - **Description**: "Please generate the audit report for revenue department" (Keywords: "report", "audit" trigger automation)
   - **Priority**: High
   - **Department**: Revenue
3. Click **Submit**

### Step 4: Monitor Automation Status
1. Scroll down to the **"Live Automation Monitor"** section on the Dashboard
2. You should see your task appear with:
   - Task Title
   - Assigned Bot Type (e.g., "Data Processing Bot")
   - Status (Pending → Running → Successful/Faulted)
3. The monitor auto-refreshes every 10 seconds

### Step 5: Retry Failed Jobs (if needed)
1. If a job shows status "Faulted" or "Failed"
2. Click the **⚡ Retry** button next to the task
3. The system will re-trigger the UiPath automation

---

## UiPath Configuration Summary

### Current Settings (application.properties):
```
uipath.orchestrator.url=https://cloud.uipath.com/hindustaninstituteoftechnologycoimbatore/DefaultTenant/orchestrator_
uipath.auth.url=https://cloud.uipath.com/identity_/connect/token
uipath.account.logicalname=hindustaninstituteoftechnologycoimbatore
uipath.tenant.logicalname=DefaultTenant
uipath.client.id=4dc191ea-234f-424d-bc2f-7c94c339273e
uipath.client.secret=jYUe?tqhBW7VeTUtiN7oDqOMzltVMo1WCMZLMjAUV_M5x2J4Gqb2pGLFs2DtcN21
uipath.release.key=rt_512A1634BA1032862612977DE918BD4AF4E4C365C48D319A6383F49D0FBC49E6-1
uipath.folder.id=5239124
```

### How Automation Works:
1. **Task Classification**: When a task is created, `TaskRoutingService` analyzes the description
2. **Bot Assignment**: Based on keywords (e.g., "report", "audit", "data"), it assigns a bot type
3. **UiPath Trigger**: `UiPathService.triggerBot()` calls the Orchestrator API to start the job
4. **Status Polling**: A scheduled task runs every 30 seconds to update job statuses
5. **Frontend Display**: The Automation Monitor shows real-time status

---

## API Endpoints (for testing)

### Authentication:
- **POST** `/api/auth/signin` - Login
- **POST** `/api/auth/signup` - Register new user

### Tasks:
- **GET** `/api/tasks` - Get all tasks
- **POST** `/api/tasks/create-task-ai` - Create task with AI classification
- **GET** `/api/tasks/automation/status` - Get automation job statuses
- **POST** `/api/tasks/{id}/retry` - Retry failed automation

---

## Troubleshooting

### If login fails:
- Check that backend is running on port 8081
- Verify credentials are correct
- Check browser console for errors

### If automation doesn't trigger:
- Verify UiPath credentials in `application.properties`
- Check that the Release Key is valid in your UiPath Orchestrator
- Look at backend logs (`run_log_9.txt`) for UiPath API errors

### If frontend doesn't load:
- Ensure `npm run dev` is running
- Check that port 5173 is not blocked
- Clear browser cache and reload

---

## Next Steps

1. **Test the full flow** using the steps above
2. **Monitor UiPath Orchestrator** to see jobs being triggered
3. **Check the Automation Monitor** for real-time status updates
4. **Try the Retry feature** if any jobs fail

---

**Note**: The application is now fully configured and ready for testing. Both backend and frontend are running successfully with real UiPath integration enabled.
