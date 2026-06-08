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
* cors
* dotenv
* cron
* nodemailer
* morgan
* helmet
* cloudinary
* jsonwebtoken
* nodemon



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

# Environment Variables

Create a `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

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


# User Features

System automatically manages and enforces:

* Authentication Gateway: Publicly accessible endpoints for user onboarding (/register) and session generation (/login).

* Profile Modification: Dynamic update capability that permits users to modify their own profiles while granting Admin accounts overriding permission to update any profile.

* Granular Role-Based Access Control (RBAC): * Administrative oversight functions—such as fetching the master directory of all registered users or executing a hard deletion of a user record—are strictly restricted to the Admin role.

* Targeted Information Retrieval: Allows any authenticated user to view details for an individual profile by its unique ID.

* Route Protection: Secures all sensitive account management and retrieval pipelines behind an authentication checkpoint, requiring a verified login for access.
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

# CLIENT ROUTES

System automatically manages and enforces:

* Client Creation: Secure onboarding entry point for registering new client profiles into the system.

* Role-Based Access Control (RBAC): Restricts client creation capability exclusively to authorized Admin, Lawyer, and Secretary roles.

* Route Protection: Enforces strict authentication verification to guarantee that only logged-in system staff can access the client creation endpoint.
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

# Case Features

System automatically manages and enforces:

* Comprehensive Case Management: Full CRUD pipeline tailored for legal case files, including specialized status updates and ongoing case documentation/notes.

* Advanced Querying & Filtering: Dedicated endpoints to search through cases or filter records dynamically by client, assigned lawyer, or current case status.

* Granular Role-Based Access Control (RBAC): * Creation, modification, status updates, and note-taking are strictly restricted to authorized Admin and Lawyer roles.

* Hard deletion of a case record is highly restricted and can only be performed by an Admin.

* Route Protection: Complete authentication guard ensuring all endpoints require a valid user session to view or interact with case data.

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

# Document Features

System automatically handles and manages:

* File Upload Processing: In-memory storage management via Multer.

* File Size Validation: Automated enforcement of a 25MB file size limit to prevent buffer overloads.

* Evidence Uploads: Secure POST endpoint accepting a single file field named evidence.

* Case-Specific Retrieval: Fetching of all document records associated with a specific case ID.

* Unrestricted Raw Access: Public or internal route to retrieve all raw document metadata.

* Route Protection: Access control ensuring only authenticated users can upload or view case documents.
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

# DASHBOARD ROUTES

```http
GET /api/dashboard/stats
```

```http
GET /api/dashboard/upcoming-hearings
```

```http
GET /api/dashboard/recent-cases
```

# Dashboard Features

System automatically tracks and displays:

* Dashboard Statistics (Overview metrics)
* Upcoming Case Hearings
* Recently Created or Updated Cases
* Authenticated Route Protection (Requires valid user login)

---

# DOCUMENT ROUTES
 Get All Documents (Raw)


 ```http
 GET /api/documents/all-raw
```

```http
POST /api/documents/upload
```

```http
GET /api/documents/case/:caseId
```


# Document Features

System automatically handles and manages:

* File Upload Processing: In-memory storage management via Multer.

* File Size Validation: Automated enforcement of a 25MB file size limit to prevent buffer overloads.

* Evidence Uploads: Secure POST endpoint accepting a single file field named evidence.

* Case-Specific Retrieval: Fetching of all document records associated with a specific case ID.

* Unrestricted Raw Access: Public or internal route to retrieve all raw document metadata.

* Route Protection: Access control ensuring only authenticated users can upload or view case documents.

# HEARING ROUTES

Create Hearing

```http
POST /api/hearings/create
```

```http
GET /api/hearings
```

```http
GET /api/hearings/case/:caseId
```

```http
GET /api/hearings/:id
```

```http
POST /api/hearings/:id/notes
```

```http
PATCH /api/hearings/:id
```

```http
DELETE /api/hearings/:id
```

# Hearing Features

System automatically manages and enforces:

* CRUD Operations: Full lifecycle management for legal hearings (Creation, Retrieval, Updates, and Deletion).

* Case Association: Ability to filter and retrieve all scheduled hearings tied to a specific case file.

* Hearing Documentation: Specialized endpoint to append case notes directly to a specific hearing instance.

* Role-Based Access Control (RBAC): Restricts high-privilege actions (creating, updating, deleting, and adding notes) exclusively to authorized Secretary and Lawyer roles.

* Route Protection: Global authentication checkpoint ensuring only logged-in users can query hearing information.



# REMINDER ROUTES

Create Reminder

 ```http
 POST /api/reminders
