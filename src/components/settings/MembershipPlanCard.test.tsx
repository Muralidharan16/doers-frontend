import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MembershipPlanCard } from './MembershipPlanCard';
import type { MembershipPlan } from '@/features/gym/types/membershipPlans';

const basePlan: MembershipPlan = {
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

function renderCard(overrides: Partial<React.ComponentProps<typeof MembershipPlanCard>> = {}) {
  const props = {
    plan: basePlan,
    onEdit: vi.fn(),
    onArchive: vi.fn().mockResolvedValue(undefined),
    onActivate: vi.fn().mockResolvedValue(undefined),
    onDeactivate: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  render(<MembershipPlanCard {...props} />);
  return props;
}

describe('MembershipPlanCard confirmations', () => {
  it('archive trigger opens an application dialog without mutation or native confirm', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const props = renderCard();

    await user.click(screen.getByRole('button', { name: /archive/i }));

    expect(screen.getByRole('alertdialog', { name: 'Archive membership plan' })).toHaveAccessibleDescription('Archive “Monthly Access”?');
    expect(props.onArchive).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('archive cancel closes without archive callback', async () => {
    const user = userEvent.setup();
    const props = renderCard();

    await user.click(screen.getByRole('button', { name: /archive/i }));
    await user.click(screen.getByRole('button', { name: 'Keep plan' }));

    expect(props.onArchive).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('archive failure remains visible and leaves the dialog open', async () => {
    const user = userEvent.setup();
    renderCard({
      onArchive: vi.fn().mockRejectedValue(new Error('Backend rejected archive')),
    });

    await user.click(screen.getByRole('button', { name: /archive/i }));
    await user.click(screen.getByRole('button', { name: 'Archive plan' }));

    expect(await screen.findByText('Backend rejected archive')).toBeVisible();
    expect(screen.getByRole('alertdialog', { name: 'Archive membership plan' })).toBeInTheDocument();
  });


  it('deactivate trigger opens an application dialog and cancel closes without mutation', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const props = renderCard();

    await user.click(screen.getByRole('button', { name: /deactivate/i }));

    expect(screen.getByRole('alertdialog', { name: 'Deactivate membership plan' })).toHaveAccessibleDescription('Deactivate “Monthly Access”?');
    expect(props.onDeactivate).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Keep active' }));

    expect(props.onDeactivate).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('deactivate failure remains visible and available for retry without native confirm', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const onDeactivate = vi.fn().mockRejectedValue(new Error('Backend rejected deactivate'));
    renderCard({ onDeactivate });

    await user.click(screen.getByRole('button', { name: /deactivate/i }));
    await user.click(screen.getByRole('button', { name: 'Deactivate plan' }));

    expect(onDeactivate).toHaveBeenCalledTimes(1);
    expect(onDeactivate).toHaveBeenCalledWith('plan_monthly');
    expect(await screen.findByText('Backend rejected deactivate')).toBeVisible();
    expect(screen.getByRole('alertdialog', { name: 'Deactivate membership plan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deactivate plan' })).toBeEnabled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('deactivate confirmation invokes the exact plan id once without native confirm', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const props = renderCard();

    await user.click(screen.getByRole('button', { name: /deactivate/i }));
    await user.click(screen.getByRole('button', { name: 'Deactivate plan' }));

    expect(props.onDeactivate).toHaveBeenCalledTimes(1);
    expect(props.onDeactivate).toHaveBeenCalledWith('plan_monthly');
    expect(confirmSpy).not.toHaveBeenCalled();
  });
});
