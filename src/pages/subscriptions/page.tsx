import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, Plus, RefreshCw, Users, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { useMembershipPlans } from '@/features/gym/hooks/useMembershipPlans';
import type { MembershipPlan } from '@/features/gym/types/membershipPlans';
import { useMembers } from '@/features/members';
import type { Member } from '@/features/members';
import { useCreateSubscription, useSubscriptions } from '@/features/subscriptions';
import type { CreateSubscriptionPayload, MemberSubscriptionV2, ModernSubscriptionStatus } from '@/features/subscriptions';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { fetchBranches, getAuthTokenPayload } from '@/shared/services/api/client';

interface BranchOption {
  id: string;
  name: string;
  city?: string | null;
}

interface ApiBranch {
  id?: unknown;
  name?: unknown;
  internal_code?: unknown;
  address_city?: unknown;
}

interface AdmissionFormState {
  primary_member_id: string;
  branch_id: string;
  membership_plan_id: string;
  start_date: string;
}

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const emptyFormState = (): AdmissionFormState => ({
  primary_member_id: '',
  branch_id: '',
  membership_plan_id: '',
  start_date: todayIso(),
});

const getCurrentOrgId = (): string | undefined => {
  const payload = getAuthTokenPayload();
  return typeof payload?.org_id === 'string' ? payload.org_id : undefined;
};

const titleCase = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Not available';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatMoney = (amount: number, currencyCode?: string): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode || 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

const formatDuration = (value: number, unit: string): string => {
  const singularUnit = value === 1 ? unit.replace(/s$/, '') : unit;
  return `${value} ${singularUnit}`;
};

const getStatusBadgeVariant = (status: ModernSubscriptionStatus): 'healthy' | 'warning' | 'muted' | 'gold' => {
  if (status === 'active') return 'healthy';
  if (status === 'pending' || status === 'frozen') return 'gold';
  if (status === 'cancelled' || status === 'expired') return 'warning';
  return 'muted';
};

const addDuration = (startDate: string, value: number, unit: MembershipPlan['duration_unit']): string | null => {
  if (!startDate || value <= 0) return null;
  const [year, month, day] = startDate.split('-').map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;

  if (unit === 'days') {
    date.setDate(date.getDate() + value);
  } else if (unit === 'months') {
    date.setMonth(date.getMonth() + value);
  } else {
    date.setFullYear(date.getFullYear() + value);
  }

  return date.toISOString().slice(0, 10);
};

const getLastValidDay = (endDate: string | null): string | null => {
  if (!endDate) return null;
  const date = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};

const isPlanAvailableForBranch = (plan: MembershipPlan, branchId: string): boolean =>
  plan.status === 'active' && (!plan.branch_id || plan.branch_id === branchId);

const normalizeBranchOption = (branch: ApiBranch): BranchOption | null => {
  if (typeof branch.id !== 'string' || !branch.id) return null;
  const name = typeof branch.name === 'string' && branch.name.trim()
    ? branch.name.trim()
    : typeof branch.internal_code === 'string' && branch.internal_code.trim()
      ? branch.internal_code.trim()
      : 'Unnamed branch';

  return {
    id: branch.id,
    name,
    city: typeof branch.address_city === 'string' ? branch.address_city : null,
  };
};

const buildCreatePayload = (form: AdmissionFormState): CreateSubscriptionPayload => ({
  branch_id: form.branch_id,
  membership_plan_id: form.membership_plan_id,
  primary_member_id: form.primary_member_id,
  start_date: form.start_date || null,
});

const formatMissingSetupMessage = (items: string[]): string | null => {
  if (items.length === 0) return null;
  if (items.length === 1) return `Create ${items[0]} before admission.`;
  const lastItem = items[items.length - 1];
  const leadingItems = items.slice(0, -1).join(', ');
  return `Create ${leadingItems} and ${lastItem} before admission.`;
};

