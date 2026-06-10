# Apex Legal Backend API

Backend API for the Apex Legal Case Management System.

Apex Legal is a legal practice management platform designed to help law firms manage users, clients, cases, hearings, legal documents, audit trails, and automated hearing reminders.

---

# Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Multer
* Cloudinary
* Nodemailer
* Node Cron

---

# Base URL (Online)

```bash
https://apex-legal-1.onrender.com/api
```

# Base URL (Local)

```bash
http://localhost:8080/api
```

---

# Quick Start Testing

## 1. Register User

**POST**

```http
/api/users/register
```

### Sample Request

```json
{
  "fullName": "John Doe",
  "email": "john.doe@apexlegal.com",
  "password": "Password123!",
  "role": "lawyer"
}
```

---

## 2. Login User

**POST**

```http
/api/users/login
```

### Sample Request

```json
{
  "email": "john.doe@apexlegal.com",
  "password": "Password123!"
}
```

Copy the returned JWT and use:

```http
Authorization: Bearer YOUR_TOKEN
```

for all protected routes.

---

# Authentication

Protected routes require a JWT Bearer Token.

### Example

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
* JWT Authentication
* Forgot Password
* Password Reset
* User Deactivation & Reactivation
* Role-Based Access Control (RBAC)
* Client Management
* Case Management
* Hearing Management
* Automated Hearing Reminders
* Email Notifications
* Schedule Management
* Case Notes
* Cloudinary Document Storage
* Document Upload System
* Dashboard Analytics
* Audit Logging
* Case Search & Filtering
* SHA-256 File Integrity Verification

---

# API Routes

---

# USER ROUTES

## Register User

**POST**

```http
/api/users/register
```

### Sample Request

```json
{
  "fullName": "John Doe",
  "email": "john.doe@apexlegal.com",
  "password": "Password123!",
  "role": "lawyer"
}
```

---

## Login User

**POST**

```http
/api/users/login
```

### Sample Request

```json
{
  "email": "john.doe@apexlegal.com",
  "password": "Password123!"
}
```

---

## Forgot Password

**POST**

```http
/api/users/forgot-password
```

### Sample Request

```json
{
  "email": "john.doe@apexlegal.com"
}
```

---

## Reset Password

**POST**

```http
/api/users/reset-password/:token
```

### Sample Request

```json
{
  "password": "NewPassword123!"
}
```

---

## Get All Users

**GET**

```http
/api/users
```

---

## Get Single User

**GET**

```http
/ api/users/:id
```

---

## Update User

**PATCH**

```http
/api/users/:id
```

---

## Delete User

**DELETE**

```http
/api/users/:id
```

---

## Deactivate User

**PATCH**

```http
/api/users/:id/deactivate
```

---

## Reactivate User

**PATCH**

```http
/api/users/:id/reactivate
```

---

# CLIENT ROUTES

## Create Client

**POST**

```http
/api/clients/create
```

### Sample Request

```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+2348012345678",
  "address": "Lagos, Nigeria"
}
```

---

## Get All Clients

**GET**

```http
/api/clients
```

---

## Get Single Client

**GET**

```http
/api/clients/:id
```

---

## Update Client

**PATCH**

```http
/api/clients/:id
```

---

## Delete Client

**DELETE**

```http
/api/clients/:id
```

---

## Search Clients

**GET**

```http
/api/clients/search?q=john
```

---

# CASE ROUTES

## Create Case

**POST**

```http
/api/cases/create
```

### Sample Request

```json
{
  "title": "Property Ownership Dispute",
  "description": "Land ownership dispute between two parties.",
  "client": "CLIENT_ID",
  "assignedLawyer": "LAWYER_ID",
  "status": "Open"
}
```

---

## Get All Cases

**GET**

```http
/api/cases
```

---

## Get Single Case

**GET**

```http
/api/cases/:id
```

---

## Update Case

**PATCH**

```http
/api/cases/:id
```

---

## Delete Case

**DELETE**

```http
/api/cases/:id
```

