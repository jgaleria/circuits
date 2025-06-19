# Circuits Web

Circuits for the web is a one-stop shop for fitness facility managers.

## Getting Started

### 1. Initialize Supabase

Go to [this Supabase project link](https://supabase.com/dashboard/project/tlnfnyhwjognaflpsnfj) to get your Supabase URL and Anon key. You will need these credentials to set up your environment variables.

### Development

1. Copy the example environment file and fill in your Supabase credentials:
   ```sh
   cp .env.example .env.local
   # Edit .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
2. Start the app in development mode:
   ```sh
   docker-compose up --build
   ```
3. Visit [http://localhost:3000](http://localhost:3000) in your browser.
4. To stop the app:
   ```sh
   docker-compose down
   ```

**Optionally, you can use Yarn commands directly for local development if you have Yarn installed:**
```sh
yarn install
yarn dev
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
