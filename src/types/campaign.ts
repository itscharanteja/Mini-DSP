export interface CampaignFormData {
  name: string;
  budget: number;
  location: string;
  ageMin: number;
  ageMax: number;
  interests: string[];
  bidAmount: number;
  duration: number;
}

export interface CampaignMetrics {
  impressions: number;
  spend: number;
  clicks: number;
  ctr: number;
  wonAuctions: number;
  totalAuctions: number;
  averagePosition: number;
}

export interface Campaign extends Omit<CampaignFormData, 'ageMin' | 'ageMax'> {
  id: string;
  ageRange: {
    min: number;
    max: number;
  };
  startDate: Date;
  status: 'active' | 'paused' | 'completed';
  metrics: CampaignMetrics;
}

export interface AuctionResult {
  campaignId: string;
  won: boolean;
  position: number;
  impressionCost: number;
  timestamp: Date;
}