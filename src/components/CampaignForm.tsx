import React, { useState } from 'react';
import { PlusCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { CampaignFormData } from '../types/campaign';

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
}

export default function CampaignForm({ onSubmit }: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    budget: 1000,
    location: '',
    ageMin: 18,
    ageMax: 65,
    interests: [],
    bidAmount: 0.5,
    duration: 30,
  });

  const [interest, setInterest] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      budget: 1000,
      location: '',
      ageMin: 18,
      ageMax: 65,
      interests: [],
      bidAmount: 0.5,
      duration: 30,
    });
    setInterest('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Campaign created successfully!');
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInterest = () => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
      setInterest('');
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Campaign Name</label>
        <input
          type="text"
          required
          disabled={isSubmitting}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget (USD)</label>
          <input
            type="number"
            min="100"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            value={formData.budget}
            onChange={e => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input
            type="text"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            value={formData.location}
            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age Range (Min)</label>
          <input
            type="number"
            min="13"
            max="100"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            value={formData.ageMin}
            onChange={e => setFormData(prev => ({ ...prev, ageMin: Number(e.target.value) }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age Range (Max)</label>
          <input
            type="number"
            min="13"
            max="100"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            value={formData.ageMax}
            onChange={e => setFormData(prev => ({ ...prev, ageMax: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interests</label>
        <div className="flex gap-2">
          <input
            type="text"
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            value={interest}
            onChange={e => setInterest(e.target.value)}
            placeholder="Add an interest"
          />
          <button
            type="button"
            disabled={isSubmitting}
            onClick={addInterest}
            className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.interests.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            >
              {item}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => removeInterest(index)}
                className="ml-1 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bid Amount (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            value={formData.bidAmount}
            onChange={e => setFormData(prev => ({ ...prev, bidAmount: Number(e.target.value) }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (Days)</label>
          <input
            type="number"
            min="1"
            max="365"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            value={formData.duration}
            onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Campaign...
            </>
          ) : (
            'Create Campaign'
          )}
        </button>
      </div>
    </form>
  );
}