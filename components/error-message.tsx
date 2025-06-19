import React from "react";

export function ErrorMessage({ error }: { error?: string | null }): JSX.Element | null {
  if (!error) return null;
  return <p className="text-sm text-red-500">{error}</p>;
} 