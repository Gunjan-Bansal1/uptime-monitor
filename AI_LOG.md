# AI Collaboration Log

## Project

**Uptime Monitor**

This document records how AI assistants were used throughout the development of the Uptime Monitor MVP.

Every AI-generated suggestion was reviewed, tested, debugged, and validated before being integrated into the final implementation.

---

# AI Tech Stack

| Tool | Purpose |
|------|---------|
| ChatGPT (GPT-5.5) | Architecture guidance, debugging, backend implementation, frontend improvements, Docker troubleshooting, documentation |
| Antigravity | React UI refinements, JSX fixes, responsive layout improvements |

---

# How AI Was Used

AI was used as an engineering assistant throughout the development process. Rather than directly accepting generated code, each suggestion was reviewed, tested, and verified before integration.

The final implementation includes several manual improvements based on debugging and validation.

---

# The Prompts That Shipped It

Below are representative prompts that were used during development. These are not exhaustive but reflect the major AI-assisted implementation stages.

## 1. Backend API Development

### Prompt

> Create a FastAPI backend that allows users to register website URLs and expose REST APIs.

### Outcome

Implemented:

- FastAPI application
- CRUD APIs
- SQLAlchemy models
- SQLite persistence
- Pydantic schemas

---

## 2. Background Scheduler

### Prompt

> Schedule automatic health checks for all registered URLs.

### Outcome

Integrated APScheduler to periodically:

- Fetch all URLs
- Perform asynchronous HTTP requests
- Measure response time
- Store monitoring history

---

## 3. Health Monitoring Service

### Prompt

> Build an asynchronous monitoring service using httpx.

### Outcome

Implemented:

- Async HTTP requests
- Redirect handling
- Response time calculation
- Status code capture
- Exception handling for network failures

---

## 4. Dockerization

### Prompt

> Dockerize the frontend and backend using Docker Compose.

### Outcome

Created:

- Backend Dockerfile
- Frontend Dockerfile
- docker-compose.yml

---

## 5. React Dashboard

### Prompt

> Build a dashboard that displays monitored URLs and their latest health status.

### Outcome

Implemented:

- URL registration
- Status badges
- Response time
- Last checked timestamp
- Delete action
- Auto refresh

---

# The Course Corrections

---

## Issue 1

### Problem

Frontend could not communicate with backend inside Docker.

### Cause

Incorrect API base URL configuration.

### Resolution

Updated frontend configuration to correctly communicate with the backend container.

---

## Issue 2

### Problem

Port 8000 was already occupied by another Docker container.

### Resolution

Stopped the conflicting container and restarted the application.

---

## Issue 3

### Problem

Status Code was not displayed in the dashboard.

### Resolution

Updated the React table component to display the latest HTTP status code while preserving existing functionality.

---

## Issue 4

### Problem

Horizontal scrollbar reduced dashboard usability.

### Resolution

Adjusted component layout and spacing while maintaining responsiveness.

---

## Issue 5

### Problem

LinkedIn profile URLs appeared as DOWN despite being accessible in a browser.

### Investigation

Initially suspected a monitoring bug.

After testing with Swagger, database inspection, and additional endpoints, it was determined that LinkedIn returns HTTP 999 to automated clients as part of its anti-bot protection.

### Resolution

No code changes were required.

The monitoring service correctly reports the returned status code.

---

## Issue 6

### Problem

`httpstat.us/500` did not consistently return HTTP 500 inside the Docker environment.

### Investigation

Compared results with:

```
https://httpbin.org/status/500
```

### Resolution

Replaced the demo endpoint with `httpbin.org`, which consistently returned HTTP 500.

---

## Issue 7

### Problem

Need to communicate automatic monitoring to users.

### Resolution

Added:

- Last Updated timestamp
- Auto Refresh countdown timer

This improved the user experience without modifying backend logic.

---

# Validation Process

Every AI-generated change was verified through one or more of the following:

- FastAPI Swagger documentation
- Browser testing
- Docker container logs
- Database inspection
- React UI verification
- Scheduler execution
- API testing

No change was accepted without testing.

---

# Lessons Learned

Through this project I learned:

- Docker networking between frontend and backend
- FastAPI application structure
- Background scheduling using APScheduler
- Asynchronous HTTP monitoring
- React state management
- Debugging containerized applications
- Importance of validating AI-generated solutions
- Difference between HTTP errors and network failures
- Handling real-world cases such as LinkedIn's HTTP 999 response

---

# Reflection

AI significantly accelerated development by assisting with implementation ideas, debugging strategies, and documentation.

However, several issues required manual investigation and validation before reaching the final solution. Testing, debugging, and understanding the underlying behavior were essential to producing a reliable application.

This project reinforced the importance of using AI as a development assistant rather than a replacement for engineering judgment.

# Final Outcome

The final application satisfies all assignment requirements:

- Full-stack application
- FastAPI backend
- React frontend
- Docker Compose setup
- Automatic health monitoring
- REST APIs
- Deployment sketch
- AI collaboration log
- README with testing instructions