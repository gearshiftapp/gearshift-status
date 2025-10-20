import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create client if we have real credentials
export const supabase = supabaseUrl !== 'https://placeholder.supabase.co' 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Status {
  id: string;
  service: string;
  status: 'Operational' | 'Partial Outage' | 'Major Outage' | 'Maintenance';
  updated_at: string;
}

export const fetchStatuses = async (): Promise<Status[]> => {
  if (!supabase) {
    console.warn('Supabase client not initialized - using fallback data');
    return [];
  }

  const { data, error } = await supabase
    .from('statuses')
    .select('*')
    .order('service');

  if (error) {
    console.error('Error fetching statuses:', error);
    return [];
  }

  return data || [];
};

export const updateStatus = async (id: string, status: Status['status']): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase client not initialized - cannot update status');
    return false;
  }

  const { error } = await supabase
    .from('statuses')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
    return false;
  }

  return true;
};

export const subscribeToStatusChanges = (callback: (statuses: Status[]) => void) => {
  if (!supabase) {
    console.warn('Supabase client not initialized - real-time updates disabled');
    return () => {}; // Return empty unsubscribe function
  }

  const channel = supabase
    .channel('realtime-status')
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'statuses' 
      },
      async () => {
        const statuses = await fetchStatuses();
        callback(statuses);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
