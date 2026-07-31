import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BranchContactsSection } from './BranchContactsSection';
import type { BranchContact } from '@/features/gym/types/branchContacts';

const apiMocks = vi.hoisted(() => ({
  getBranchContacts: vi.fn(),
  createBranchContact: vi.fn(),
  updateBranchContact: vi.fn(),
  deleteBranchContact: vi.fn(),
  promoteBranchContact: vi.fn(),
}));

vi.mock('@/features/gym/services/branchContactsApi', () => apiMocks);

const phoneContact: BranchContact = {
  id: 'contact_phone',
  branch_id: 'branch_1',
  contact_kind: 'phone',
  contact_label: 'Front Desk',
  visibility_scope: 'public',
  is_primary: true,
  phone_number: '9876543210',
  country_code: 'IN',
  phone_e164: '+919876543210',
  channel_capabilities: { whatsapp: true, sms: true, voice: true, fax: false },
};

const emailContact: BranchContact = {
  id: 'contact_email',
  branch_id: 'branch_1',
  contact_kind: 'email',
  contact_label: 'Manager',
  visibility_scope: 'internal',
  is_primary: false,
  email: 'manager@example.com',
  email_normalized: 'manager@example.com',
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

function arrangeContacts(contacts: BranchContact[] = [phoneContact, emailContact]) {
  apiMocks.getBranchContacts.mockResolvedValue(contacts);
  apiMocks.createBranchContact.mockResolvedValue(undefined);
  apiMocks.updateBranchContact.mockResolvedValue(undefined);
  apiMocks.deleteBranchContact.mockResolvedValue(undefined);
  apiMocks.promoteBranchContact.mockResolvedValue(undefined);
}

async function renderSection() {
  render(<BranchContactsSection branchId="branch_1" />);
  await screen.findByText('+919876543210');
}

describe('BranchContactsSection delete confirmation', () => {
  beforeEach(() => {
    arrangeContacts();
  });

  it('opens the delete dialog without mutation or native browser confirmation', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    await renderSection();
    await user.click(screen.getAllByTitle('Delete Contact')[0]);

    expect(screen.getByRole('alertdialog', { name: 'Delete branch contact' })).toHaveAccessibleDescription('Delete “+919876543210” from this branch?');
    expect(screen.getByRole('button', { name: 'Keep contact' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Delete contact' })).toBeEnabled();
    expect(apiMocks.deleteBranchContact).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('cancel closes the delete dialog without deleting and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    await renderSection();
    const trigger = screen.getAllByTitle('Delete Contact')[0];
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Keep contact' }));

    expect(apiMocks.deleteBranchContact).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('successful confirmation deletes the selected contact and refetches contacts', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');

    await renderSection();
    await user.click(screen.getAllByTitle('Delete Contact')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete contact' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledTimes(1);
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledWith('branch_1', 'contact_phone');
    expect(apiMocks.getBranchContacts).toHaveBeenCalledTimes(2);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('failed deletion retains the dialog error UI and avoids native browser alerts', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    apiMocks.deleteBranchContact.mockRejectedValueOnce(new Error('Delete failed'));

    await renderSection();
    await user.click(screen.getAllByTitle('Delete Contact')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete contact' }));

    expect(await screen.findByText('Delete failed')).toBeVisible();
    expect(screen.getByRole('alertdialog', { name: 'Delete branch contact' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete contact' })).toBeEnabled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('shows a backend delete detail when the API provides one', async () => {
    const user = userEvent.setup();
    apiMocks.deleteBranchContact.mockRejectedValueOnce({ response: { data: { detail: 'Backend refused delete' } } });

    await renderSection();
    await user.click(screen.getAllByTitle('Delete Contact')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete contact' }));

    expect(await screen.findByText('Backend refused delete')).toBeVisible();
  });

  it('falls back to the retained delete error copy when the API error has no usable detail', async () => {
    const user = userEvent.setup();
    apiMocks.deleteBranchContact.mockRejectedValueOnce({ response: { data: { detail: '' } } });

    await renderSection();
    await user.click(screen.getAllByTitle('Delete Contact')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete contact' }));

    expect(await screen.findByText('The branch contact could not be deleted. Please try again.')).toBeVisible();
  });

  it('keeps deletion pending guarded against duplicate confirmation and escape dismissal', async () => {
    const user = userEvent.setup();
    const deleteRequest = deferred<void>();
    apiMocks.deleteBranchContact.mockReturnValueOnce(deleteRequest.promise);

    await renderSection();
    await user.click(screen.getAllByTitle('Delete Contact')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete contact' }));

    await waitFor(() => expect(apiMocks.deleteBranchContact).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button', { name: 'Deleting…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Keep contact' })).toBeDisabled();
    screen.getAllByTitle('Delete Contact').forEach((trigger) => {
      expect(trigger).toBeDisabled();
    });

    await user.click(screen.getByRole('button', { name: 'Deleting…' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('alertdialog', { name: 'Delete branch contact' })).toBeInTheDocument();
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledTimes(1);

    deleteRequest.resolve();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledTimes(1);
    expect(apiMocks.getBranchContacts).toHaveBeenCalledTimes(2);
  });

  it('successful deletion closes the dialog and shows the contact refresh error when refetch fails', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm');
    apiMocks.getBranchContacts
      .mockResolvedValueOnce([phoneContact, emailContact])
      .mockRejectedValueOnce(new Error('Contacts could not be refreshed'));
    apiMocks.deleteBranchContact.mockResolvedValueOnce(undefined);

    render(<BranchContactsSection branchId="branch_1" />);
    await screen.findByText('+919876543210');
    await user.click(screen.getAllByTitle('Delete Contact')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete contact' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledTimes(1);
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledWith('branch_1', 'contact_phone');
    expect(apiMocks.getBranchContacts).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('The branch contact could not be deleted. Please try again.')).not.toBeInTheDocument();
    expect(screen.getByText('Contacts could not be refreshed')).toBeVisible();
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledTimes(1);
  });

  it('clears stale delete errors before opening a new delete attempt for another contact', async () => {
    const user = userEvent.setup();
    apiMocks.deleteBranchContact.mockRejectedValueOnce(new Error('First delete failed'));

    await renderSection();
    await user.click(screen.getAllByTitle('Delete Contact')[0]);
    await user.click(screen.getByRole('button', { name: 'Delete contact' }));
    expect(await screen.findByText('First delete failed')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Keep contact' }));
    await user.click(screen.getAllByTitle('Delete Contact')[1]);

    expect(screen.getByRole('alertdialog', { name: 'Delete branch contact' })).toHaveAccessibleDescription('Delete “manager@example.com” from this branch?');
    expect(screen.queryByText('First delete failed')).not.toBeInTheDocument();
    expect(apiMocks.deleteBranchContact).toHaveBeenCalledTimes(1);
  });
});
