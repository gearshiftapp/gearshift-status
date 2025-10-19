'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Server, Database, Shield, Activity, Mail, Globe, Loader2 } from 'lucide-react';
import useSWR from 'swr';

interface ComponentStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  last_updated: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  description: string;
  created_at: string;
  updated_at: string;
}

interface StatusData {
  overall_status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message: string;
  components: ComponentStatus[];
  incidents: Incident[];
  maintenance_events: Incident[];
  last_updated: string;
}

interface PlatformStats {
  totalUsers: string;
  activeUsers: string;
  totalPosts: string;
  totalTickets: string;
  totalPartners: string;
  totalEvents: string;
  totalMarketplaceItems: string;
  lastUpdated: string;
}

const statusFetcher = async (url: string): Promise<StatusData> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch status data');
  }
  return res.json();
};

const platformStatsFetcher = async (url: string): Promise<PlatformStats> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch platform stats');
  }
  return res.json();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'text-green-500';
    case 'degraded': return 'text-yellow-500';
    case 'outage': return 'text-red-500';
    case 'maintenance': return 'text-blue-500';
    case 'investigating': return 'text-yellow-500';
    case 'identified': return 'text-orange-500';
    case 'monitoring': return 'text-blue-500';
    case 'resolved': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'operational': return 'bg-green-500/10 border-green-500/20';
    case 'degraded': return 'bg-yellow-500/10 border-yellow-500/20';
    case 'outage': return 'bg-red-500/10 border-red-500/20';
    case 'maintenance': return 'bg-blue-500/10 border-blue-500/20';
    default: return 'bg-gray-500/10 border-gray-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return <CheckCircle className="h-6 w-6" />;
    case 'degraded': return <AlertTriangle className="h-6 w-6" />;
    case 'outage': return <XCircle className="h-6 w-6" />;
    case 'maintenance': return <Server className="h-6 w-6" />;
    case 'investigating': return <AlertTriangle className="h-5 w-5" />;
    case 'identified': return <AlertTriangle className="h-5 w-5" />;
    case 'monitoring': return <Activity className="h-5 w-5" />;
    case 'resolved': return <CheckCircle className="h-5 w-5" />;
    default: return <Server className="h-6 w-6" />;
  }
};

export default function StatusPage() {
  const apiUrl = process.env.NEXT_PUBLIC_STATUS_API || 'https://getgearshift.app/api/status';
  const platformStatsUrl = process.env.NEXT_PUBLIC_PLATFORM_STATS_API || 'https://getgearshift.app/api/stats/platform';
  
  const { data, error, mutate } = useSWR<StatusData>(apiUrl, statusFetcher, {
    refreshInterval: 60000, // Refresh every 60 seconds
  });

  const { data: platformStats } = useSWR<PlatformStats>(platformStatsUrl, platformStatsFetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center"
        >
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 mb-2">Unable to fetch status</h3>
          <p className="text-red-200/80">
            We&apos;re experiencing issues connecting to our status API. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center"
        >
          <RefreshCw className="h-12 w-12 text-gray-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Status...</h3>
          <p className="text-gray-500 dark:text-gray-400">Fetching the latest operational data.</p>
        </motion.div>
      </div>
    );
  }

  const overallStatusText = data.overall_status.charAt(0).toUpperCase() + data.overall_status.slice(1);
  const overallStatusColor = getStatusColor(data.overall_status);
  const overallStatusBg = getStatusBgColor(data.overall_status);
  const overallStatusIcon = getStatusIcon(data.overall_status);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-bold text-sm">G</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">GearShift Status</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Real-time system status</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Refresh status"
              >
                <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <a
                href="https://getgearshift.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Visit GearShift &rarr;
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between p-6 rounded-xl shadow-sm ${overallStatusBg}`}
        >
          <div className="flex items-center space-x-4">
            {overallStatusIcon}
            <h2 className={`text-2xl font-bold ${overallStatusColor}`}>{overallStatusText}</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">Last updated: {new Date(data.last_updated).toLocaleTimeString()}</p>
        </motion.div>

        {/* Real-time Platform Stats */}
        {platformStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Live Platform Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{platformStats.totalUsers || '0'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{platformStats.totalPosts || '0'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Builds Shared</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{platformStats.totalTickets || '0'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Support Tickets</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{platformStats.totalPartners || '0'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Partners</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Components Status */}
        <section className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Component Status</h3>
          <div className="space-y-3">
            {data.components.map((component, index) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${getStatusBgColor(component.status)}`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(component.status)}
                  <span className="font-medium text-gray-800 dark:text-gray-200">{component.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(component.last_updated).toLocaleTimeString()}
                  </span>
                  <span className={`text-sm font-semibold ${getStatusColor(component.status)}`}>
                    {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Incidents Timeline */}
        {data.incidents.length > 0 && (
          <section className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Incidents</h3>
            <div className="space-y-4">
              {data.incidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{incident.title}</h4>
                    <span className={`text-sm font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{incident.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Created: {new Date(incident.created_at).toLocaleString()}</span>
                    <span>Updated: {new Date(incident.updated_at).toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Maintenance Notices */}
        {data.maintenance_events.length > 0 && (
          <section className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Scheduled Maintenance</h3>
            <div className="space-y-4">
              {data.maintenance_events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                    <span className={`text-sm font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{event.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Scheduled: {new Date(event.created_at).toLocaleString()}</span>
                    <span>Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Powered by <a href="https://getgearshift.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">GearShift</a>
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="https://getgearshift.app" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Main Site
              </a>
              <a href="https://getgearshift.app/legal" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Legal & Privacy
              </a>
              <a href="mailto:support@getgearshift.app" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}