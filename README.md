# Circuits

Circuits for the web is a one-stop shop for fitness facility managers.

## Getting Started

### 1. Initialize Circuits

If you do not already have a Supabase account, you must create one at [supabase.com](https://supabase.com/).

Go to [this Supabase project link](https://supabase.com/dashboard/project/tlnfnyhwjognaflpsnfj) to get your Supabase URL and Anon key. You will need these credentials to set up your environment variables.

### 2. Run the App

When you start the app, you will need to create an account and log in through the app's authentication flow to access its features.

### Development

1. Copy the example environment file and fill in your Supabase credentials:
   ```sh
   cp .env.example .env.local
   # Edit .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Start the development server:
   ```sh
   yarn dev
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

### About

Circuits helps you connect your fitness journey. Built with Supabase and Next.js.
