import { CheckCircle, AlertTriangle, XCircle, Wrench } from 'lucide-react';
import { Status } from '@/lib/supabase';

interface StatusCardProps {
  status: Status;
}

export default function StatusCard({ status }: StatusCardProps) {
  const getStatusIcon = (statusType: string) => {
    switch (statusType) {
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

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'Operational':
        return 'text-green-400 bg-green-500/20 border border-green-400/30';
      case 'Partial Outage':
        return 'text-[#FF753B] bg-[#FF753B]/20 border border-[#FF753B]/30';
      case 'Major Outage':
        return 'text-red-400 bg-red-500/20 border border-red-400/30';
      case 'Maintenance':
        return 'text-blue-400 bg-blue-500/20 border border-blue-400/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border border-gray-400/30';
    }
  };

  return (
    <div className="flex items-center justify-between p-5 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center space-x-4">
        {getStatusIcon(status.status)}
        <span className="font-semibold text-white text-lg">{status.service}</span>
      </div>
      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(status.status)}`}>
        {status.status}
      </span>
    </div>
  );
}