---

## Update Case Status

**PATCH**

```http
/api/cases/:id/status
```

---

## Add Case Note

**POST**

```http
/api/cases/:id/notes
```

### Sample Request

```json
{
  "note": "Client submitted additional evidence for review."
}
```

---

## Search Cases

**GET**

```http
/api/cases/search?q=land
```

---

## Get Cases By Status

**GET**

```http
/api/cases/status/open
```

---

## Get Cases By Client

**GET**

```http
/api/cases/client/:clientId
```

---

## Get Lawyer Cases

**GET**

```http
/api/cases/lawyer/:lawyerId
```

---

# HEARING ROUTES

## Create Hearing

**POST**

```http
/api/hearings/create
```

### Sample Request

```json
{
  "caseId": "CASE_ID",
  "hearingDate": "2026-08-15",
  "location": "Lagos High Court",
  "notes": "Initial hearing session"
}
```

---

## Get All Hearings

**GET**

```http
/api/hearings
```

---

## Get Single Hearing

**GET**

```http
/api/hearings/:id
```

---

## Update Hearing

**PATCH**

```http
/api/hearings/:id
```

---

## Delete Hearing

**DELETE**

```http
/api/hearings/:id
```

---

# DOCUMENT ROUTES

## Upload Document

**POST**

```http
/api/documents/upload
```

### Content Type

```http
multipart/form-data
```

### Form Fields

```text
evidence = contract.pdf
caseId = CASE_ID
category = Corporate Law
tag = Contract Evidence
```

### Supported Categories

* Litigation
* Corporate Law
* Property Law
* Criminal Law
* Family Law
* Arbitration
* Internal Template
* Compliance

---

## Get Documents By Case

**GET**

```http
/api/documents/case/:caseId
```

---

## Get All Documents

**GET**

```http
/api/documents/all-raw
```

---

# DASHBOARD ROUTES

## Dashboard Statistics

**GET**

```http
/api/dashboard/stats
```

Provides:

* Total Users
* Total Clients
* Total Cases
* Total Hearings
* Open Cases
* Closed Cases
* Upcoming Hearings

---

# AUDIT ROUTES

## Get Audit Logs

**GET**

```http
/api/audits
```

---

## Get Login Activity

**GET**

```http
/api/audits/login-activity
```

---

## Get Resource History

**GET**

```http
/api/audits/resource/:resourceId
```

---

# Audit Features

System automatically logs:

* User Login Activity
* Failed Login Attempts
* User Updates
* Client Creation & Updates
* Case Creation & Updates
* Hearing Operations
* Case Notes
* Document Upload Activity
* Resource Access History

---

# Automated Reminder System

The system automatically sends hearing reminders:

* 30 Days Before Hearing
* 7 Days Before Hearing
* 3 Days Before Hearing
* 1 Day Before Hearing

Duplicate reminders are automatically prevented.

---

# Document Management

Documents are:

* Uploaded to Cloudinary
* Linked to Cases
* Protected by JWT Authentication
* Integrity Verified using SHA-256 Hashing
* Available for Preview (supported formats)
* Available for Download

### Supported Preview Formats

* Images (JPG, PNG, WEBP)
* PDFs

Non-previewable files (e.g., DOCX, XLSX, ACCDB) are securely downloaded.

---

# Security Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* Password Hashing (bcrypt)
* Password Reset Tokens
* Account Deactivation
* Audit Logging
* File Integrity Verification (SHA-256)

---

# Environment Variables

Create a `.env` file:

```env
PORT=8080

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# Run Locally

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# Deployment

## Backend Hosting

* Render

## Database

* MongoDB Atlas

## File Storage

* Cloudinary

---

# Future Improvements

* Swagger API Documentation
* Two-Factor Authentication
* Advanced Analytics Dashboard
* Rate Limiting & Security Hardening

---

# Authors

* Eroh Oghenemaro Divine
* Abdulrahmon Quadri Abiodun
* Olesegun Adeyemi

---

# Apex Legal Backend System
