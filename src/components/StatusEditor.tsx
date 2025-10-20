'use client';

import { useEffect, useState } from 'react';
import { fetchStatuses, updateStatus, Status } from '@/lib/supabase';

interface StatusEditorProps {
  className?: string;
}

export default function StatusEditor({ className = '' }: StatusEditorProps) {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      const data = await fetchStatuses();
      setStatuses(data);
    } catch (error) {
      console.error('Failed to load statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Status['status']) => {
    setUpdating(id);
    try {
      const success = await updateStatus(id, newStatus);
      if (success) {
        setStatuses(prev => 
          prev.map(status => 
            status.id === id 
              ? { ...status, status: newStatus, updated_at: new Date().toISOString() }
              : status
          )
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const statusOptions: Status['status'][] = [
    'Operational',
    'Partial Outage', 
    'Major Outage',
    'Maintenance'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'Partial Outage':
        return 'border-orange-200 bg-orange-50 text-[#FF753B]';
      case 'Major Outage':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'Maintenance':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`p-6 bg-white rounded-lg border ${className}`}>
        <h3 className="text-lg font-semibold mb-4">System Status Editor</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg border ${className}`}>
      <h3 className="text-lg font-semibold mb-4">System Status Editor</h3>
      <p className="text-sm text-gray-600 mb-6">
        Update the status of GearShift services. Changes will appear instantly on the status page.
      </p>
      
      <div className="space-y-3">
        {statuses.map((status) => (
          <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">{status.service}</span>
              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(status.status)}`}>
                {status.status}
              </span>
            </div>
            
            <select
              value={status.status}
              onChange={(e) => handleStatusChange(status.id, e.target.value as Status['status'])}
              disabled={updating === status.id}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gearshift-500 focus:border-transparent disabled:opacity-50"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
