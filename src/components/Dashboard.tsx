import { BarChart, DollarSign, Target, Percent, Play, Pause, StopCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import type { Campaign } from '../types/campaign';

interface DashboardProps {
  campaign: Campaign;
  onStatusChange: (id: string, status: Campaign['status']) => void;
}

export default function Dashboard({ campaign, onStatusChange }: DashboardProps) {
  const daysRemaining = differenceInDays(
    new Date(campaign.startDate.getTime() + campaign.duration * 24 * 60 * 60 * 1000),
    new Date()
  );

  const budgetUtilizationPercent = (campaign.metrics.spend / campaign.budget) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Campaign: {campaign.name}
          </h3>
          <div className="flex space-x-2">
            {campaign.status !== 'completed' && (
              <>
                {campaign.status === 'paused' ? (
                  <button
                    onClick={() => onStatusChange(campaign.id, 'active')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={() => onStatusChange(campaign.id, 'paused')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </button>
                )}
                <button
                  onClick={() => onStatusChange(campaign.id, 'completed')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                >
                  <StopCircle className="h-4 w-4 mr-1" />
                  End
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-md p-3">
                  <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Impressions
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.metrics.impressions.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Spend
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${campaign.metrics.spend.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800 rounded-md p-3">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Clicks
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.metrics.clicks.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-800 rounded-md p-3">
                  <Percent className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      CTR
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(campaign.metrics.ctr * 100).toFixed(2)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-5 rounded-lg">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Status</p>
                <p className={`mt-1 text-sm ${
                  campaign.status === 'active' ? 'text-green-600 dark:text-green-400' :
                  campaign.status === 'completed' ? 'text-blue-600 dark:text-blue-400' :
                  'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Utilization</p>
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                          {budgetUtilizationPercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                          ${campaign.metrics.spend.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
                      <div
                        style={{ width: `${Math.min(budgetUtilizationPercent, 100)}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Duration</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
                  Started: {format(campaign.startDate, 'MMM d, yyyy')}
                  <br />
                  {daysRemaining > 0 ? (
                    <span className="text-green-600 dark:text-green-400">{daysRemaining} days remaining</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Campaign ended</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-5 rounded-lg">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Auction Performance</p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.metrics.totalAuctions > 0
                        ? ((campaign.metrics.wonAuctions / campaign.metrics.totalAuctions) * 100).toFixed(1)
                        : '0'}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Position</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.metrics.averagePosition.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Targeting</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-900 dark:text-gray-300">Location: {campaign.location}</p>
                  <p className="text-sm text-gray-900 dark:text-gray-300">
                    Age Range: {campaign.ageRange.min}-{campaign.ageRange.max}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {campaign.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}