export default function SubscriptionsPage() {
  const orgId = getCurrentOrgId();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<AdmissionFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(Boolean(orgId));
  const [branchError, setBranchError] = useState<string | null>(null);

  const loadBranches = useCallback(() => {
    if (!orgId) return;

    setBranchesLoading(true);
    setBranchError(null);

    fetchBranches()
      .then((response) => {
        const rawBranches: ApiBranch[] = Array.isArray(response.data?.data) ? response.data.data : [];
        setBranches(rawBranches.map(normalizeBranchOption).filter((branch): branch is BranchOption => Boolean(branch)));
      })
      .catch((error) => {
        setBranches([]);
        setBranchError(getApiErrorMessage(error, 'Unable to load branches.'));
      })
      .finally(() => {
        setBranchesLoading(false);
      });
  }, [orgId]);

  useEffect(() => {
    if (!orgId) return;
    void Promise.resolve().then(loadBranches);
  }, [loadBranches, orgId]);

  const membersQuery = useMembers(orgId, { status: 'active', is_active: true, limit: 50 });
  const plansQuery = useMembershipPlans({ plan_status: 'active' }, { enabled: !!orgId });
  const subscriptionsQuery = useSubscriptions(orgId, { page: 1, limit: 50 });
  const createSubscription = useCreateSubscription(orgId);

  const activeMembers = useMemo(
    () => (membersQuery.data?.data ?? []).filter((member) => member.status === 'active' && member.is_active),
    [membersQuery.data?.data]
  );

  const activePlans = useMemo(
    () => (plansQuery.data ?? []).filter((plan) => plan.status === 'active' && plan.org_id === orgId),
    [orgId, plansQuery.data]
  );

  const subscriptions = subscriptionsQuery.data?.data ?? [];

  const memberById = useMemo(() => new Map(activeMembers.map((member) => [member.id, member])), [activeMembers]);
  const planById = useMemo(() => new Map(activePlans.map((plan) => [plan.id, plan])), [activePlans]);
  const branchById = useMemo(() => new Map(branches.map((branch) => [branch.id, branch])), [branches]);

  const availablePlans = useMemo(() => {
    if (!form.branch_id) return activePlans;
    return activePlans.filter((plan) => isPlanAvailableForBranch(plan, form.branch_id));
  }, [activePlans, form.branch_id]);

  const selectedPlan = form.membership_plan_id ? planById.get(form.membership_plan_id) : undefined;
  const previewEndDate = selectedPlan
    ? addDuration(form.start_date, selectedPlan.duration_value, selectedPlan.duration_unit)
    : null;
  const previewLastValidDay = getLastValidDay(previewEndDate);

  const activeSubscriptionCount = subscriptions.filter((subscription) => subscription.status === 'active').length;
  const totalActiveSlots = subscriptions.reduce(
    (count, subscription) => count + (subscription.members?.filter((member) => member.is_active).length ?? 0),
    0
  );

  const missingSetupItems = useMemo(() => {
    const items: string[] = [];
    if (!membersQuery.isLoading && activeMembers.length === 0) items.push('an active member');
    if (!branchesLoading && branches.length === 0) items.push('a branch');
    if (!plansQuery.isLoading && activePlans.length === 0) items.push('an active membership plan');
    return items;
  }, [activeMembers.length, activePlans.length, branches.length, branchesLoading, membersQuery.isLoading, plansQuery.isLoading]);

  const missingSetupMessage = formatMissingSetupMessage(missingSetupItems);

  const openForm = () => {
    if (missingSetupMessage) {
      setFormError(missingSetupMessage);
      setSuccessMessage(null);
      return;
    }
    setForm(emptyFormState());
    setFormError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (createSubscription.isPending) return;
    setIsFormOpen(false);
    setForm(emptyFormState());
    setFormError(null);
  };

  const validateForm = (): string | null => {
    if (!form.primary_member_id) return 'Select an active member before admission.';
    if (!form.branch_id) return 'Select a branch before admission.';
    if (!form.membership_plan_id) return 'Select an active membership plan.';
    if (!form.start_date) return 'Select a start date.';
    const plan = planById.get(form.membership_plan_id);
    if (!plan || !isPlanAvailableForBranch(plan, form.branch_id)) {
      return 'This membership plan is not available for the selected branch.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const subscription = await createSubscription.mutateAsync(buildCreatePayload(form));
      setSuccessMessage(`Subscription ${subscription.subscription_code} created successfully.`);
      closeForm();
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Unable to create subscription. Please try again.'));
    }
  };

  const handleBranchChange = (branchId: string) => {
    setForm((current) => {
      const plan = current.membership_plan_id ? planById.get(current.membership_plan_id) : undefined;
      const shouldClearPlan = plan && branchId && !isPlanAvailableForBranch(plan, branchId);
      return {
        ...current,
        branch_id: branchId,
        membership_plan_id: shouldClearPlan ? '' : current.membership_plan_id,
      };
    });
  };

  const isLoading = membersQuery.isLoading || plansQuery.isLoading || subscriptionsQuery.isLoading || branchesLoading;

  if (!orgId) {
    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader title="Admissions & Subscriptions" category="Management" />
        <Card className="flex items-center gap-3 text-[13px] text-[var(--red)]">
          <AlertTriangle size={18} />
          <span>Organization context not available. Please sign in again.</span>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Admissions & Subscriptions"
        category="Management"
        action={
          <Button variant="primary" onClick={openForm} className="gap-2" title={missingSetupMessage ?? undefined}>
            <Plus size={14} />
            <span>Admit Member</span>
          </Button>
        }
      />

      {successMessage && (
        <div className="p-3 rounded-md border border-[var(--green)]/30 text-[13px] text-[var(--green)] bg-[var(--green)]/10">
          {successMessage}
        </div>
      )}

      {formError && !isFormOpen && (
        <div className="p-3 rounded-md border border-[var(--red)]/30 text-[13px] text-[var(--red)] bg-[var(--red)]/10">
          {formError}
        </div>
      )}

      {missingSetupMessage && (
        <Card className="flex items-center gap-3 text-[13px] text-[var(--text-secondary)]">
          <AlertTriangle size={18} className="text-[var(--accent)]" />
          <span>{missingSetupMessage}</span>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
            Subscriptions
          </div>
          <div className="text-[32px] font-light text-[var(--text-primary)] mt-2 leading-none">
            {subscriptionsQuery.data?.total ?? 0}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Loaded from backend</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Active</div>
          <div className="text-[32px] font-light text-[var(--green)] mt-2 leading-none">{activeSubscriptionCount}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Current active records</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
            Active Members
          </div>
          <div className="text-[32px] font-light text-[var(--accent)] mt-2 leading-none">{activeMembers.length}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Available for admission</div>
        </Card>

        <Card className="flex flex-col justify-between py-5 px-6">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Slots</div>
          <div className="text-[32px] font-light text-[var(--text-secondary)] mt-2 leading-none">{totalActiveSlots}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 font-normal">Active primary slots loaded</div>
        </Card>
      </div>

      {(membersQuery.error || plansQuery.error || subscriptionsQuery.error || branchError) && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--red)] mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Some subscription data could not load</h3>
              <p className="text-[12px] text-[var(--text-muted)]">
                {getApiErrorMessage(
                  membersQuery.error ?? plansQuery.error ?? subscriptionsQuery.error,
                  branchError || 'Refresh the data and try again.'
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => membersQuery.refetch()}>
              <RefreshCw size={14} />
              Members
            </Button>
            <Button variant="secondary" onClick={() => plansQuery.refetch()}>
              <RefreshCw size={14} />
              Plans
            </Button>
            <Button variant="secondary" onClick={() => subscriptionsQuery.refetch()}>
              <RefreshCw size={14} />
              Subscriptions
            </Button>
            <Button variant="secondary" onClick={loadBranches}>
              <RefreshCw size={14} />
              Branches
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </Card>
      ) : subscriptions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <Users size={40} className="text-[var(--text-muted)] opacity-60" />
          <div className="space-y-1">
            <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">No subscriptions yet</h3>
            <p className="text-[12px] text-[var(--text-muted)] max-w-xs">
              Admit an active member to a branch and membership plan to create the first subscription.
            </p>
          </div>
          <Button variant="primary" onClick={openForm} title={missingSetupMessage ?? undefined}>
            <Plus size={14} />
            Admit Member
          </Button>
        </Card>
      ) : (
        <>
          <div className="hidden lg:block overflow-hidden border border-[var(--border-default)] rounded-[var(--radius-lg)]">
            <table className="w-full text-left border-collapse bg-[var(--bg-surface)]">
              <thead>
                <tr className="bg-[var(--bg-page)] text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase font-semibold border-b border-[var(--border-default)]">
                  <th className="py-4 px-6">Subscription</th>
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6">Branch</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Price</th>
                  <th className="py-4 px-6">Valid Window</th>
                  <th className="py-4 px-6 text-right">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)] text-[13px] text-[var(--text-primary)]">
                {subscriptions.map((subscription) => (
                  <SubscriptionRow
                    key={subscription.id}
                    subscription={subscription}
                    member={memberById.get(subscription.primary_member_id)}
                    plan={planById.get(subscription.membership_plan_id)}
                    branchName={branchById.get(subscription.branch_id)?.name}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                member={memberById.get(subscription.primary_member_id)}
                plan={planById.get(subscription.membership_plan_id)}
                branchName={branchById.get(subscription.branch_id)?.name}
              />
            ))}
          </div>
        </>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Admission
                </div>
                <h2 className="text-[18px] font-medium text-[var(--text-primary)]">Create subscription</h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Close admission form"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-md border border-[var(--red)]/30 text-[13px] text-[var(--red)] bg-[var(--red)]/10">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Member"
                  value={form.primary_member_id}
                  onChange={(value) => setForm((current) => ({ ...current, primary_member_id: value }))}
                  required
                >
                  <option value="">Select active member</option>
                  {activeMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} · {member.phone}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Branch" value={form.branch_id} onChange={handleBranchChange} required>
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                      {branch.city ? ` · ${branch.city}` : ''}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="Membership Plan"
                  value={form.membership_plan_id}
                  onChange={(value) => setForm((current) => ({ ...current, membership_plan_id: value }))}
                  required
                  disabled={!form.branch_id}
                >
                  <option value="">{form.branch_id ? 'Select active plan' : 'Select branch first'}</option>
                  {availablePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} · {formatMoney(plan.price, plan.currency)}
                      {plan.branch_id ? ' · Branch-specific' : ' · Org-wide'}
                    </option>
                  ))}
                </SelectField>

                <Input
                  label="Start Date"
                  type="date"
                  value={form.start_date}
                  onChange={(event) => setForm((current) => ({ ...current, start_date: event.target.value }))}
                  required
                />
              </div>

              {!form.branch_id && (
                <div className="p-3 rounded-md border border-[var(--accent)]/30 text-[13px] text-[var(--accent-text)] bg-[var(--accent-subtle)]">
                  Select a branch before choosing a plan. Active org-wide and matching branch plans will be available.
                </div>
              )}

              <PlanPreview plan={selectedPlan} endDate={previewEndDate} lastValidDay={previewLastValidDay} />

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={closeForm} disabled={createSubscription.isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createSubscription.isPending}>
                  {createSubscription.isPending ? 'Creating...' : 'Create Subscription'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

function SelectField({ label, value, onChange, children, required, disabled }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] tracking-[0.08em] text-[var(--text-muted)] uppercase font-semibold">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2.5 text-[16px] md:text-[14px] text-[var(--text-primary)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {children}
      </select>
    </div>
  );
}

