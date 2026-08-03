import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BranchManagementSection } from './BranchManagementSection';

const apiMocks = vi.hoisted(() => ({
  getAuthTokenPayload: vi.fn(),
  fetchBranches: vi.fn(),
  addBranch: vi.fn(),
  deleteBranch: vi.fn(),
  updateBranch: vi.fn(),
  updateAddress: vi.fn(),
  transitionBranchStatus: vi.fn(),
  pollTransitionStatus: vi.fn(),
}));

vi.mock('@/shared/services/api/client', () => apiMocks);

vi.mock('./BranchContactsSection', () => ({
  BranchContactsSection: ({ branchId }: { branchId: string }) => <div>Contacts for {branchId}</div>,
}));

vi.mock('./BranchOperatingHoursSection', () => ({
  BranchOperatingHoursSection: ({ branchId }: { branchId: string }) => <div>Hours for {branchId}</div>,
}));

const ownerPayload = { org_id: 'org_1', role: 'owner', sub: 'staff_1' };
const managerPayload = { org_id: 'org_1', role: 'manager', sub: 'staff_2' };

const branchA = {
  id: 'branch_a',
  name: 'Downtown Branch',
  internal_code: 'TFD-01',
  gymu_id: 'TFD-01',
  status: 'ACTIVE' as const,
  contact_email: 'downtown@example.com',
  contact_phone: '9876543210',
  address_id: 'address_a',
  address_line1: '1 Main Road',
  address_city: 'Chennai',
  address_state: 'TN',
  address_pincode: '600001',
};

const branchB = {
  id: 'branch_b',
  name: 'Uptown Branch',
  internal_code: 'TFD-02',
  gymu_id: 'TFD-02',
  status: 'ACTIVE' as const,
  contact_email: 'uptown@example.com',
  contact_phone: '9876543220',
  address_id: 'address_b',
  address_line1: '2 North Road',
  address_city: 'Chennai',
  address_state: 'TN',
  address_pincode: '600002',
};

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function arrangeBranches({ role = ownerPayload, branches = [branchA, branchB] } = {}) {
  Object.values(apiMocks).forEach((mock) => mock.mockReset());
  apiMocks.getAuthTokenPayload.mockReturnValue(role);
  apiMocks.fetchBranches.mockResolvedValue({ data: { data: branches } });
  apiMocks.addBranch.mockResolvedValue({ data: { data: {} } });
  apiMocks.deleteBranch.mockResolvedValue({ data: { data: { message: 'Branch removed from the active list.' } } });
  apiMocks.updateBranch.mockResolvedValue({ data: { data: {} } });
  apiMocks.updateAddress.mockResolvedValue({ data: { data: {} } });
  apiMocks.transitionBranchStatus.mockResolvedValue({ data: { data: {} } });
  apiMocks.pollTransitionStatus.mockResolvedValue({ data: { data: { lifecycle_transition_in_progress: false } } });
}

async function renderSection() {
  render(<BranchManagementSection />);
  await screen.findByText('Downtown Branch');
  await screen.findByText('Uptown Branch');
}

function branchScope(branchName: string) {
  const heading = screen.getByRole('heading', { name: branchName });
  const card = heading.closest('.overflow-hidden');
  if (!card) throw new Error(`Branch card for ${branchName} was not found`);
  return within(card as HTMLElement);
}

function removalTriggers() {
  return screen.getAllByTitle('Remove from active branches');
}

function removalTriggerFor(branchName: string) {
  return branchScope(branchName).getByTitle('Remove from active branches');
}

function editTriggers() {
  return ['Downtown Branch', 'Uptown Branch'].map((branchName) => {
    const editButton = branchScope(branchName).getAllByRole('button').find((button) => (
      button.querySelector('svg') && !button.getAttribute('title') && button.textContent === ''
    ));
    if (!editButton) throw new Error(`Edit trigger for ${branchName} was not found`);
    return editButton;
  });
}

async function openRemoval(index = 0) {
  const user = userEvent.setup();
  await renderSection();
  const trigger = removalTriggers()[index];
  await user.click(trigger);
  return { user, trigger };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  arrangeBranches();
});

