# LERO Workplace Assistant

A modern, responsive SaaS-style dashboard that helps professionals automate common workplace tasks using AI. Built as part of the CAPACITI AI Skill Accelerator Programme project: **AI-Powered Workplace Productivity Assistant**.

## Project Overview

Professionals across industries spend significant time on repetitive tasks such as drafting emails, planning schedules, and researching information. **LERO Workplace Assistant** addresses this by providing a clean, single-page dashboard with three AI-driven tools that streamline everyday workplace tasks — without the overhead of user accounts, databases, or backend persistence.

The app is designed as a client-side prototype: all interactions happen in local component state, with a strong emphasis on demonstrating structured prompt engineering and responsible AI use.

## Features Implemented

### 🧭 Dashboard & Navigation
- Welcoming home dashboard with three clickable feature cards
- Left sidebar navigation (collapsible into a bottom/hamburger nav on mobile)
- Fully responsive layout across mobile, tablet, and desktop
- Dark/gray corporate SaaS aesthetic with a single accent color

### ✉️ Smart Email Generator
- Input purpose/context and select a tone (Formal, Informal, Persuasive)
- Generates a draft email based on the provided inputs
- Fully editable output text box
- Copy-to-clipboard functionality

### 🗓️ AI Task Planner
- Input a list of tasks or goals
- Choose plan type (Daily/Weekly) and prioritization style (Urgency-based/Importance-based)
- Generates a structured, editable task list with suggested time slots
- Copy-to-clipboard functionality

### 🔍 AI Research Assistant
- Paste text/topics or attach a local document for research/summarization
- Generates an editable summary with key points and, where applicable, source references
- Supports both typed requests and file-based input

### 🛡️ Responsible AI
- Persistent, high-visibility disclaimer footer on every page warning that AI-generated content may contain errors and should be reviewed before use
- "Prompt used" collapsible panel on each tool, showing the structured prompt logic behind each AI feature

## Technologies and Tools Used

- **Frontend Framework:** React (via Lovable.ai)
- **Styling:** Tailwind CSS
- **AI Tooling:** ChatGPT (prompt design and drafting), Lovable.ai (application generation)
- **Design Approach:** Component-based, card-based SaaS UI with responsive breakpoints
- **State Management:** Local component state (no database or backend)

## Setup Instructions

This project was generated and is hosted via [Lovable.ai](https://lovable.dev).

### Option 1: Run via Lovable
1. Open the project link in Lovable.ai
2. Click **Preview** to view the live app, or **Publish** to deploy it

### Option 2: Run Locally
1. Clone this repository
   ```bash
   git clone <your-repo-url>
   cd lero-workplace-assistant
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```bash
   npm run dev
   ```
4. Open the app in your browser at `http://localhost:5173` (or the port shown in your terminal)

## Disclaimer

This is a prototype built for educational purposes as part of the CAPACITI AI Skill Accelerator Programme. AI-generated content within the app may contain inaccuracies and should always be reviewed before professional use.