function PlanPreview({
  plan,
  endDate,
  lastValidDay,
}: {
  plan?: MembershipPlan;
  endDate: string | null;
  lastValidDay: string | null;
}) {
  if (!plan) {
    return (
      <Card className="bg-[var(--bg-page)]">
        <div className="flex items-center gap-3 text-[13px] text-[var(--text-muted)]">
          <CalendarDays size={18} />
          <span>Plan price, duration, end date, and capacity preview will appear after plan selection.</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--bg-page)] space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold">
            Preview
          </div>
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">{plan.name}</h3>
        </div>
        <Badge variant="healthy">Active</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
        <PreviewItem label="Price" value={formatMoney(plan.price, plan.currency)} />
        <PreviewItem label="Duration" value={formatDuration(plan.duration_value, plan.duration_unit)} />
        <PreviewItem label="Backend End Date" value={endDate ? formatDate(endDate) : 'Calculated after creation'} />
        <PreviewItem label="Last Valid Day" value={lastValidDay ? formatDate(lastValidDay) : 'Calculated after creation'} />
      </div>
      <div className="text-[12px] text-[var(--text-muted)]">
        This plan allows up to {plan.max_members} {plan.max_members === 1 ? 'member' : 'members'}. Additional slots can be
        managed later.
      </div>
    </Card>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">{label}</span>
      <span className="font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function SubscriptionRow({
  subscription,
  member,
  plan,
  branchName,
}: {
  subscription: MemberSubscriptionV2;
  member?: Member;
  plan?: MembershipPlan;
  branchName?: string;
}) {
  const activeSlotCount = subscription.members?.filter((slot) => slot.is_active).length ?? 1;

  return (
    <tr className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
      <td className="py-4 px-6">
        <div className="font-medium">{subscription.subscription_code}</div>
        <div className="text-[11px] text-[var(--text-muted)]">UID {subscription.id}</div>
      </td>
      <td className="py-4 px-6">
        <div className="font-medium">{member?.name ?? subscription.primary_member_id}</div>
        <div className="text-[11px] text-[var(--text-muted)]">{member?.phone ?? 'Member ID shown'}</div>
      </td>
      <td className="py-4 px-6 text-[var(--text-secondary)]">{plan?.name ?? subscription.membership_plan_id}</td>
      <td className="py-4 px-6 text-[var(--text-secondary)]">{branchName ?? subscription.branch_id}</td>
      <td className="py-4 px-6 text-center">
        <Badge variant={getStatusBadgeVariant(subscription.status)}>{titleCase(subscription.status)}</Badge>
      </td>
      <td className="py-4 px-6 text-right font-mono font-medium">
        {formatMoney(subscription.price_snapshot, subscription.currency_code)}
      </td>
      <td className="py-4 px-6 text-[var(--text-secondary)]">
        <div>{formatDate(subscription.start_date)}</div>
        <div className="text-[11px] text-[var(--text-muted)]">Ends {formatDate(subscription.end_date)}</div>
      </td>
      <td className="py-4 px-6 text-right">
        {activeSlotCount}/{subscription.max_members_snapshot}
      </td>
    </tr>
  );
}

