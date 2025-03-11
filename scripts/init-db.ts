import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeDatabase } from '../src/lib/db';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

async function main() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main(); 