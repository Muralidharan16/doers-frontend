import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SettingsPage from './page';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@/features/organization', () => ({
  BasicInfoForm: () => <div data-testid="basic-info-form">Basic Info Form</div>
}));
vi.mock('@/components/settings/OrganizationBrandingSection', () => ({
  OrganizationBrandingSection: () => <div data-testid="org-branding">Org Branding</div>
}));
vi.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));
vi.mock('@/components/settings/BranchManagementSection', () => ({
  BranchManagementSection: () => <div data-testid="branch-management">Branches</div>
}));
vi.mock('@/components/settings/MembershipPlansSection', () => ({
  MembershipPlansSection: () => <div data-testid="membership-plans">Plans</div>
}));
vi.mock('@/features/platformBilling', () => ({
  PlanBillingPage: () => <div data-testid="plan-billing">Billing</div>
}));
vi.mock('@/config/flags', () => ({
  PLATFORM_BILLING_FRONTEND_SHELL: false
}));

describe('SettingsPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not render demonstration controls', () => {
    render(<SettingsPage />, { wrapper: BrowserRouter });
    expect(screen.queryByText('Security & Access')).not.toBeInTheDocument();
    expect(screen.queryByText('Communication')).not.toBeInTheDocument();
  });

  it('does not render no-op destructive control', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<SettingsPage />, { wrapper: BrowserRouter });

    const profileTab = screen.getByText('Preferences & Theme');
    fireEvent.click(profileTab);

    expect(screen.queryByText('Delete Gym')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure? This action is permanent.')).not.toBeInTheDocument();
    expect(screen.queryByText('DANGER ZONE')).not.toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('renders representative real settings content', () => {
    render(<SettingsPage />, { wrapper: BrowserRouter });
    expect(screen.getByText('Organization Info')).toBeInTheDocument();
    expect(screen.getByTestId('basic-info-form')).toBeInTheDocument();
  });

  it('renders theme preferences correctly', () => {
    render(<SettingsPage />, { wrapper: BrowserRouter });
    const profileTab = screen.getByText('Preferences & Theme');
    fireEvent.click(profileTab);
    expect(screen.getByText('System Appearance')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.queryByText('Email Alerts')).not.toBeInTheDocument();
    expect(screen.queryByText('Product Updates')).not.toBeInTheDocument();
  });
});
