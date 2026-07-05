import type { PlatformAccessMode } from '../types';

interface AccessCopy {
  title: string;
  body: string;
  tone: 'neutral' | 'notice' | 'warning' | 'recovery';
}

export function getAccessCopy(mode: PlatformAccessMode, available: boolean): AccessCopy {
  if (!available) {
    return {
      title: 'Account status is temporarily unavailable',
      body: 'Your existing information remains safe. Some account changes may be unavailable while we refresh billing status.',
      tone: 'notice',
    };
  }

  switch (mode) {
    case 'full':
      return {
        title: 'Account access is active',
        body: 'Your workspace is available.',
        tone: 'neutral',
      };
    case 'limited_write':
      return {
        title: 'Some account changes need attention',
        body: 'Core work remains available. A few higher-risk changes may be paused until billing is resolved.',
        tone: 'notice',
      };
    case 'read_only':
      return {
        title: 'Workspace is view-only for now',
        body: 'Your existing information remains viewable. New changes are temporarily unavailable while account access is resolved.',
        tone: 'warning',
      };
    case 'billing_only':
      return {
        title: 'Billing attention is needed',
        body: 'Plan and support access remain available so the account can be recovered safely.',
        tone: 'recovery',
      };
    case 'blocked':
      return {
        title: 'Account review is in progress',
        body: 'Only safe recovery and support actions are available until the review is complete.',
        tone: 'recovery',
      };
  }
}

export function formatBillingDate(value: string | null): string {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatEntitlementKey(key: string): string {
  return key
    .replace(/^limits\./, '')
    .replace(/^features\./, '')
    .replace(/\./g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
