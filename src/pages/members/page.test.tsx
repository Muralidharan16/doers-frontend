import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MembersPage from './page';
import type { Member } from '@/features/members';

const mocks = vi.hoisted(() => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  fetchBranches: vi.fn(),
  getAuthTokenPayload: vi.fn(),
}));

vi.mock('@/shared/services/api/client', () => ({
  apiClient: mocks.apiClient,
  fetchBranches: mocks.fetchBranches,
  getAuthTokenPayload: mocks.getAuthTokenPayload,
}));

const orgId = 'org-1';
const branchId = 'branch-1';

const members: Member[] = [
  {
    id: 'member-a',
    org_id: orgId,
    gym_id: null,
    home_branch_id: branchId,
    member_uid: 'uid-a',
    member_number: 101,
    member_display_code: 'DOERS-101',
    home_branch_name: 'Main Branch',
    has_active_subscription: false,
    active_subscription_id: null,
    name: 'Anika Rao',
    phone: '9876543210',
    email: 'anika@example.com',
    date_of_birth: '1994-01-02',
    gender: 'female',
    blood_group: null,
    emergency_contact_name: '9876543211',
    emergency_contact_phone: null,
    address: null,
    qr_token: 'qr-a',
    status: 'active',
    is_active: true,
    notes: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'member-b',
    org_id: orgId,
    gym_id: null,
    home_branch_id: branchId,
    member_uid: 'uid-b',
    member_number: 102,
    member_display_code: 'DOERS-102',
    home_branch_name: 'Main Branch',
    has_active_subscription: false,
    active_subscription_id: null,
    name: 'Bala Iyer',
    phone: '9876543220',
    email: 'bala@example.com',
    date_of_birth: '1991-05-06',
    gender: 'male',
    blood_group: null,
    emergency_contact_name: '9876543221',
    emergency_contact_phone: null,
    address: null,
    qr_token: 'qr-b',
    status: 'active',
    is_active: true,
    notes: null,
    created_at: '2026-01-02T00:00:00Z',
  },
];

const renderMembersPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const view = render(
    <QueryClientProvider client={queryClient}>
      <MembersPage />
    </QueryClientProvider>
  );

  return { ...view, queryClient };
};

const setupApi = () => {
  mocks.getAuthTokenPayload.mockReturnValue({ org_id: orgId, role: 'owner', sub: 'owner-1' });
  mocks.fetchBranches.mockResolvedValue({
    data: {
      data: [{ id: branchId, name: 'Main Branch', address_city: 'Chennai' }],
    },
  });
  mocks.apiClient.get.mockImplementation((url: string) => {
    if (url === `/organizations/${orgId}/members`) {
      return Promise.resolve({
        data: {
          data: members,
          total: members.length,
          page: 1,
          size: 50,
          pages: 1,
        },
      });
    }
    return Promise.reject(new Error(`Unexpected GET ${url}`));
  });
  mocks.apiClient.delete.mockResolvedValue({ data: { data: { message: 'Member deleted successfully' } } });
};

const getRowRemovalTriggers = () =>
  screen
    .getAllByRole('button', { name: 'Remove from active members' })
    .filter((button) => !button.closest('[role="alertdialog"]'));

const openRemovalDialog = async (triggerIndex = 0) => {
  await screen.findAllByText('Anika Rao');
  const trigger = getRowRemovalTriggers()[triggerIndex];
  fireEvent.click(trigger);
  const dialog = await screen.findByRole('alertdialog', { name: 'Remove member from active list' });
  return { trigger, dialog };
};

const confirmRemoval = (dialog: HTMLElement) => {
  fireEvent.click(within(dialog).getByRole('button', { name: 'Remove from active members' }));
};

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const createDeferred = <T,>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return { promise, resolve, reject };
};

