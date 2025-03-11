import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CampaignForm from './components/CampaignForm';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import UserProfile from './components/UserProfile';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeDatabase, getUserCampaigns, createCampaign, updateCampaignStatus, updateCampaignMetrics } from './lib/db';
import type { Campaign, CampaignFormData, AuctionResult } from './types/campaign';
import { Layout } from 'lucide-react';

// Initialize database when the app starts
initializeDatabase().catch(console.error);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function AppContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserCampaigns(user.id)
        .then(setCampaigns)
        .catch(console.error);
    }
  }, [user]);

  const simulateAuction = (campaign: Campaign): AuctionResult => {
    const otherBids = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () =>
      Math.random() * 2
    ).sort((a, b) => b - a);

    const position = otherBids.findIndex(bid => campaign.bidAmount > bid) + 1;
    const won = position === 0;
    const impressionCost = won ? (otherBids[0] || campaign.bidAmount * 0.8) : 0;

    return {
      campaignId: campaign.id,
      won,
      position: won ? 1 : position + 1,
      impressionCost,
      timestamp: new Date(),
    };
  };

  useEffect(() => {
    if (!user) return;
    const auctionInterval = setInterval(() => {
      setCampaigns(prevCampaigns => {
        const updatedCampaigns = prevCampaigns.map(campaign => {
          if (campaign.status !== 'active') return campaign;

          const daysElapsed = Math.floor(
            (new Date().getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysElapsed >= campaign.duration || campaign.metrics.spend >= campaign.budget) {
            updateCampaignStatus(campaign.id, 'completed').catch(console.error);
            return { ...campaign, status: 'completed' };
          }

          const auctionResult = simulateAuction(campaign);
          
          if (!auctionResult.won) {
            const updatedMetrics = {
              ...campaign.metrics,
              totalAuctions: campaign.metrics.totalAuctions + 1,
              averagePosition:
                (campaign.metrics.averagePosition * campaign.metrics.totalAuctions +
                  auctionResult.position) /
                (campaign.metrics.totalAuctions + 1),
            };
            updateCampaignMetrics(campaign.id, updatedMetrics).catch(console.error);
            return { ...campaign, metrics: updatedMetrics };
          }

          const newImpressions = campaign.metrics.impressions + 1;
          const newSpend = campaign.metrics.spend + auctionResult.impressionCost;
          const clickProbability = Math.random();
          const newClick = clickProbability < 0.02;

          const updatedMetrics = {
            impressions: newImpressions,
            spend: newSpend,
            clicks: campaign.metrics.clicks + (newClick ? 1 : 0),
            ctr: (campaign.metrics.clicks + (newClick ? 1 : 0)) / newImpressions,
            wonAuctions: campaign.metrics.wonAuctions + 1,
            totalAuctions: campaign.metrics.totalAuctions + 1,
            averagePosition:
              (campaign.metrics.averagePosition * campaign.metrics.totalAuctions +
                auctionResult.position) /
              (campaign.metrics.totalAuctions + 1),
          };

          updateCampaignMetrics(campaign.id, updatedMetrics).catch(console.error);
          return { ...campaign, metrics: updatedMetrics };
        });

        return updatedCampaigns;
      });
    }, 1000);

    return () => clearInterval(auctionInterval);
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleCreateCampaign = async (formData: CampaignFormData) => {
    if (!user) return;

    try {
      const campaignId = await createCampaign(user.id, formData);
      const { ageMin, ageMax, ...rest } = formData;
      const newCampaign: Campaign = {
        ...rest,
        id: campaignId,
        ageRange: {
          min: ageMin,
          max: ageMax,
        },
        startDate: new Date(),
        status: 'active',
        metrics: {
          impressions: 0,
          spend: 0,
          clicks: 0,
          ctr: 0,
          wonAuctions: 0,
          totalAuctions: 0,
          averagePosition: 0,
        },
      };

      setCampaigns(prev => [...prev, newCampaign]);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleStatusChange = async (id: string, status: Campaign['status']) => {
    try {
      await updateCampaignStatus(id, status);
      setCampaigns(prev =>
        prev.map(campaign =>
          campaign.id === id ? { ...campaign, status } : campaign
        )
      );
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Layout className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="ml-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                  DSP Campaign Manager
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {user && (
                  <>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Create New Campaign
                    </h2>
                    <div className="mt-4">
                      <CampaignForm onSubmit={handleCreateCampaign} />
                    </div>
                  </div>
                </div>

                {campaigns.map(campaign => (
                  <Dashboard
                    key={campaign.id}
                    campaign={campaign}
                    onStatusChange={handleStatusChange}
                  />
                ))}

                {campaigns.length === 0 && (
                  <div className="text-center py-12">
                    <Layout className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      No campaigns
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating a new campaign.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}