```

 ```http
GET /api/reminders
```

 ```http
 GET /api/reminders/:id
```

 ```http
 DELETE /api/reminders/:id
```

# Reminder Features

System automatically manages and enforces:

* Lifecycle Management: Dedicated endpoints for scheduling, retrieving, and removing system reminders.

* Role-Based Access Control (RBAC): Restricts data-altering actions (creating and deleting reminders) exclusively to authorized Secretary and Lawyer roles.

* Targeted Retrieval: Supports fetching a complete list of reminders or drilling down into a single reminder by its unique ID.

* Route Protection: Ensures all reminder endpoints require a valid, authenticated user session before granting access.

# TEST EMAIL ROUTES

Send Test Email

 ```http
POST /api/test-email
```

# Test Email Features

System automatically manages and enforces:

* Email Dispatch Testing: Provides a dedicated endpoint to trigger and validate outward email server configurations.

* Route Protection: Secures the testing capability behind an authentication checkpoint, requiring a valid user login to prevent unauthorized email generation.








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
* AI legal drafting
* Court e-filing integrations
* Smart Notifications & Scheduling
* Video conferencing
* WhatApp notifications
* Time tracking
* client portal

---

# Architectural Breakdown
# config

* Purpose: Configuration Layer.

* Role: This folder holds configuration files for the application. This typically includes database connection setups (e.g., Mongoose/Sequelize initializations), third-party API configurations (like Stripe or AWS), and environment variable initializations.

# controllers

* Purpose: HTTP Request Handlers (Business Logic Gateway).

* Role: Controllers handle the incoming HTTP requests from the client. They extract data from parameters or request bodies, call the necessary business logic or database operations, and return the appropriate HTTP response (e.g., 200 OK with JSON data, or a 400 Bad Request error).

# middleware

* Purpose: Interceptor / Pipeline Layer.

* Role: Functions that execute before a request reaches your controllers. Common examples in this folder include:

Authentication/Authorization checks (e.g., verifying JWT tokens).

Request validation (ensuring required fields are present).

Centralized error-handling middleware.

Logging or rate-limiting.


# models
* Purpose: Data Access & Schema Layer.

* Role: Defines the data structures, schemas, and relationships for your database (e.g., User, Case, Document schemas if this is a legal app). It communicates directly with your database management system via an ORM/ODM like Mongoose, Sequelize, or Prisma.

# utils
* Purpose: Helper / Utility Layer.

* Role: Houses reusable, standalone helper functions that don't belong to a specific business domain. Examples include custom date formatters, token generators, password hashing utilities, or email sending wrappers.


# Root Files (server.js, package.json, etc.)
* server.js: The entry point of your application. It spins up the Express/Node server, initializes database connections, attaches global middleware (like CORS or JSON parsers), and mounts the main router.

* package.json & package-lock.json: Node.js manifest files managing your project dependencies and scripts.

* .gitignore: Ensures local configurations, dependencies (node_modules), and secrets (.env) aren't pushed to version control.

# Author
Eroh oghnemaro divine
Olesgun Adeyemi
Abdulrahmon Quadri Abiodun
Apex Legal Backend System
