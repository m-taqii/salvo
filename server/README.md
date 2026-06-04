# Salvo Backend API

The Salvo backend is built with Express, TypeScript, and Bun. It handles authentication, database logging, CSV parsing, and the core AI agent logic that generates the emails.

## Environment Variables

Create a `.env` file in the root of the `server` directory:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/salvo
JWT_SECRET=your_super_secret_string
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.groq.com/openai/v1 # Optional: Override base URL for Groq/Local LLMs
RESEND_API_KEY=your_resend_api_key
```

## AI Agent Logic (`/src/agents/drafting.agent.ts`)

The core of Salvo is the `emailAgent`. When an email is dispatched, the agent receives:
1. **The Lead**: Specific data from the CSV row (Name, Company, Pain points).
2. **The Sender Context**: The authenticated user's name, description, and website.
3. **The Intent**: The specific goal of the campaign.

The LLM is strictly prompted to write short (3 sentence), conversational emails without buzzwords, em-dashes, or robotic fluff. The response is strictly enforced as JSON to extract the `subject` and `content`.

## API Endpoints

All endpoints except `/api/auth/login` and `/api/auth/register` require authentication via an HTTP-only JWT cookie (`token`).
All successful responses return a `200` or `201` status code with the shape `{ "status": "success", "response": { ... } }`.
Errors return a `500` (or `400`/`401`) with `{ "status": "error", "response": { "error": "Message" } }`.

### Authentication (`/api/auth`)

#### 1. Register a new user
**`POST /api/auth/register`**
Creates a new user and sets the HTTP-only JWT cookie.
- **Request Body** (JSON):
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@company.com",
    "password": "securepassword",
    "description": "B2B SaaS optimizing workflows", // Optional
    "website": "https://company.com" // Optional
  }
  ```
- **Response**: Returns the created user object (excluding the password if configured).

#### 2. Login
**`POST /api/auth/login`**
Authenticates the user and sets the HTTP-only JWT cookie.
- **Request Body** (JSON):
  ```json
  {
    "email": "jane@company.com",
    "password": "securepassword"
  }
  ```
- **Response**: Returns the authenticated user object.

#### 3. Get Current User
**`GET /api/auth/me`**
Validates the JWT cookie and returns the user data.
- **Request**: No body required. Requires `token` cookie.
- **Response**: Returns the authenticated user object.

#### 4. Logout
**`POST /api/auth/logout`**
Clears the JWT cookie from the client.

---

### Email & Leads (`/api`)

#### 1. Bulk AI Email Sender
**`POST /api/send`**
Parses a CSV of leads, generates AI emails based on the sender's context + intent, and dispatches them.
- **Request**: `multipart/form-data`
  - `attachment` (File): The `.csv` file. Must include columns: `Name, Company, Service, City, Email, Description, Website`.
  - `intent` (String): e.g., "Pitching our SEO services".
  - `systemPrompt` (String, Optional): Overrides the default LLM persona.
- **Response**:
  ```json
  {
    "status": "success",
    "response": "Emails are being processed in the background."
  }
  ```

#### 2. Manual Send
**`POST /api/send-manual`**
Sends a single, hardcoded email to a recipient without using AI, and logs it to the DB.
- **Request Body** (JSON):
  ```json
  {
    "to": "lead@target.com",
    "subject": "Quick question",
    "content": "Hi there, would you be open to a 10 min call?"
  }
  ```
- **Response**: Returns the saved `Email` log document.

#### 3. Fetch Leads History
**`GET /api/leads`**
Fetches all emails (sent, pending, or failed) associated with the logged-in user.
- **Request**: No body required. Requires `token` cookie.
- **Response**:
  ```json
  {
    "status": "success",
    "response": [
      {
        "_id": "64a2b...",
        "to": "lead@target.com",
        "from": "jane@company.com",
        "subject": "Quick question",
        "content": "Hi there...",
        "status": "sent",
        "createdAt": "2026-06-04T12:00:00.000Z"
      }
    ]
  }
  ```
## Database Models

- **User**: Stores credentials and business context (`description`, `website`).
- **Email**: Logs every attempt by the AI. Tracks `to`, `from`, `subject`, `content`, and `status` (`sent`, `failed`, `pending`).
