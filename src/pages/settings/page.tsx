import { useState } from 'react';
import { BasicInfoForm } from '@/features/organization';
import { OrganizationBrandingSection } from '@/components/settings/OrganizationBrandingSection';
import { User, Shield, Bell, CreditCard, Building, ArrowRight, AlertTriangle, MapPin, Ticket } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PageHeader } from '@/components/ui/PageHeader';
import { BranchManagementSection } from '@/components/settings/BranchManagementSection';
import { MembershipPlansSection } from '@/components/settings/MembershipPlansSection';
import { PLATFORM_BILLING_FRONTEND_SHELL } from '@/config/flags';
import { PlanBillingPage } from '@/features/platformBilling';

const TABS = [
  { id: 'basic', label: 'Organization Info', icon: Building },
  { id: 'branches', label: 'Locations & Branches', icon: MapPin },
  { id: 'membership-plans', label: 'Membership Plans', icon: Ticket },
  { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
  { id: 'security', label: 'Security & Access', icon: Shield },
  { id: 'notifications', label: 'Communication', icon: Bell },
  { id: 'profile', label: 'Preferences & Theme', icon: User },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('basic');
  
  // Custom switch states for demonstration
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [marketing, setMarketing] = useState(true);

  const renderToggleSwitch = (value: boolean, onChange: (v: boolean) => void) => {
    return (
      <button 
        type="button"
        onClick={() => onChange(!value)}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
        style={{ 
          backgroundColor: value ? 'var(--accent)' : 'var(--border-strong)',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span 
          className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          style={{ 
            transform: value ? 'translateX(24px)' : 'translateX(4px)' 
          }}
        />
      </button>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Settings" 
        category="Preferences" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1 bg-[var(--bg-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-default)]">
          <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold px-3 mb-4">
            Navigation
          </div>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium tracking-tight transition-all duration-150 rounded-[var(--radius-md)] group focus:outline-none"
                style={{
                  backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '2px solid var(--accent)' : 'none',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }} />
                <span className="flex-1 text-left">{tab.label}</span>
                {isActive && <ArrowRight size={14} className="text-[var(--accent)]" />}
              </button>
            );
          })}
        </aside>

        {/* Content Workspace */}
        <main className="lg:col-span-9 space-y-8 animate-subtle-up">
          {activeTab === 'basic' && (
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
                  ORGANIZATION DETAILS
                </div>
                <Card>
                  <BasicInfoForm />
                </Card>
              </div>
              
              <div className="h-[0.5px] w-full bg-[var(--border-default)] opacity-60" />
              
              <OrganizationBrandingSection />
            </div>
          )}

          {activeTab === 'branches' && (
            <BranchManagementSection />
          )}

          {activeTab === 'membership-plans' && (
            <MembershipPlansSection />
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
                PREFERENCES
              </div>
              <Card className="divide-y divide-[var(--border-default)]">
                {/* Row 1: Theme system */}
                <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <div className="text-[13px] font-semibold text-[var(--text-primary)]">System Appearance</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Toggle between our light luxury and dark modes.</div>
                  </div>
                  <ThemeToggle />
                </div>

                {/* Row 2: email alerts */}
                <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <div className="text-[13px] font-semibold text-[var(--text-primary)]">Email Alerts</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Get daily summaries of check-ins and billing activity.</div>
                  </div>
                  {renderToggleSwitch(emailAlerts, setEmailAlerts)}
                </div>

                {/* Row 3: marketing */}
                <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <div className="text-[13px] font-semibold text-[var(--text-primary)]">Product Updates</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Receive tips, feature announcements, and product updates.</div>
                  </div>
                  {renderToggleSwitch(marketing, setMarketing)}
                </div>
              </Card>

              {/* Danger Zone */}
              <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold pt-4">
                DANGER ZONE
              </div>
              <Card 
                style={{ 
                  border: '0.5px solid rgba(226,75,74,0.3)', 
                  backgroundColor: 'var(--bg-surface)' 
                }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[var(--red)] font-semibold text-[13px]">
                    <AlertTriangle size={16} />
                    <span>Delete Gym</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] max-w-lg">
                    Permanently delete your gym, including all members, check-ins, and billing history. This cannot be undone.
                  </p>
                </div>
                <Button variant="danger" onClick={() => alert('Are you sure? This action is permanent.')}>
                  Delete Gym
                </Button>
              </Card>
            </div>
          )}

          {activeTab !== 'basic' && activeTab !== 'profile' && activeTab !== 'branches' && activeTab !== 'membership-plans' && (
            <div className="space-y-6">
              <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
                {TABS.find(t => t.id === activeTab)?.label.toUpperCase()}
              </div>
              {activeTab === 'billing' && PLATFORM_BILLING_FRONTEND_SHELL ? (
                <PlanBillingPage embedded />
              ) : (
                <Card className="divide-y divide-[var(--border-default)]">
                  {activeTab === 'security' && (
                    <>
                      <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-semibold text-[var(--text-primary)]">Two-Factor Authentication</div>
                          <div className="text-[11px] text-[var(--text-muted)]">Secure your staff logins with multi-factor passcodes.</div>
                        </div>
                        {renderToggleSwitch(twoFactor, setTwoFactor)}
                      </div>
                      <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-semibold text-[var(--text-primary)]">Auto Sign-Out</div>
                          <div className="text-[11px] text-[var(--text-muted)]">Automatically sign out after 15 minutes of inactivity.</div>
                        </div>
                        {renderToggleSwitch(true, () => {})}
                      </div>
                    </>
                  )}

                  {activeTab === 'notifications' && (
                    <>
                      <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-semibold text-[var(--text-primary)]">Push Check-in Notifications</div>
                          <div className="text-[11px] text-[var(--text-muted)]">Receive immediate alerts when members check in.</div>
                        </div>
                        {renderToggleSwitch(true, () => {})}
                      </div>
                      <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-semibold text-[var(--text-primary)]">Payment Failure Alerts</div>
                          <div className="text-[11px] text-[var(--text-muted)]">Get notified when a member's payment fails.</div>
                        </div>
                        {renderToggleSwitch(true, () => {})}
                      </div>
                    </>
                  )}

                  {activeTab === 'billing' && (
                    <>
                      <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-semibold text-[var(--text-primary)]">Current Plan</div>
                          <div className="text-[11px] text-[var(--text-muted)]">You're on the Doers Gold plan.</div>
                        </div>
                        <div className="text-[12px] font-medium text-[var(--accent-text)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-[var(--radius-sm)]">
                          GOLD
                        </div>
                      </div>
                      <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-semibold text-[var(--text-primary)]">Tax & GST Identification</div>
                          <div className="text-[11px] text-[var(--text-muted)]">Add your GST number for invoice compliance.</div>
                        </div>
                        <Button variant="secondary">Configure tax</Button>
                      </div>
                    </>
                  )}
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
