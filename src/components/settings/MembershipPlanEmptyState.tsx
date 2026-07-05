import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MembershipPlanEmptyStateProps {
  onCreateClick: () => void;
}

export const MembershipPlanEmptyState: React.FC<MembershipPlanEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="py-12 text-center border border-dashed border-[var(--border-default)] rounded-lg bg-[var(--bg-hover)]/30">
      <p className="text-[13px] text-[var(--text-muted)] mb-4 max-w-sm mx-auto">
        No membership plans yet. Create your first plan to start admitting members.
      </p>
      <Button 
        variant="primary" 
        onClick={onCreateClick}
        className="gap-2"
      >
        <Plus size={14} /> Create First Plan
      </Button>
    </div>
  );
};
