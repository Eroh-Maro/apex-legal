# Apex Legal Backend API

Backend API for the Apex Legal Case Management System.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* bcryptjs

---

# Base URL

```txt
http://localhost:8080/api
```

---

# Authentication

Protected routes require JWT Bearer Token.

Example:

```http
Authorization: Bearer YOUR_TOKEN
```

---

# User Roles

Supported RBAC roles:

* admin
* lawyer
* Secretary
* Practice Manager
* Paralegal

---

# Features

* User Authentication & Authorization
* Role-Based Access Control (RBAC)
* Client Management
* Case Management
* Case Notes
* Document Upload System
* Audit Logging
* Case Search & Filtering

---

# API Routes

---

# USER ROUTES

## Register User

```http
POST /api/users/register
```

## Login User

```http
POST /api/users/login
```

## Get All Users

```http
GET /api/users
```

## Get Single User

```http
GET /api/users/:id
```

## Update User

```http
PATCH /api/users/:id
```

## Delete User

```http
DELETE /api/users/:id
```

---

# CLIENT ROUTES

## Create Client

```http
POST /api/clients
```

## Get All Clients

```http
GET /api/clients
```

## Get Single Client

```http
GET /api/clients/:id
```

## Update Client

```http
PATCH /api/clients/:id
```

## Delete Client

```http
DELETE /api/clients/:id
```

## Search Clients

```http
GET /api/clients/search?q=john
```

---

# CASE ROUTES

## Create Case

```http
POST /api/cases
```

## Get All Cases

```http
GET /api/cases
```

## Get Single Case

```http
GET /api/cases/:id
```

## Update Case

```http
PATCH /api/cases/:id
```

## Delete Case

```http
DELETE /api/cases/:id
```

## Update Case Status

```http
PATCH /api/cases/:id/status
```

## Add Case Note

```http
POST /api/cases/:id/notes
```

## Search Cases

```http
GET /api/cases/search?q=land
```

## Get Cases By Status

```http
GET /api/cases/status/open
```

## Get Cases By Client

```http
GET /api/cases/client/:clientId
```

## Get Lawyer Cases

```http
GET /api/cases/lawyer/:lawyerId
```

---

# DOCUMENT ROUTES

## Upload Document

```http
POST /api/documents/upload
```

## Get Documents By Case

```http
GET /api/documents/case/:caseId
```

## Get All Documents

```http
GET /api/documents
```

---

# AUDIT ROUTES

## Get Audit Logs

```http
GET /api/audits
```

## Get Login Activity

```http
GET /api/audits/login-activity
```

## Get Resource History

```http
GET /api/audits/resource/:resourceId
```

---

# Audit Features

System automatically logs:

* User Login Activity
* Failed Login Attempts
* User Updates
* Client Creation & Updates
* Case Creation & Updates
* Case Notes
* Document Upload Activity
* Resource Access History

---

# Environment Variables

Create a `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

 # Run Locally

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

---

# Future Improvements

* Hearing Management
* Reminder & Notification System
* Cloudinary / AWS S3 Integration
* Swagger API Documentation
* Advanced Analytics Dashboard
* Email Notifications
* Rate Limiting & Security Hardening

---

# Author
Eroh oghnemaro divine
Olesgun Adeyemi
Abdulrahmon Quadri Abiodun
Apex Legal Backend System
