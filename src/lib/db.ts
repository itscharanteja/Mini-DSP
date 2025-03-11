import { createClient } from '@libsql/client';
import type { CampaignFormData, CampaignMetrics } from '../types/campaign';
import type { Row } from '@libsql/client';
import { config } from './config';

const db = createClient({
  url: config.database.url,
  authToken: config.database.authToken
});

export async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      budget REAL NOT NULL,
      location TEXT NOT NULL,
      age_min INTEGER NOT NULL,
      age_max INTEGER NOT NULL,
      interests TEXT NOT NULL,
      bid_amount REAL NOT NULL,
      duration INTEGER NOT NULL,
      start_date DATETIME NOT NULL,
      status TEXT NOT NULL,
      impressions INTEGER DEFAULT 0,
      spend REAL DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      won_auctions INTEGER DEFAULT 0,
      total_auctions INTEGER DEFAULT 0,
      average_position REAL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export async function createUser(email: string, passwordHash: string): Promise<string> {
  const id = crypto.randomUUID();
  await db.execute({
    sql: 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
    args: [id, email, passwordHash]
  });
  return id;
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });
  const row = result.rows[0];
  if (!row) return undefined;
  
  return {
    id: String(row.id),
    email: String(row.email),
    password_hash: String(row.password_hash),
    created_at: String(row.created_at)
  };
}

export async function createCampaign(userId: string, campaign: CampaignFormData): Promise<string> {
  const id = crypto.randomUUID();
  await db.execute({
    sql: `
      INSERT INTO campaigns (
        id, user_id, name, budget, location, age_min, age_max,
        interests, bid_amount, duration, start_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      userId,
      campaign.name,
      campaign.budget,
      campaign.location,
      campaign.ageMin,
      campaign.ageMax,
      JSON.stringify(campaign.interests),
      campaign.bidAmount,
      campaign.duration,
      new Date().toISOString(),
      'active'
    ]
  });
  return id;
}

interface DbCampaign {
  id: string;
  user_id: string;
  name: string;
  budget: number;
  location: string;
  age_min: number;
  age_max: number;
  interests: string;
  bid_amount: number;
  duration: number;
  start_date: string;
  status: string;
  impressions: number;
  spend: number;
  clicks: number;
  won_auctions: number;
  total_auctions: number;
  average_position: number;
}

function rowToDbCampaign(row: Row): DbCampaign {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    name: String(row.name),
    budget: Number(row.budget),
    location: String(row.location),
    age_min: Number(row.age_min),
    age_max: Number(row.age_max),
    interests: String(row.interests),
    bid_amount: Number(row.bid_amount),
    duration: Number(row.duration),
    start_date: String(row.start_date),
    status: String(row.status),
    impressions: Number(row.impressions),
    spend: Number(row.spend),
    clicks: Number(row.clicks),
    won_auctions: Number(row.won_auctions),
    total_auctions: Number(row.total_auctions),
    average_position: Number(row.average_position)
  };
}

export async function getUserCampaigns(userId: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM campaigns WHERE user_id = ?',
    args: [userId]
  });
  
  return result.rows.map(row => {
    const dbCampaign = rowToDbCampaign(row);
    return {
      id: dbCampaign.id,
      name: dbCampaign.name,
      budget: dbCampaign.budget,
      location: dbCampaign.location,
      ageRange: {
        min: dbCampaign.age_min,
        max: dbCampaign.age_max
      },
      interests: JSON.parse(dbCampaign.interests) as string[],
      bidAmount: dbCampaign.bid_amount,
      duration: dbCampaign.duration,
      startDate: new Date(dbCampaign.start_date),
      status: dbCampaign.status as 'active' | 'paused' | 'completed',
      metrics: {
        impressions: dbCampaign.impressions,
        spend: dbCampaign.spend,
        clicks: dbCampaign.clicks,
        ctr: dbCampaign.clicks / (dbCampaign.impressions || 1),
        wonAuctions: dbCampaign.won_auctions,
        totalAuctions: dbCampaign.total_auctions,
        averagePosition: dbCampaign.average_position
      }
    };
  });
}

export async function updateCampaignStatus(id: string, status: 'active' | 'paused' | 'completed') {
  await db.execute({
    sql: 'UPDATE campaigns SET status = ? WHERE id = ?',
    args: [status, id]
  });
}

export async function updateCampaignMetrics(id: string, metrics: CampaignMetrics) {
  await db.execute({
    sql: `
      UPDATE campaigns SET
        impressions = ?,
        spend = ?,
        clicks = ?,
        won_auctions = ?,
        total_auctions = ?,
        average_position = ?
      WHERE id = ?
    `,
    args: [
      metrics.impressions,
      metrics.spend,
      metrics.clicks,
      metrics.wonAuctions,
      metrics.totalAuctions,
      metrics.averagePosition,
      id
    ]
  });
}