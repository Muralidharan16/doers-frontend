import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  error?: string | null;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

const actionButtonClass = 'inline-flex items-center justify-center rounded-[var(--radius-md)] px-[18px] py-[10px] text-[13px] font-medium tracking-[0.04em] transition-all duration-150 hover:opacity-90 active:scale-[0.98] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';
const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  pending = false,
  error,
  triggerRef,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmingRef = useRef(false);
  const mountedRef = useRef(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const isPending = pending || isConfirming;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef?.current;
    const focusTarget = cancelButtonRef.current && !cancelButtonRef.current.disabled
      ? cancelButtonRef.current
      : getFocusableElements(dialogRef.current)[0] ?? dialogRef.current;
    focusTarget?.focus();

    return () => {
      if (trigger && typeof trigger.focus === 'function') {
        trigger.focus();
      }
    };
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isPending) {
          onCancel();
        }
        return;
      }

      if (event.key === 'Tab') {
        containFocus(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPending, onCancel, open]);

  if (!open) return null;

  const containFocus = (event: KeyboardEvent) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = getFocusableElements(dialog);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === firstElement || !dialog.contains(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
      return;
    }

    if (activeElement === lastElement || !dialog.contains(activeElement)) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const handleConfirm = async () => {
    if (isPending || confirmingRef.current) return;

    confirmingRef.current = true;
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch {
      // Error display is owned by the controlled consumer through the error prop.
    } finally {
      confirmingRef.current = false;
      if (mountedRef.current) {
        setIsConfirming(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="w-full max-w-md rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 shadow-2xl"
      >
        <div className="space-y-2">
          <h2 id={titleId} className="text-lg font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          <p id={descriptionId} className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-md border border-[var(--red)]/20 bg-[var(--red)]/10 p-3 text-[12px] text-[var(--red)]">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className={`${actionButtonClass} border border-[var(--border-strong)] bg-transparent text-[var(--text-primary)]`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className={`${actionButtonClass} ${
              destructive
                ? 'border border-[var(--red)] bg-transparent text-[var(--red)]'
                : 'border border-transparent bg-[var(--accent)] text-white'
            }`}
          >
            {isPending ? pendingLabel ?? confirmLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    const field = element as HTMLElement & { disabled?: boolean };
    return !field.disabled && !element.hidden && element.getAttribute('aria-hidden') !== 'true';
  });
}
