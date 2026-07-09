# Uptime Monitor

A lightweight full-stack Uptime Monitoring application that periodically checks the health of registered websites and displays their latest status in a real-time dashboard.

The application allows users to register website URLs, automatically performs health checks at fixed intervals, stores monitoring history, and visualizes the latest monitoring results including HTTP status code, response time, and last checked timestamp.

---

## Features

### Backend
- Register website URLs
- Delete monitored URLs
- Automatic health checks using APScheduler
- HTTP status monitoring
- Response time measurement
- SQLite database for persistence
- REST APIs using FastAPI
- Interactive API documentation using Swagger UI

### Frontend
- Register new URLs
- View all monitored targets
- Live UP/DOWN status
- HTTP Status Code display
- Response Time display
- Last Checked timestamp
- Auto-refresh countdown
- Delete monitored URLs
- Responsive dashboard

### Infrastructure
- Dockerized backend
- Dockerized frontend
- Docker Compose support
- One-command application startup

---

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- APScheduler
- httpx
- Pydantic

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### DevOps
- Docker
- Docker Compose

---

## Project Structure

```
uptime-monitor/
│
├── backend/
│   ├── app/
│   ├── scheduler/
│   ├── services/
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│
├── docker-compose.yml
├── README.md
└── AI_LOG.md
```

---

## Architecture

```
                    +----------------------+
                    |      React UI        |
                    +----------+-----------+
                               |
                               |
                     REST API (Axios)
                               |
                               ▼
                    +----------------------+
                    |   FastAPI Backend    |
                    +----------+-----------+
                               |
               +---------------+---------------+
               |                               |
               ▼                               ▼
      APScheduler                   SQLite Database
               |
               ▼
      HTTP Health Checks
               |
               ▼
      Registered Websites
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>

cd uptime-monitor
```

### Start the application

```bash
docker compose up --build
```

---

## Application URLs

Frontend

```
http://localhost:5173
```

Backend API

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/urls` | List all monitored URLs |
| POST | `/urls` | Register a new URL |
| DELETE | `/urls/{url_id}` | Delete a monitored URL |
| GET | `/health` | Health check endpoint |

---

## Example Test URLs

### Healthy Website

```
https://www.instagram.com/
```

Expected

- Status: UP
- Status Code: 200

---

### HTTP Server Error

```
https://httpbin.org/status/500
```

Expected

- Status: DOWN
- Status Code: 500

---

### DNS Failure

```
https://this-domain-does-not-exist-12345.invalid/
```

Expected

- Status: DOWN
- Status Code: —

---

### LinkedIn Profile

```
https://www.linkedin.com/in/your-profile
```

Expected

- Status Code: 999 (LinkedIn anti-bot protection may return a non-standard status)

---

## Screenshots

### Dashboard

![Dashboard](<Docs/Dashboard.png>)

### Swagger API

![Swagger](<Docs/swagger.png>)

### Docker Desktop

![Docker Desktop](<Docs/Docker-Desktop.png>)

### Running Containers

![Docker Container running](<Docs/Docker-Container-running.png>)
---

## Deployment Sketch

For production deployment, the architecture can be extended as follows:

```
                Internet
                    │
                    ▼
          Load Balancer (Nginx)
                    │
                    ▼
            FastAPI Application
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
 APScheduler                 PostgreSQL
      │
      ▼
 Registered Websites
```

### Deployment Note

The current implementation is designed for local development using Docker Compose and SQLite.

For a production deployment, the React frontend would be served behind an Nginx load balancer, while the FastAPI backend would run inside Docker containers. SQLite would be replaced with PostgreSQL for improved reliability and scalability. APScheduler would continue performing periodic health checks, and the application could be hosted on a cloud platform such as AWS, Azure, or Google Cloud with HTTPS enabled through the load balancer.

---

## Future Improvements

- Email notifications
- Slack/Discord alerts
- Historical uptime analytics
- SSL certificate monitoring
- Authentication and user management
- Multiple monitoring intervals
- Retry mechanism
- Dashboard filtering and search
- Cloud deployment (AWS/GCP/Azure)
- Redis-based task queue

---

## AI Usage

AI was used as a development assistant for architecture discussions, debugging, frontend and backend implementation, Docker configuration, and documentation.

All AI-generated suggestions were reviewed, tested, and validated before being integrated into the project.

A detailed record of the AI-assisted development process, including prompts, debugging, validation, and engineering decisions, is available in **AI_LOG.md**.

---

## Author

Gunjan Bansal

M.Sc Data Science

IIIT Lucknow
