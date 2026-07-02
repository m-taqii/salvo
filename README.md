# Salvo

Salvo is a full-stack, AI-powered cold email automation engine. It allows users to upload spreadsheets of leads and leverages Large Language Models (LLMs) to generate highly personalized, human-sounding cold emails tailored to each lead and the sender's business context.

## Project Architecture

Salvo is a monorepo consisting of two main pieces:

- **Client (`/client`)**: A modern, glassmorphism-themed frontend built with Next.js (App Router), React, and TailwindCSS v4.
- **Server (`/server`)**: A blazing-fast backend API built with Express, TypeScript, and Bun, backed by MongoDB.

## Features

- **Automated AI Copywriting**: Generates 3-sentence, highly-converting emails that sound like a real human wrote them in 90 seconds. No corporate fluff or robotic buzzwords.
- **Bulk CSV Sending**: Drag-and-drop a `.csv` file of leads directly into the dashboard. Salvo processes the leads and dispatches the emails automatically.
- **Sender Context Injection**: Your business description, website, and current campaign "intent" are automatically injected into the LLM prompt, ensuring every email is deeply relevant.
- **Full Dashboard**: A protected Next.js dashboard to view total leads contacted, track sent/failed statuses, and manually send one-off emails.
- **Secure Authentication**: JWT-based authentication using secure, HTTP-only cookies.

## CSV Lead Format

When using the Auto Send (AI) feature, your `.csv` file must include a header row with the following exact columns (case-sensitive):

- `name` (required): The name of the lead.
- `company` (required): The company the lead works at.
- `service` (required): The service or product they offer.
- `city` (required): The city they are located in.
- `email` (required): The email address of the lead.
- `description` (optional): Additional context about the lead.
- `website` (optional): The lead's website URL.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS v4, Axios, Lucide React
- **Backend**: Bun, Express.js (TypeScript), MongoDB (Mongoose)
- **AI Integration**: OpenAI (or Groq/custom LLM endpoints)
- **Email Delivery**: Nodemailer (SMTP)

## Getting Started

To run Salvo locally, you need to run both the server and the client concurrently.

### 1. Start the Backend
Navigate to the `server` directory and set up your environment:
```bash
cd server
bun install
```
Copy the environment template and configure your keys (OpenAI/Groq, SMTP credentials):
```bash
cp .env.example .env
```
Once your `.env` is ready, run:
```bash
bun dev
```
The server will start on `http://localhost:8000`.

### 2. Start the Frontend
In a new terminal, navigate to the `client` directory:
```bash
cd client
bun install
```
Copy the environment template (defaults to `localhost:8000`):
```bash
cp .env.example .env
```
Start the Next.js development server:
```bash
bun dev
```
Open `http://localhost:3000` in your browser to access the Salvo platform.

## Documentation
- For detailed backend API documentation and LLM agent rules, see the **[Server Documentation](./server/README.md)**.

## Contributing

Salvo is open-source and we welcome contributions! 

1. Fork the repository and clone it locally.
2. Follow the **Getting Started** guide above to run the `client` and `server`.
3. Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
4. Commit your changes and open a Pull Request against the `main` branch.

## License

This project is licensed under the [MIT License](./LICENSE).
