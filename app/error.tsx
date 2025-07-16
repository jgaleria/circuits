"use client";

import { useEffect, type ReactElement } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }): ReactElement {
  useEffect(() => {
    // Optionally log error to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-circuits-light-grey text-circuits-dark-blue">
        <div className="max-w-md w-full p-8 bg-white rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">An unexpected error occurred. Please try reloading the page.</p>
          <button
            className="bg-circuits-dark-blue text-white px-4 py-2 rounded hover:bg-circuits-medium-blue transition"
            onClick={() => reset()}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
} 