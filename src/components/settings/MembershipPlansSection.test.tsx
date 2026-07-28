import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MembershipPlansSection } from './MembershipPlansSection';
import type { MembershipPlan } from '@/features/gym/types/membershipPlans';

const hookMocks = vi.hoisted(() => ({
  useMembershipPlans: vi.fn(),
  useCreateMembershipPlan: vi.fn(),
  useUpdateMembershipPlan: vi.fn(),
  useArchiveMembershipPlan: vi.fn(),
  useActivateMembershipPlan: vi.fn(),
  useDeactivateMembershipPlan: vi.fn(),
}));

vi.mock('@/features/gym/hooks/useMembershipPlans', () => hookMocks);

vi.mock('./MembershipPlanForm', () => ({
  MembershipPlanForm: () => <div data-testid="membership-plan-form" />,
}));

vi.mock('./MembershipPlanEmptyState', () => ({
  MembershipPlanEmptyState: () => <div data-testid="membership-plan-empty-state" />,
}));

const activePlan: MembershipPlan = {
  id: 'plan_monthly',
  org_id: 'org_1',
  branch_id: null,
  plan_code: 'MONTHLY',
  name: 'Monthly Access',
  description: 'Monthly gym access',
  price: 1200,
  currency: 'INR',
  duration_value: 1,
  duration_unit: 'months',
  max_members: 1,
  valid_from: null,
  valid_until: null,
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  archived_at: null,
};

function arrangeSection() {
  const archiveMutate = vi.fn().mockResolvedValue(undefined);
  const deactivateMutate = vi.fn().mockResolvedValue(undefined);

  hookMocks.useMembershipPlans.mockReturnValue({ data: [activePlan], isLoading: false, error: null });
  hookMocks.useCreateMembershipPlan.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
  hookMocks.useUpdateMembershipPlan.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
  hookMocks.useArchiveMembershipPlan.mockReturnValue({ mutateAsync: archiveMutate });
  hookMocks.useActivateMembershipPlan.mockReturnValue({ mutateAsync: vi.fn() });
  hookMocks.useDeactivateMembershipPlan.mockReturnValue({ mutateAsync: deactivateMutate });

  return { archiveMutate, deactivateMutate };
}

describe('MembershipPlansSection confirmations', () => {
  it('successful archive confirmation invokes the archive mutation with the existing plan id and closes', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const { archiveMutate } = arrangeSection();

    render(<MembershipPlansSection />);

    await user.click(screen.getByRole('button', { name: /archive/i }));
    await user.click(screen.getByRole('button', { name: 'Archive plan' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(archiveMutate).toHaveBeenCalledTimes(1);
    expect(archiveMutate).toHaveBeenCalledWith('plan_monthly');
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('successful deactivate confirmation invokes the deactivate mutation with the existing plan id and closes', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const { deactivateMutate } = arrangeSection();

    render(<MembershipPlansSection />);

    await user.click(screen.getByRole('button', { name: /deactivate/i }));
    await user.click(screen.getByRole('button', { name: 'Deactivate plan' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(deactivateMutate).toHaveBeenCalledTimes(1);
    expect(deactivateMutate).toHaveBeenCalledWith('plan_monthly');
    expect(confirmSpy).not.toHaveBeenCalled();
  });
});
