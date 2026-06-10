Apex Legal Backend API

Backend API powering the Apex Legal Case Management System. The platform is designed to help legal firms manage users, clients, cases, hearings, documents, audit trails, and automated hearing reminders.

---

Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- Cloudinary
- Node Cron
- Nodemailer

---

Base URL (Production)

https://apex-legal-1.onrender.com/api

Base URL (Local)

http://localhost:8080/api

---

Authentication

Protected routes require a JWT Bearer Token.

Example:

Authorization: Bearer YOUR_TOKEN

---

User Roles (RBAC)

Supported roles:

- admin
- lawyer
- Secretary
- Practice Manager
- Paralegal

Role-Based Access Control (RBAC) is enforced throughout the system to restrict access to sensitive operations.

---

Core Features

Authentication & Security

- User Registration
- User Login
- User Logout
- JWT Authentication
- Password Hashing (bcrypt)
- Forgot Password
- Password Reset
- User Deactivation
- User Reactivation
- Role-Based Access Control

Client Management

- Create Clients
- Update Clients
- Delete Clients
- Search Clients
- Client History Tracking

Case Management

- Create Cases
- Update Cases
- Delete Cases
- Case Status Updates
- Case Notes
- Search & Filtering
- Lawyer Assignment

Hearing Management

- Hearing Scheduling
- Hearing Status Tracking
- Hearing Updates
- Hearing Reminders

Document Management

- Cloudinary File Storage
- File Upload
- File Download
- File Preview (supported formats)
- SHA-256 Integrity Verification
- Case Linking

Audit Logging

Automatic tracking of:

- Login Activity
- Failed Login Attempts
- User Updates
- Client Operations
- Case Operations
- Hearing Operations
- Document Uploads
- Resource Access

Dashboard Analytics

- Total Users
- Total Clients
- Total Cases
- Total Hearings
- Open Cases
- Closed Cases
- Upcoming Hearings

Automated Scheduler

Automated hearing reminders:

- 30 Days Before Hearing
- 7 Days Before Hearing
- 3 Days Before Hearing
- 1 Day Before Hearing

Duplicate reminders are prevented through reminder tracking flags.

---

API ROUTES

---

USER ROUTES

Register User

POST /api/users/register

Sample Request

{
  "fullName": "John Doe",
  "email": "john.doe@apexlegal.com",
  "password": "Password123!",
  "role": "lawyer"
}

---

Login User

POST /api/users/login

Sample Request

{
  "email": "john.doe@apexlegal.com",
  "password": "Password123!"
}

---

Logout User

POST /api/users/logout

---

Forgot Password

POST /api/users/forgot-password

Sample Request

{
  "email": "john.doe@apexlegal.com"
}

---

Reset Password

POST /api/users/reset-password/:token

Sample Request

{
  "password": "NewPassword123!"
}

---

Get All Users

GET /api/users

Get Single User

GET /api/users/:id

Update User

PATCH /api/users/:id

Delete User

DELETE /api/users/:id

Deactivate User

PATCH /api/users/:id/deactivate

Reactivate User

PATCH /api/users/:id/reactivate

---

CLIENT ROUTES

Create Client

POST /api/clients/create

Sample Request

{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+2348012345678",
  "address": "Lagos, Nigeria"
}

Get All Clients

GET /api/clients

Get Single Client

GET /api/clients/:id

Update Client

PATCH /api/clients/:id

Delete Client

DELETE /api/clients/:id

Search Clients

GET /api/clients/search?q=john

---

CASE ROUTES

Create Case

POST /api/cases/create

Sample Request

{
  "title": "Property Ownership Dispute",
  "description": "Land ownership dispute between two parties.",
  "client": "CLIENT_ID",
  "assignedLawyer": "LAWYER_ID",
  "status": "Open"
}

Get All Cases

GET /api/cases

Get Single Case

GET /api/cases/:id

Update Case

PATCH /api/cases/:id

Delete Case

DELETE /api/cases/:id

Update Case Status

PATCH /api/cases/:id/status

Add Case Note

POST /api/cases/:id/notes

Sample Request

{
  "note": "Client submitted additional evidence for review."
}

Search Cases

GET /api/cases/search?q=land

Get Cases By Status

GET /api/cases/status/open

Get Cases By Client

GET /api/cases/client/:clientId

Get Lawyer Cases

GET /api/cases/lawyer/:lawyerId

---

DOCUMENT ROUTES

Upload Document

POST /api/documents/upload

Content Type

multipart/form-data

Fields

Field| Type
evidence| File
caseId| String
category| String
tag| String

Example

evidence = contract.pdf
caseId = CASE_ID
category = Corporate Law
tag = Contract Evidence

Get Documents By Case

GET /api/documents/case/:caseId

Get All Documents

GET /api/documents/all-raw

---

AUDIT ROUTES

Get Audit Logs

GET /api/audits

Get Login Activity

GET /api/audits/login-activity

Get Resource History

GET /api/audits/resource/:resourceId

---

Dashboard Routes

Dashboard Statistics

GET /api/dashboard/stats

Returns:

- Total Users
- Total Clients
- Total Cases
- Total Hearings
- Open Cases
- Closed Cases
- Upcoming Hearings

---

Environment Variables

Create a ".env" file:

PORT=8080

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email_address

EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

---

Run Locally

Install dependencies:

npm install

Run development server:

npm run dev

---

Deployment

Backend Hosting:

Render

Database:

MongoDB Atlas

Document Storage:

Cloudinary

---

Security Features

- JWT Authentication
- Role-Based Access Control
- Password Hashing
- Password Reset Tokens
- Account Deactivation
- Audit Logging
- File Integrity Verification (SHA-256)

---

Future Improvements

- Swagger API Documentation
- Rate Limiting
- Two-Factor Authentication
- Advanced Analytics Dashboard
- Case Reporting Exports

---

Authors

- Eroh Oghenemaro Divine
- Abdulrahmon Quadri Abiodun
- Olesegun Adeyemi

Apex Legal Backend System