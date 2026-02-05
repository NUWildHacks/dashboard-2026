import { REQUIRED_CLIENT_ENV_VARS, REQUIRED_SERVER_ENV_VARS } from "@/constants";

/**
 * Validate that all required server-side environment variables are present.
 * Throws an error if any are missing.
 *
 * @throws {Error} If any required environment variables are missing
 */
export const validateServerEnvVars = (): void => {
  const missing: string[] = [];

  for (const varName of REQUIRED_SERVER_ENV_VARS) {
    if (!process.env[varName] || process.env[varName]?.trim() === "") {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required server-side environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file or environment configuration."
    );
  }
};

/**
 * Validate that all required client-side environment variables are present.
 * Throws an error if any are missing.
 *
 * @throws {Error} If any required environment variables are missing
 */
export const validateClientEnvVars = (): void => {
  const missing: string[] = [];

  for (const varName of REQUIRED_CLIENT_ENV_VARS) {
    if (!process.env[varName] || process.env[varName]?.trim() === "") {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required client-side environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file or environment configuration."
    );
  }
};
