# Circuits

Circuits for the web is a one-stop shop for fitness facility managers.

## Architecture

Circuits uses a three-tier architecture:
- **Frontend**: Next.js (localhost:3000)
- **Backend API**: FastAPI (localhost:8000)
- **Database & Auth**: Supabase

The frontend communicates with the FastAPI backend, which handles all Supabase operations.

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
