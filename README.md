# ⚡ Career AI — Dream Tech Company Eligibility & Roadmap Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Google Design](https://img.shields.io/badge/Design-Google%20Material%203-1a73e8.svg)](https://m3.material.io)

**Career AI** is an intelligent career acceleration platform designed for software engineers. It benchmarks your **CV / Resume**, **DSA problem count**, **GitHub**, **LinkedIn**, and **LeetCode stats** against hiring standards for top tech companies (Google, Microsoft, Amazon, Meta, Apple, Uber, TCS, Infosys, Wipro, or any custom company) and generates an instant **Eligibility Percentage**, **Live Salary Insights**, **Top 5 Interview Questions**, and a **12-Week Tailored Preparation Roadmap**.

---

## 🚀 Live Demo & GitHub Pages Hosting

You can deploy the frontend directly on **GitHub Pages**:
1. Go to your GitHub repository **Settings** → **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`!

---

## 🌟 Key Features

- 🎯 **Complete Job Role Freedom**: Select from SDE, Frontend, Backend, Full Stack, AI/ML, DevOps, or type any custom role.
- 🏢 **Multi-Tier Company Coverage**: Google, Microsoft, Amazon, Meta, Apple, Uber, Infosys, TCS, Wipro + custom company write-in.
- 📄 **Dual-Mode CV Analysis**: Drag-and-drop PDF resume upload (parsed via `pypdf`) or paste raw resume text.
- 📊 **Multi-Factor Scoring Bar (0 - 100%)**:
  - **DSA Benchmark Score (35%)**: Evaluated against real hiring bars (e.g. 400+ for Google/Meta, 90+ for TCS).
  - **Role-Adaptive Tech Stack (30%)**: Matches skills against role-specific requirements (e.g. React/TypeScript for Frontend; Docker/APIs for Backend).
  - **GitHub & Projects (20%)**: Project keyword depth & repository presence.
  - **Presence & LeetCode (15%)**: LinkedIn, Portfolio, and LeetCode validation.
- 💰 **Live Salary Insights**: Realistic CTC estimates tailored by company tier, role, and experience level.
- ❓ **Top 5 Real Interview Questions**: Exact technical and behavioral questions generated for the target company & role.
- 🗺️ **12-Week Personalized Roadmap**: Phased timeline with interactive progress checkboxes and print/save functionality.
- 📚 **Interactive Multi-Page Hub**:
  - **Company Intelligence Directory** (`companies.html`)
  - **Interactive DSA Mastery Tracker** (`dsa-tracker.html`) with browser `localStorage` saving.
  - **Interview Master Guide** (`interview-guide.html`) with Google STAR method and ATS resume comparisons.

---

## 🛠️ Local Development & Quickstart

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/career-ai.git
cd career-ai
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Backend
```bash
uvicorn main:app --reload --port 8000
```
API Documentation will be accessible at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 4. Open Frontend
Double-click `index.html` or open it in any browser!

---

## 📦 Project Structure
```text
├── index.html              # Main Evaluator & Hero Section
├── companies.html          # Company Intelligence Directory
├── dsa-tracker.html        # Interactive 20-pattern DSA Practice Tracker
├── interview-guide.html    # Google STAR behavioral & ATS guide
├── style.css               # Google Material 3 Design System
├── script.js               # Frontend application & Standalone Fallback engine
├── main.py                 # FastAPI backend (Benchmarks & Scoring)
├── requirements.txt        # Python dependencies
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

---

## 📄 License
Distributed under the MIT License.
