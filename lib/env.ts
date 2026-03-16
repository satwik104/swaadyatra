/**
 * Validates required environment variables at module load time.
 * Import this in any API route — if a var is missing the server
 * will throw immediately instead of failing silently at runtime.
 */
const required = [
  "RESEND_API_KEY",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY as string,
  CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
};