describe('MembersPage member active-list removal confirmation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('opens the removal dialog without mutating or calling native confirm', async () => {
    setupApi();
    const confirmSpy = vi.spyOn(window, 'confirm');
    renderMembersPage();

    await screen.findAllByText('Anika Rao');
    const rowTriggers = getRowRemovalTriggers();
    expect(rowTriggers).toHaveLength(4);

    fireEvent.click(rowTriggers[0]);

    const dialog = await screen.findByRole('alertdialog', { name: 'Remove member from active list' });
    expect(within(dialog).getByText('Remove “Anika Rao” from active members? They will no longer appear in the default active-member list.')).toBeInTheDocument();
    expect(mocks.apiClient.delete).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('cancels without mutation and returns focus to the exact clicked trigger', async () => {
    setupApi();
    renderMembersPage();

    const { trigger, dialog } = await openRemovalDialog();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep active' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog', { name: 'Remove member from active list' })).not.toBeInTheDocument());
    expect(mocks.apiClient.delete).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('successfully removes with the exact organization and member IDs then refreshes the list', async () => {
    setupApi();
    renderMembersPage();

    await screen.findAllByText('Anika Rao');
    const initialListCalls = mocks.apiClient.get.mock.calls.filter(([url]) => url === `/organizations/${orgId}/members`).length;
    const { dialog } = await openRemovalDialog();

    confirmRemoval(dialog);

    await waitFor(() => {
      expect(mocks.apiClient.delete).toHaveBeenCalledTimes(1);
      expect(mocks.apiClient.delete).toHaveBeenCalledWith(`/organizations/${orgId}/members/member-a`);
    });
    await waitFor(() => expect(screen.queryByRole('alertdialog', { name: 'Remove member from active list' })).not.toBeInTheDocument());
    await waitFor(() => {
      const listCalls = mocks.apiClient.get.mock.calls.filter(([url]) => url === `/organizations/${orgId}/members`).length;
      expect(listCalls).toBeGreaterThan(initialListCalls);
    });
    expect(screen.getByText('Member removed from active members.')).toBeInTheDocument();
  });

  it('retains a failed removal in the dialog with a safe Error message and no browser alert', async () => {
    setupApi();
    mocks.apiClient.delete.mockRejectedValueOnce(new Error('Network unavailable'));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderMembersPage();

    const { dialog } = await openRemovalDialog();
    confirmRemoval(dialog);

    expect(await within(dialog).findByText('Network unavailable')).toBeInTheDocument();
    expect(screen.getByRole('alertdialog', { name: 'Remove member from active list' })).toBeInTheDocument();
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Remove from active members' })).toBeEnabled());
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('displays a safe backend detail string when removal fails', async () => {
    setupApi();
    mocks.apiClient.delete.mockRejectedValueOnce({ response: { data: { detail: 'Member is already inactive.' } } });
    renderMembersPage();

    const { dialog } = await openRemovalDialog();
    confirmRemoval(dialog);

    expect(await within(dialog).findByText('Member is already inactive.')).toBeInTheDocument();
  });

  it('uses the bounded fallback for unusable removal error payloads', async () => {
    setupApi();
    mocks.apiClient.delete.mockRejectedValueOnce({ response: { data: { detail: { message: 'object detail' } } } });
    renderMembersPage();

    const { dialog } = await openRemovalDialog();
    confirmRemoval(dialog);

    expect(await within(dialog).findByText('The member could not be removed from active members. Please try again.')).toBeInTheDocument();
  });

  it('blocks duplicate requests, competing triggers, cancel and Escape while removal is pending', async () => {
    setupApi();
    const deferred = createDeferred<{ data: unknown }>();
    mocks.apiClient.delete.mockReturnValueOnce(deferred.promise);
    renderMembersPage();

    const { dialog } = await openRemovalDialog();
    const confirmButton = within(dialog).getByRole('button', { name: 'Remove from active members' });
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    await waitFor(() => expect(mocks.apiClient.delete).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Removing…' })).toBeDisabled());
    expect(within(dialog).getByRole('button', { name: 'Keep active' })).toBeDisabled();
    for (const trigger of getRowRemovalTriggers()) {
      expect(trigger).toBeDisabled();
    }

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('alertdialog', { name: 'Remove member from active list' })).toBeInTheDocument();

    deferred.resolve({ data: {} });
    await waitFor(() => expect(screen.queryByRole('alertdialog', { name: 'Remove member from active list' })).not.toBeInTheDocument());
    expect(mocks.apiClient.delete).toHaveBeenCalledTimes(1);
  });

  it('clears stale removal errors when a different member removal dialog opens', async () => {
    setupApi();
    mocks.apiClient.delete.mockRejectedValueOnce(new Error('First member failed'));
    renderMembersPage();

    const first = await openRemovalDialog(0);
    confirmRemoval(first.dialog);
    expect(await within(first.dialog).findByText('First member failed')).toBeInTheDocument();

    fireEvent.click(within(first.dialog).getByRole('button', { name: 'Keep active' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog', { name: 'Remove member from active list' })).not.toBeInTheDocument());

    const secondTrigger = getRowRemovalTriggers()[1];
    fireEvent.click(secondTrigger);
    const secondDialog = await screen.findByRole('alertdialog', { name: 'Remove member from active list' });
    expect(within(secondDialog).queryByText('First member failed')).not.toBeInTheDocument();
    expect(within(secondDialog).getByText('Remove “Bala Iyer” from active members? They will no longer appear in the default active-member list.')).toBeInTheDocument();
  });

  it('cancels from the mobile removal action and returns focus to that exact trigger', async () => {
    setupApi();
    renderMembersPage();

    await screen.findAllByText('Bala Iyer');
    const mobileMemberName = screen
      .getAllByText('Bala Iyer')
      .find((element) => element.className.includes('font-semibold'));
    expect(mobileMemberName).toBeDefined();

    const mobileCard = mobileMemberName?.closest('.space-y-4');
    expect(mobileCard).toBeInstanceOf(HTMLElement);

    const mobileAction = within(mobileCard as HTMLElement).getByRole('button', {
      name: 'Remove from active members',
    });
    fireEvent.click(mobileAction);

    const dialog = await screen.findByRole('alertdialog', { name: 'Remove member from active list' });
    expect(within(dialog).getByText('Remove “Bala Iyer” from active members? They will no longer appear in the default active-member list.')).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep active' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog', { name: 'Remove member from active list' })).not.toBeInTheDocument());
    expect(mocks.apiClient.delete).not.toHaveBeenCalled();
    await waitFor(() => expect(mobileAction).toHaveFocus());
  });

  it('closes after successful removal when the active-member refetch fails without allowing another removal', async () => {
    setupApi();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    let memberListGetCount = 0;
    mocks.apiClient.get.mockImplementation((url: string) => {
      if (url === `/organizations/${orgId}/members`) {
        memberListGetCount += 1;
        if (memberListGetCount === 1) {
          return Promise.resolve({
            data: {
              data: members,
              total: members.length,
              page: 1,
              size: 50,
              pages: 1,
            },
          });
        }
        return Promise.reject(new Error('Active members could not be refreshed'));
      }
      return Promise.reject(new Error(`Unexpected GET ${url}`));
    });
    mocks.apiClient.delete.mockResolvedValueOnce({ data: { data: { message: 'Member deleted successfully' } } });
    renderMembersPage();

    const { dialog } = await openRemovalDialog();
    confirmRemoval(dialog);

    await waitFor(() => {
      expect(mocks.apiClient.delete).toHaveBeenCalledTimes(1);
      expect(mocks.apiClient.delete).toHaveBeenCalledWith(`/organizations/${orgId}/members/member-a`);
    });
    await waitFor(() => expect(memberListGetCount).toBeGreaterThan(1));
    await waitFor(() => expect(screen.queryByRole('alertdialog', { name: 'Remove member from active list' })).not.toBeInTheDocument());

    expect(screen.queryByText('The member could not be removed from active members. Please try again.')).not.toBeInTheDocument();
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Removing…' })).not.toBeInTheDocument();
    expect(screen.getByText('Unable to load members')).toBeInTheDocument();
    expect(screen.getByText('The member registry could not be loaded.')).toBeInTheDocument();
    expect(screen.queryByText('Anika Rao')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove from active members' })).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('alertdialog', { name: 'Remove member from active list' })).not.toBeInTheDocument();
    expect(mocks.apiClient.delete).toHaveBeenCalledTimes(1);
  });

});