function SubscriptionCard({
  subscription,
  member,
  plan,
  branchName,
}: {
  subscription: MemberSubscriptionV2;
  member?: Member;
  plan?: MembershipPlan;
  branchName?: string;
}) {
  const activeSlotCount = subscription.members?.filter((slot) => slot.is_active).length ?? 1;

  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-[14px] text-[var(--text-primary)] truncate">
            {member?.name ?? subscription.primary_member_id}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] truncate">{subscription.subscription_code}</div>
        </div>
        <Badge variant={getStatusBadgeVariant(subscription.status)}>{titleCase(subscription.status)}</Badge>
      </div>

      <div className="pt-2 border-t border-[var(--border-default)] grid grid-cols-2 gap-3 text-[12px]">
        <PreviewItem label="Plan" value={plan?.name ?? subscription.membership_plan_id} />
        <PreviewItem label="Branch" value={branchName ?? subscription.branch_id} />
        <PreviewItem label="Price" value={formatMoney(subscription.price_snapshot, subscription.currency_code)} />
        <PreviewItem label="Capacity" value={`${activeSlotCount}/${subscription.max_members_snapshot}`} />
        <PreviewItem label="Start" value={formatDate(subscription.start_date)} />
        <PreviewItem label="End" value={formatDate(subscription.end_date)} />
      </div>

      <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
        <CheckCircle2 size={14} className="text-[var(--green)]" />
        <span>Primary member slot created</span>
      </div>
    </Card>
  );
}
