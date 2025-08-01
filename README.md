# Circuits

Circuits for the web is a one-stop shop for fitness facility managers.

## Infrastructure
Next.js Frontend → FastAPI Backend → Supabase Database

- **Frontend**: Next.js (Port 3000)
- **Backend**: FastAPI (Port 8000)
- **Database**: Supabase (PostgreSQL + Auth)

## Quick Start

### Using Docker (Recommended)
```bash
# Start the application
docker-compose up --build

# Stop the application
docker-compose down
```
Access the app at http://localhost:3000

### Local Development
```bash
# Terminal 1: Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Start frontend
npm run dev
```

## Environment Setup
Create `.env` in project root:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET_KEY=your_jwt_secret
```
Create `.env.local` in project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Repository Structure
```
circuits/
├── app/                    # Next.js pages (frontend routes)
│   └── ...                 # e.g., /profile, /protected, /auth, etc.
├── backend/                # FastAPI backend (API server)
│   └── app/
│       ├── main.py         # FastAPI app entrypoint
│       ├── routers/        # API route definitions (e.g., users.py, auth.py)
│       ├── services/       # Business logic (e.g., users_service.py)
│       ├── models/         # Pydantic schemas (e.g., schemas.py)
│       └── middleware/     # Auth and other middleware
├── components/             # Reusable React components (UI, forms, etc.)
├── lib/                    # Frontend utilities, API clients, contexts, types
├── docker-compose.yml      # Docker orchestration for frontend/backend
├── Dockerfile*             # Docker build files
├── .env*                   # Environment variables
└── README.md               # Project documentation
```


## Development Setup

### Prerequisites
- Node.js and npm/yarn
- Python 3.11
- Supabase account and project

### 1. Setup FastAPI Backend
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Initialize Circuits

If you do not already have a Supabase account, you must create one at [supabase.com](https://supabase.com/).

Go to [this Supabase project link](https://supabase.com/dashboard/project/tlnfnyhwjognaflpsnfj) to get your Supabase URL and Service Role Key. You will need these credentials to set up your environment variables.

### 3. Environment Variables

Copy the example environment file and fill in your Supabase and FastAPI credentials:
```sh
cp .env.example .env.local
# Edit .env.local and set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_API_URL, and JWT_SECRET_KEY
```

### 4. Start the FastAPI Backend

```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 5. Start the Next.js Frontend

```sh
yarn install
yarn dev
```

### 6. (Optional) Docker Compose

You can also use Docker Compose to run both services:
```sh
docker-compose up --build
```

### Production

1. Build the production image:
   ```sh
   docker build -t circuits-web-prod .
   ```
2. Run the production container:
   ```sh
   docker run -p 3000:3000 --env-file .env.local circuits-web-prod
   ```

### About

Circuits helps you connect your fitness journey. Built with Supabase, FastAPI, and Next.js.

## Troubleshooting

- **Backend not starting:** Check that you are using Python 3.11 and that your virtual environment is activated (`source venv/bin/activate`).
- **Frontend auth not working:** Ensure the FastAPI backend is running on port 8000 and accessible from the frontend.
- **CORS errors:** Make sure `NEXT_PUBLIC_API_URL` in your environment variables matches the actual FastAPI server address (e.g., `http://localhost:8000`).

## Workflow

- The **Next.js frontend** communicates **only** with the FastAPI backend for all authentication and data operations.
- The **FastAPI backend** is responsible for all communication with Supabase (database and auth).
- This separation ensures a clean, secure, and scalable architecture for future development.

## Code Style & Best Practices

- All components and functions are written in TypeScript with explicit types and interfaces.
- Use React functional components and hooks. Prefer React.memo for pure presentational components.
- Ensure all event handlers and props are explicitly typed.
- Use semantic HTML and add ARIA attributes for accessibility.
- Organize imports: React/Next, third-party, then local modules.
- Use Prettier and ESLint to enforce consistent formatting and code quality.
- Add JSDoc comments for complex functions and components.
- Validate and sanitize all user input, especially in forms and API calls.
- Never expose sensitive data or secrets in client-side code.

## Agent Chat (AI Chatbot)

The Agent chat feature allows you to interact with an AI assistant (powered by OpenAI) in a modern, ChatGPT-style interface. You can manage chat sessions, select models, and view your conversation history.

### Setup Instructions

1. **Obtain an OpenAI API Key**
   - Sign up at [OpenAI](https://platform.openai.com/) and create an API key.

2. **Set the API Key in Your Environment**
   - Add your OpenAI API key to your environment variables:
     
     For local development, add to your `.env.local` file:
     ```env
     OPENAI_API_KEY=sk-...
     ```
     Or set it in your deployment environment (e.g., Vercel, Docker, etc).

3. **Start the Application**
   - Run the backend and frontend as described above. The Agent chat will be available at `/agent`.

### Usage
- Go to `/agent` in your browser.
- Start a new chat or select an existing session from the sidebar.
- Type your message and select the desired AI model.
- The AI will respond using the model you selected.
- All chat history is saved per session and can be managed from the sidebar.

**Note:**
- Your OpenAI API key is required for the AI assistant to function. Keep your key secure and do not expose it in client-side code or public repositories.
