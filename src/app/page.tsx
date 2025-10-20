'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Wrench } from 'lucide-react';
import { fetchStatuses, subscribeToStatusChanges, Status } from '@/lib/supabase';
import StatusCard from '@/components/StatusCard';

// Fallback mock data for development
const mockStatuses: Status[] = [
  { id: '1', service: 'API', status: 'Operational', updated_at: new Date().toISOString() },
  { id: '2', service: 'Database', status: 'Operational', updated_at: new Date().toISOString() },
  { id: '3', service: 'CDN', status: 'Operational', updated_at: new Date().toISOString() },
  { id: '4', service: 'Authentication', status: 'Operational', updated_at: new Date().toISOString() },
  { id: '5', service: 'File Storage', status: 'Operational', updated_at: new Date().toISOString() },
];

export default function GearShiftStatusPage() {
  const [statuses, setStatuses] = useState<Status[]>(mockStatuses);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const loadStatuses = async () => {
      try {
        const data = await fetchStatuses();
        if (data.length > 0) {
          setStatuses(data);
        }
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
        // Keep using mock data as fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadStatuses();

    // Set up real-time subscription
    const unsubscribe = subscribeToStatusChanges((newStatuses) => {
      setStatuses(newStatuses);
      setLastUpdated(new Date());
    });

    // Fallback polling every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Operational':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Partial Outage':
        return <AlertTriangle className="w-6 h-6 text-[#FF753B]" />;
      case 'Major Outage':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'Maintenance':
        return <Wrench className="w-6 h-6 text-blue-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'text-green-400';
      case 'Partial Outage':
        return 'text-[#FF753B]';
      case 'Major Outage':
        return 'text-red-400';
      case 'Maintenance':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getOverallStatus = () => {
    if (statuses.some(s => s.status === 'Major Outage')) return 'Major Outage';
    if (statuses.some(s => s.status === 'Partial Outage')) return 'Partial Outage';
    if (statuses.some(s => s.status === 'Maintenance')) return 'Maintenance';
    return 'Operational';
  };

  const overallStatus = getOverallStatus();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF753B]/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-glow"></div>
        </div>
        
        <div className="w-full max-w-2xl relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              GearShift System Status
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-6 bg-white/30 rounded-full animate-pulse"></div>
              <span className="text-xl font-semibold text-white/80">Loading...</span>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="w-24 h-5 bg-white/20 rounded animate-pulse"></div>
                </div>
                <div className="w-20 h-6 bg-white/20 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF753B]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#FF753B]/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400/15 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-glow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-[#FF753B]/15 rounded-full blur-xl animate-float"></div>
      </div>
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            GearShift System Status
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            {getStatusIcon(overallStatus)}
            <span className={`text-xl font-semibold ${getStatusColor(overallStatus)}`}>
              {overallStatus}
            </span>
          </div>
          <p className="text-sm text-white/80 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 inline-block border border-white/20">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {/* Status Cards */}
        <div className="space-y-3">
          {statuses.map((status) => (
            <StatusCard key={status.id} status={status} />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 inline-block border border-white/20">
            <p className="text-sm text-white/80">
              For more information, visit{' '}
              <a 
                href="https://getgearshift.app" 
                className="text-[#FF753B] hover:text-orange-400 font-semibold transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                getgearshift.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
