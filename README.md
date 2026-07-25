# InkSpire

InkSpire is an AI-assisted story writing platform built with a React frontend, a Node/Express backend, and optional Python fine-tuning and local inference utilities. It is designed for collaborative story creation, story library management, and AI-assisted cover and title generation.

## Project Overview

The application lets a writer:

- Configure a new story with genre, tone, style, and point of view.
- Write a story in a chat-style editor with AI-generated continuations.
- Generate story covers and story titles from the current story context.
- Save and revisit stories through a local story library.
- Sign in, sign up, and view a profile page backed by localStorage.

The backend also supports an optional local LLM workflow through a Flask inference server, with Pollinations.ai as the external text and image fallback path.

## Features

- Story setup flow for selecting genre, tone, style, and point of view.
- Interactive story editor with AI responses and image upload support.
- AI-generated story title and cover generation.
- Story library for browsing saved stories.
- Login and signup pages backed by local browser storage.
- Profile page with story history and basic user stats.
- Node/Express API for story generation and story persistence.
- Python fine-tuning and local inference scripts for model experimentation.

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- Styling: Tailwind CSS, PostCSS
- Motion: Framer Motion
- Routing: React Router DOM
- Icons: Lucide React
- Backend: Node.js, Express
- AI integrations: Pollinations.ai, Google Gemini, optional local Flask inference server
- Python tooling: PyTorch, Transformers, Datasets, PEFT, Accelerate, BitsAndBytes, Flask

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- Python 3.10 or newer for the `fine_tuning` utilities
- A working internet connection for external AI services
- Optional: a CUDA-capable GPU for local model training or inference

## Folder Structure

```text
Milestone 4/
├── README.md
├── LICENSE
├── .env.example
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── stories.json
│   └── test_*.js
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── lib/
│       ├── pages/
│       ├── types/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── Dataset/
│   └── writingPrompts/
├── fine_tuning/
│   ├── requirements.txt
│   ├── train.py
│   ├── inference_server.py
│   ├── train_data.jsonl
│   ├── valid_data.jsonl
│   └── other training and test scripts
└── test_torch_root.py
```

## Environment Variables

See [`.env.example`](.env.example) for the full list of supported variables.

- `VITE_API_URL` - Base URL for the backend API used by the frontend.
- `PORT` - Backend port.
- `USE_LOCAL_LLM` - Enables the local inference server fallback path.
- `LOCAL_LLM_URL` - URL for the local Flask inference server.
- `FRONTEND_URL` - Allowed frontend origin for backend CORS.
- `GEMINI_API_KEY` - Gemini API key for image analysis and cover/title generation.

## Installation

Clone the repository and install the dependencies for each part of the project.

### Backend Setup

```bash
cd backend
npm install
```

The backend uses `nodemon` for development, so `npm run dev` starts the server with auto-reload.

### Frontend Setup

```bash
cd frontend
npm install
```

### Python Fine-Tuning Setup

```bash
cd fine_tuning
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

If you are on macOS or Linux, activate the virtual environment with the equivalent shell command for your platform.

## How to Run the Project

Open three terminals when running the full stack locally.

### 1. Start the backend

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:3001` by default.

### 2. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### 3. Optional: start the local Python inference server

```bash
cd fine_tuning
venv\Scripts\activate
python inference_server.py
```

The backend can use this server when `USE_LOCAL_LLM=true` and `LOCAL_LLM_URL` points to the local endpoint.

## Future Enhancements

- Persist user accounts with a real authentication backend instead of localStorage.
- Replace browser-local story persistence with a database-backed storage layer.
- Add automated tests for backend routes and frontend flows.
- Add deployment-ready configuration for hosting the app in a cloud environment.
- Improve the fine-tuning workflow with reproducible experiment tracking and clearer model versioning.
- Add stronger error handling and loading states for external AI service failures.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full text.
