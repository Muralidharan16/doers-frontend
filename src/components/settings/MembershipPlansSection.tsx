import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  useMembershipPlans,
  useCreateMembershipPlan,
  useUpdateMembershipPlan,
  useArchiveMembershipPlan,
  useActivateMembershipPlan,
  useDeactivateMembershipPlan,
} from '@/features/gym/hooks/useMembershipPlans';
import type { MembershipPlan, CreateMembershipPlanPayload, UpdateMembershipPlanPayload } from '@/features/gym/types/membershipPlans';
import { MembershipPlanForm } from './MembershipPlanForm';
import { MembershipPlanCard } from './MembershipPlanCard';
import { MembershipPlanEmptyState } from './MembershipPlanEmptyState';

export const MembershipPlansSection: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<{ planId: string; action: 'archive' | 'activate' | 'deactivate' } | null>(null);

  // Queries & Mutations
  const { data: plans = [], isLoading, error: fetchError } = useMembershipPlans();
  const createMutation = useCreateMembershipPlan();
  const updateMutation = useUpdateMembershipPlan();
  const archiveMutation = useArchiveMembershipPlan();
  const activateMutation = useActivateMembershipPlan();
  const deactivateMutation = useDeactivateMembershipPlan();

  const safePlans = Array.isArray(plans) ? plans : [];

  const handleOpenForm = useCallback((plan?: MembershipPlan) => {
    setFormError(null);
    if (plan) {
      setEditingPlan(plan);
    } else {
      setEditingPlan(null);
    }
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingPlan(null);
    setFormError(null);
  }, []);

  const handleFormSubmit = async (payload: CreateMembershipPlanPayload | UpdateMembershipPlanPayload) => {
    setFormError(null);
    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({
          planId: editingPlan.id,
          payload: payload as UpdateMembershipPlanPayload,
        });
      } else {
        await createMutation.mutateAsync(payload as CreateMembershipPlanPayload);
      }
      handleCloseForm();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }, message?: string };
      const errorMsg =
        (Array.isArray(e?.response?.data?.detail) ? e.response.data.detail[0]?.msg : undefined) ||
        (typeof e?.response?.data?.detail === 'string' ? e.response.data.detail : null) ||
        e?.message ||
        'Failed to save plan';
      setFormError(errorMsg);
    }
  };

  const handleArchive = async (planId: string) => {
    setActionError(null);
    setLoadingAction({ planId, action: 'archive' });
    try {
      await archiveMutation.mutateAsync(planId);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }, message?: string };
      const errorMsg =
        (typeof e?.response?.data?.detail === 'string' ? e.response.data.detail : null) ||
        e?.message ||
        'The membership plan could not be updated. Please try again.';
      setActionError(errorMsg);
      throw new Error(errorMsg, { cause: err });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleActivate = async (planId: string) => {
    setActionError(null);
    setLoadingAction({ planId, action: 'activate' });
    try {
      await activateMutation.mutateAsync(planId);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }, message?: string };
      const errorMsg =
        (typeof e?.response?.data?.detail === 'string' ? e.response.data.detail : null) ||
        e?.message ||
        'Failed to activate plan';
      setActionError(errorMsg);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeactivate = async (planId: string) => {
    setActionError(null);
    setLoadingAction({ planId, action: 'deactivate' });
    try {
      await deactivateMutation.mutateAsync(planId);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }, message?: string };
      const errorMsg =
        (typeof e?.response?.data?.detail === 'string' ? e.response.data.detail : null) ||
        e?.message ||
        'The membership plan could not be updated. Please try again.';
      setActionError(errorMsg);
      throw new Error(errorMsg, { cause: err });
    } finally {
      setLoadingAction(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Loader2 className="animate-spin text-[var(--text-muted)]" size={24} />
      </div>
    );
  }

  // Fetch error
  if (fetchError) {
    return (
      <div className="p-4 bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 rounded-md text-sm flex items-center gap-2 mt-4">
        <AlertCircle size={16} />
        Failed to load membership plans. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="mt-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
            Membership Plans
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Create the plans your gym sells, such as monthly access, couple offers, student plans, or family packs.
          </p>
        </div>
        {safePlans.length > 0 && (
          <Button
            variant="primary"
            onClick={() => handleOpenForm()}
            className="h-8 text-[11px] gap-1.5 px-3 flex-shrink-0"
          >
            <Plus size={12} /> New Plan
          </Button>
        )}
      </div>

      {/* Action Error */}
      {actionError && (
        <div className="mb-4 p-3 bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 rounded-md text-[12px] flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span className="flex-1">{actionError}</span>
        </div>
      )}

      {/* Empty State */}
      {safePlans.length === 0 && (
        <MembershipPlanEmptyState onCreateClick={() => handleOpenForm()} />
      )}

      {/* Plans Grid */}
      {safePlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {safePlans.map((plan) => (
            <MembershipPlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleOpenForm}
              onArchive={handleArchive}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              pendingAction={loadingAction?.planId === plan.id ? loadingAction.action : null}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <MembershipPlanForm
              plan={editingPlan || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              error={formError}
            />
          </div>
        </div>
      )}
    </div>
  );
};