describe('BranchManagementSection branch active-list removal', () => {
  it('opens branch-removal confirmation without mutation', async () => {
    const { trigger } = await openRemoval(0);

    expect(trigger).toBeVisible();
    expect(screen.getByRole('alertdialog', { name: 'Remove branch from active list' })).toHaveAccessibleDescription(
      'Mark “Downtown Branch” inactive and remove it from the active branch list? This action cannot be undone from this screen.'
    );
    expect(apiMocks.deleteBranch).not.toHaveBeenCalled();
    expect(screen.queryByText('Delete Branch')).not.toBeInTheDocument();
    expect(screen.queryByText(/soft-delete the branch/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cannot be undone from the UI/i)).not.toBeInTheDocument();
  });

  it('cancels branch removal without mutation and restores focus', async () => {
    const { user, trigger } = await openRemoval(0);

    await user.click(screen.getByRole('button', { name: 'Keep branch' }));

    expect(apiMocks.deleteBranch).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('removes the exact selected branch once', async () => {
    apiMocks.fetchBranches
      .mockResolvedValueOnce({ data: { data: [branchA, branchB] } })
      .mockResolvedValueOnce({ data: { data: [branchA] } });
    const { user } = await openRemoval(1);

    await user.click(screen.getByRole('button', { name: 'Remove branch' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1);
    expect(apiMocks.deleteBranch).toHaveBeenCalledWith('branch_b');
    expect(apiMocks.fetchBranches).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Uptown Branch')).not.toBeInTheDocument();
    expect(screen.getByText('Downtown Branch')).toBeInTheDocument();
  });

  it('retains branch-removal confirmation and values when deletion fails', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    apiMocks.deleteBranch.mockRejectedValueOnce(new Error('Removal failed'));
    const { user } = await openRemoval(0);

    await user.click(screen.getByRole('button', { name: 'Remove branch' }));

    expect(await screen.findByText('Removal failed')).toBeVisible();
    expect(screen.getByRole('alertdialog', { name: 'Remove branch from active list' })).toHaveAccessibleDescription(
      'Mark “Downtown Branch” inactive and remove it from the active branch list? This action cannot be undone from this screen.'
    );
    expect(screen.getByText('Downtown Branch')).toBeInTheDocument();
    expect(screen.getByText('Uptown Branch')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove branch' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Keep branch' })).toBeEnabled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('shows a backend branch-removal detail string', async () => {
    apiMocks.deleteBranch.mockRejectedValueOnce({ response: { data: { detail: 'Branch still has active dependencies' } } });
    const { user } = await openRemoval(0);

    await user.click(screen.getByRole('button', { name: 'Remove branch' }));

    expect(await screen.findByText('Branch still has active dependencies')).toBeVisible();
  });

  it('uses the bounded branch-removal fallback for unusable errors', async () => {
    const fallback = 'The branch could not be removed from the active list. Please try again.';
    const unusableErrors = [
      { response: { data: { detail: { message: 'object detail' } } } },
      { response: { data: { detail: [{ msg: '   ' }, { other: 'missing msg' }] } } },
      'plain string rejection',
      new Error(''),
    ];

    await renderSection();
    for (const error of unusableErrors) {
      apiMocks.deleteBranch.mockRejectedValueOnce(error);
      const user = userEvent.setup();
      await user.click(removalTriggers()[0]);
      await user.click(screen.getByRole('button', { name: 'Remove branch' }));

      expect(await screen.findByText(fallback)).toBeVisible();
      await user.click(screen.getByRole('button', { name: 'Keep branch' }));
    }
  });

  it('blocks duplicate branch removal and all dismissal while pending', async () => {
    const deleteRequest = deferred<void>();
    apiMocks.deleteBranch.mockReturnValueOnce(deleteRequest.promise);
    await renderSection();
    const user = userEvent.setup();
    await user.click(removalTriggers()[0]);
    const confirmButton = screen.getByRole('button', { name: 'Remove branch' });

    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    await waitFor(() => expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: 'Removing…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Keep branch' })).toBeDisabled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('alertdialog', { name: 'Remove branch from active list' })).toBeInTheDocument();
    expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1);

    deleteRequest.resolve();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1);
  });

  it('blocks competing branch actions while removal is pending', async () => {
    const deleteRequest = deferred<void>();
    apiMocks.deleteBranch.mockReturnValueOnce(deleteRequest.promise);
    await renderSection();
    const user = userEvent.setup();
    const addBranchButton = screen.getByRole('button', { name: 'Add Branch' });
    const allEditTriggers = editTriggers();
    const allRemovalTriggers = removalTriggers();
    const branchBRemovalTrigger = removalTriggerFor('Uptown Branch');
    const statusSelects = screen.getAllByRole('combobox');

    await user.click(allRemovalTriggers[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Remove branch' }));
    fireEvent.click(addBranchButton);
    allEditTriggers.forEach((button) => fireEvent.click(button));
    fireEvent.click(branchBRemovalTrigger);
    fireEvent.change(statusSelects[0], { target: { value: 'MAINTENANCE' } });

    await waitFor(() => expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('Basic Information')).not.toBeInTheDocument();
    expect(screen.queryByText('Transition to Maintenance')).not.toBeInTheDocument();
    expect(screen.queryByText('Transition to Decommissioned')).not.toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Remove branch from active list' })).toHaveAccessibleDescription(
      'Mark “Downtown Branch” inactive and remove it from the active branch list? This action cannot be undone from this screen.'
    );
    expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1);
    expect(apiMocks.addBranch).not.toHaveBeenCalled();
    expect(apiMocks.updateBranch).not.toHaveBeenCalled();
    expect(apiMocks.updateAddress).not.toHaveBeenCalled();
    expect(apiMocks.transitionBranchStatus).not.toHaveBeenCalled();
    expect(addBranchButton).toBeDisabled();
    allEditTriggers.forEach((button) => expect(button).toBeDisabled());
    allRemovalTriggers.forEach((trigger) => expect(trigger).toBeDisabled());
    statusSelects.forEach((select) => expect(select).toBeDisabled());

    deleteRequest.resolve();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('clears stale removal errors before selecting another branch', async () => {
    apiMocks.deleteBranch.mockRejectedValueOnce(new Error('First removal failed'));
    const { user } = await openRemoval(0);
    await user.click(screen.getByRole('button', { name: 'Remove branch' }));
    expect(await screen.findByText('First removal failed')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Keep branch' }));
    await user.click(removalTriggers()[1]);

    expect(screen.queryByText('First removal failed')).not.toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Remove branch from active list' })).toHaveAccessibleDescription(
      'Mark “Uptown Branch” inactive and remove it from the active branch list? This action cannot be undone from this screen.'
    );
  });

  it('closes after successful branch removal and safely handles refresh failure', async () => {
    apiMocks.fetchBranches
      .mockResolvedValueOnce({ data: { data: [branchA, branchB] } })
      .mockRejectedValueOnce(new Error('Branches could not be refreshed'));
    apiMocks.deleteBranch.mockResolvedValueOnce({ data: { data: { message: 'Branch removed from the active list.' } } });
    const { user } = await openRemoval(0);

    await user.click(screen.getByRole('button', { name: 'Remove branch' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1);
    expect(apiMocks.deleteBranch).toHaveBeenCalledWith('branch_a');
    expect(apiMocks.fetchBranches).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('The branch could not be removed from the active list. Please try again.')).not.toBeInTheDocument();
    expect(screen.getByText('Branches could not be refreshed')).toBeVisible();
    expect(screen.queryByText('Downtown Branch')).not.toBeInTheDocument();
    expect(screen.getByText('Uptown Branch')).toBeVisible();
    const remainingRemovalTriggers = removalTriggers();
    expect(remainingRemovalTriggers).toHaveLength(1);
    expect(branchScope('Uptown Branch').getByTitle('Remove from active branches')).toBe(remainingRemovalTriggers[0]);
    expect(screen.queryByRole('heading', { name: 'Downtown Branch' })).not.toBeInTheDocument();
    expect(apiMocks.deleteBranch).toHaveBeenCalledTimes(1);
  });

  it('preserves owner-only branch-removal visibility', async () => {
    await renderSection();
    expect(removalTriggers()).toHaveLength(2);
    cleanup();

    arrangeBranches({ role: managerPayload });
    await renderSection();

    expect(screen.queryByTitle('Remove from active branches')).not.toBeInTheDocument();
    expect(apiMocks.deleteBranch).not.toHaveBeenCalled();
  });
});
