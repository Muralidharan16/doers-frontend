
import { useBranchHoursProjection } from '@/features/gym/hooks/useBranchHours';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Clock } from 'lucide-react';

interface OperatingHoursStatusCardProps {
  branchId: string;
}

export function OperatingHoursStatusCard({ branchId }: OperatingHoursStatusCardProps) {
  const { data: projection, isLoading, error } = useBranchHoursProjection(branchId);

  // Consider 404s (error) as NOT_CONFIGURED safely
  const isNotConfigured = error || !projection || projection.current_status === 'NOT_CONFIGURED';

  if (isLoading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--border-default)] rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-[var(--border-default)] rounded" />
            <div className="h-3 w-40 bg-[var(--border-default)] rounded" />
          </div>
        </div>
      </Card>
    );
  }

  const getStatusDisplay = () => {
    if (isNotConfigured) {
      return { label: 'Not Configured', variant: 'muted' as const, text: 'Set up your operating hours below.' };
    }
    
    switch (projection.current_status) {
      case 'OPEN':
        return { 
          label: 'Open Now', 
          variant: 'healthy' as const, 
          text: projection.next_close_at 
            ? `Closes at ${new Date(projection.next_close_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
            : 'Open 24 Hours' 
        };
      case 'CLOSED':
        return { 
          label: 'Closed', 
          variant: 'muted' as const, 
          text: projection.next_open_at 
            ? `Opens at ${new Date(projection.next_open_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
            : 'No upcoming open times' 
        };
      case 'HOLIDAY':
        return { 
          label: 'Holiday / Special', 
          variant: 'warning' as const, 
          text: projection.next_open_at 
            ? `Reopens at ${new Date(projection.next_open_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
            : 'Closed for the day' 
        };
      default:
        return { label: 'Unknown', variant: 'muted' as const, text: 'Status unavailable' };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-hover)]/40">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex-shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Current Status</h3>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="text-[12px] text-[var(--text-muted)] mt-1">{status.text}</p>
        </div>
      </div>
    </div>
  );
}
