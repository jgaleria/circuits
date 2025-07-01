# Circuits

Circuits for the web is a one-stop shop for fitness facility managers.

## Architecture

Circuits uses a three-tier architecture:
- **Frontend**: Next.js (localhost:3000)
- **Backend API**: FastAPI (localhost:8000)
- **Database & Auth**: Supabase

## Getting Started

### 1. Initialize Circuits

If you do not already have a Supabase account, you must create one at [supabase.com](https://supabase.com/).

Go to [this Supabase project link](https://supabase.com/dashboard/project/tlnfnyhwjognaflpsnfj) to get your Supabase URL and Service Role Key. You will need these credentials to set up your environment variables.

### 2. Environment Variables

Copy the example environment file and fill in your Supabase and FastAPI credentials:
```sh
cp .env.example .env.local
# Edit .env.local and set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_API_URL, and JWT_SECRET_KEY
```

### 3. Start the FastAPI Backend

```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4. Start the Next.js Frontend

```sh
yarn install
yarn dev
```

### 5. (Optional) Docker Compose

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
