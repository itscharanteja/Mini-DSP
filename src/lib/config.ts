export const config = {
  database: {
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string
  }
};

// Validate environment variables
if (!config.database.url) {
  throw new Error('TURSO_DATABASE_URL environment variable is not set');
}

if (!config.database.authToken) {
  throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
} 