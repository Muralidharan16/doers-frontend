import React from 'react';
import { Edit2, Archive, Power, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { MembershipPlan, MembershipPlanStatus } from '@/features/gym/types/membershipPlans';

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onArchive: (planId: string) => Promise<void>;
  onActivate: (planId: string) => Promise<void>;
  onDeactivate: (planId: string) => Promise<void>;
  isLoading?: boolean;
}

const getStatusBadgeVariant = (status: MembershipPlanStatus): 'healthy' | 'warning' | 'muted' => {
  switch (status) {
    case 'active':
      return 'healthy';
    case 'inactive':
      return 'warning';
    case 'archived':
    default:
      return 'muted';
  }
};

const getStatusLabel = (status: MembershipPlanStatus): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'archived':
      return 'Archived';
    default:
      return status;
  }
};

const formatDuration = (value: number, unit: string): string => {
  const unitLabel = unit === 'months' ? 'month' : unit === 'years' ? 'year' : 'day';
  const plural = value > 1 ? 's' : '';
  return `${value} ${unitLabel}${plural}`;
};

const formatMaxMembers = (max: number): string => {
  if (max === 1) return 'Allows 1 member';
  return `Allows ${max} members`;
};

const formatBranchAvailability = (branchId: string | null): string => {
  return branchId ? 'Specific branch' : 'All branches';
};

const formatValidity = (validFrom: string | null, validUntil: string | null): string => {
  if (!validFrom && !validUntil) {
    return 'Always available';
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (validFrom && validUntil) {
    return `${formatDate(validFrom)} to ${formatDate(validUntil)}`;
  }
  
  if (validFrom) {
    return `Available from ${formatDate(validFrom)}`;
  }
  
  if (validUntil) {
    return `Available until ${formatDate(validUntil)}`;
  }

  return 'Always available';
};

export const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({
  plan,
  onEdit,
  onArchive,
  onActivate,
  onDeactivate,
  isLoading = false,
}) => {
  const handleArchive = async () => {
    if (!window.confirm('Are you sure you want to archive this plan? It will no longer be available for new members.')) {
      return;
    }
    await onArchive(plan.id);
  };

  const handleActivate = async () => {
    await onActivate(plan.id);
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Deactivating this plan will hide it from new member admissions. Continue?')) {
      return;
    }
    await onDeactivate(plan.id);
  };

  const isArchived = plan.status === 'archived';
  const isActive = plan.status === 'active';

  return (
    <div className="p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-[var(--border-default)]">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                {plan.plan_code}
              </p>
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5">
                {plan.name}
              </h3>
            </div>
          </div>
          {plan.description && (
            <p className="text-[12px] text-[var(--text-muted)] mt-2 line-clamp-2">
              {plan.description}
            </p>
          )}
        </div>
        <Badge variant={getStatusBadgeVariant(plan.status)}>
          {getStatusLabel(plan.status)}
        </Badge>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Price & Duration */}
        <div className="space-y-1">
          <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            Price & Duration
          </p>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">
            {plan.currency} {plan.price.toFixed(2)} / {formatDuration(plan.duration_value, plan.duration_unit)}
          </p>
        </div>

        {/* Members */}
        <div className="space-y-1">
          <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider flex items-center gap-1">
            <Users size={12} /> Members
          </p>
          <p className="text-[13px] text-[var(--text-primary)]">
            {formatMaxMembers(plan.max_members)}
          </p>
        </div>

        {/* Branch */}
        <div className="space-y-1">
          <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            Branch
          </p>
          <p className="text-[13px] text-[var(--text-primary)]">
            {formatBranchAvailability(plan.branch_id)}
          </p>
        </div>

        {/* Validity */}
        <div className="space-y-1">
          <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> Valid
          </p>
          <p className="text-[13px] text-[var(--text-primary)]">
            {formatValidity(plan.valid_from, plan.valid_until)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-[var(--border-default)]">
        {!isArchived && (
          <>
            <button
              onClick={() => onEdit(plan)}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 rounded text-[12px] font-medium flex items-center justify-center gap-1.5 bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--border-strong)] transition-colors disabled:opacity-50"
            >
              <Edit2 size={13} /> Edit
            </button>
            
            {isActive ? (
              <button
                onClick={handleDeactivate}
                disabled={isLoading}
                className="flex-1 px-3 py-1.5 rounded text-[12px] font-medium flex items-center justify-center gap-1.5 bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--border-strong)] transition-colors disabled:opacity-50"
              >
                <Power size={13} /> Deactivate
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={isLoading}
                className="flex-1 px-3 py-1.5 rounded text-[12px] font-medium flex items-center justify-center gap-1.5 bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--border-strong)] transition-colors disabled:opacity-50"
              >
                <Power size={13} /> Activate
              </button>
            )}
            
            <button
              onClick={handleArchive}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 rounded text-[12px] font-medium flex items-center justify-center gap-1.5 bg-[var(--bg-hover)] text-[var(--red)] hover:bg-[var(--red)]/10 transition-colors disabled:opacity-50"
            >
              <Archive size={13} /> Archive
            </button>
          </>
        )}
        
        {isArchived && (
          <div className="flex-1 py-1.5 text-center text-[12px] text-[var(--text-muted)]">
            Archived plans cannot be edited
          </div>
        )}
      </div>
    </div>
  );
};
