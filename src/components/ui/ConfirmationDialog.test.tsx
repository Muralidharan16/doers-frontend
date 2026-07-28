import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import React, { useRef, useState } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';

function renderDialog(overrides: Partial<React.ComponentProps<typeof ConfirmationDialog>> = {}) {
  const props = {
    open: true,
    title: 'Archive membership plan',
    description: 'Archive “Monthly Access”?',
    cancelLabel: 'Keep plan',
    confirmLabel: 'Archive plan',
    pendingLabel: 'Archiving…',
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
    ...overrides,
  };

  render(<ConfirmationDialog {...props} />);
  return props;
}

describe('ConfirmationDialog', () => {
  it('does not render when closed', () => {
    renderDialog({ open: false });

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('exposes an accessible alert-dialog name and description', () => {
    renderDialog();

    const dialog = screen.getByRole('alertdialog', { name: 'Archive membership plan' });
    expect(dialog).toHaveAccessibleDescription('Archive “Monthly Access”?');
  });

  it('cancel calls only onCancel', async () => {
    const user = userEvent.setup();
    const props = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Keep plan' }));

    expect(props.onCancel).toHaveBeenCalledTimes(1);
    expect(props.onConfirm).not.toHaveBeenCalled();
  });

  it('Escape cancels when idle', () => {
    const props = renderDialog();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('pending state disables actions and blocks Escape', () => {
    const props = renderDialog({ pending: true });

    expect(screen.getByRole('button', { name: 'Keep plan' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Archiving…' })).toBeDisabled();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(props.onCancel).not.toHaveBeenCalled();
  });

  it('confirm calls onConfirm once despite repeated activation while pending', async () => {
    const user = userEvent.setup();
    let resolveConfirm!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => {
      resolveConfirm = resolve;
    }));
    renderDialog({ onConfirm });

    const confirmButton = screen.getByRole('button', { name: 'Archive plan' });
    await user.click(confirmButton);
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    resolveConfirm();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Archive plan' })).toBeEnabled());
  });

  it('shows inline error content', () => {
    renderDialog({ error: 'The membership plan could not be updated. Please try again.' });

    expect(screen.getByText('The membership plan could not be updated. Please try again.')).toBeVisible();
  });

  it('returns focus to the trigger after close', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      const triggerRef = useRef<HTMLButtonElement>(null);

      return (
        <>
          <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
            Open confirmation
          </button>
          <ConfirmationDialog
            open={open}
            title="Archive membership plan"
            description="Archive “Monthly Access”?"
            cancelLabel="Keep plan"
            confirmLabel="Archive plan"
            triggerRef={triggerRef}
            onCancel={() => setOpen(false)}
            onConfirm={vi.fn()}
          />
        </>
      );
    }

    const { unmount } = render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open confirmation' }));
    await user.click(screen.getByRole('button', { name: 'Keep plan' }));

    expect(screen.getByRole('button', { name: 'Open confirmation' })).toHaveFocus();
    unmount();

    function MissingTriggerHarness() {
      const [open, setOpen] = useState(true);
      const missingTriggerRef = useRef<HTMLButtonElement>(null);

      return (
        <ConfirmationDialog
          open={open}
          title="Archive membership plan"
          description="Archive “Monthly Access”?"
          cancelLabel="Keep plan"
          confirmLabel="Archive plan"
          triggerRef={missingTriggerRef}
          onCancel={() => setOpen(false)}
          onConfirm={vi.fn()}
        />
      );
    }

    render(<MissingTriggerHarness />);
    await expect(user.click(screen.getByRole('button', { name: 'Keep plan' }))).resolves.not.toThrow();
  });

  it('wraps keyboard focus within the dialog', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Outside page control</button>
        <ConfirmationDialog
          open
          title="Archive membership plan"
          description="Archive “Monthly Access”?"
          cancelLabel="Keep plan"
          confirmLabel="Archive plan"
          onCancel={vi.fn()}
          onConfirm={vi.fn()}
        />
      </>
    );

    const cancelButton = screen.getByRole('button', { name: 'Keep plan' });
    const confirmButton = screen.getByRole('button', { name: 'Archive plan' });
    const outsideButton = screen.getByRole('button', { name: 'Outside page control' });

    expect(cancelButton).toHaveFocus();

    await user.tab();
    expect(confirmButton).toHaveFocus();

    await user.tab();
    expect(cancelButton).toHaveFocus();
    expect(outsideButton).not.toHaveFocus();

    await user.tab({ shift: true });
    expect(confirmButton).toHaveFocus();
    expect(outsideButton).not.toHaveFocus();
  });

  it('allows pending confirmation promises to settle after unmount', async () => {
    const user = userEvent.setup();
    let resolveConfirm!: () => void;
    let confirmPromise!: Promise<void>;
    const onConfirm = vi.fn(() => {
      confirmPromise = new Promise<void>((resolve) => {
        resolveConfirm = resolve;
      });
      return confirmPromise;
    });

    const { unmount } = render(
      <ConfirmationDialog
        open
        title="Archive membership plan"
        description="Archive “Monthly Access”?"
        cancelLabel="Keep plan"
        confirmLabel="Archive plan"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Archive plan' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    unmount();

    await expect(act(async () => {
      resolveConfirm();
      await confirmPromise;
    })).resolves.not.toThrow();
  });
});
