import { useState } from 'react';
import { BasicInfoForm } from '@/features/organization';
import { User, Shield, Bell, CreditCard, Building, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PageHeader } from '@/components/ui/PageHeader';

const TABS = [
  { id: 'basic', label: 'Organization Registry', icon: Building },
  { id: 'profile', label: 'Preferences & Theme', icon: User },
  { id: 'security', label: 'Security & Access', icon: Shield },
  { id: 'notifications', label: 'Communication', icon: Bell },
  { id: 'billing', label: 'Fiscal Plan', icon: CreditCard },
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
        title="Settings & System Infrastructure" 
        category="Preferences" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1 bg-[var(--bg-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-default)]">
          <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold px-3 mb-4">
            Navigation Registry
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
            <div className="space-y-6">
              <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
                SYSTEM JURISDICTION
              </div>
              <Card>
                <BasicInfoForm />
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
                CORE PREFERENCES
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
                    <div className="text-[13px] font-semibold text-[var(--text-primary)]">Activity Registry Alerts</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Receive daily system status and billing operations reports.</div>
                  </div>
                  {renderToggleSwitch(emailAlerts, setEmailAlerts)}
                </div>

                {/* Row 3: marketing */}
                <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <div className="text-[13px] font-semibold text-[var(--text-primary)]">Product Analytics Feed</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Opt in to share performance diagnostics and interface trials.</div>
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
                    <span>Decommission Establishment</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] max-w-lg">
                    Completely erase your studio registry, including all check-ins, member lists, and billing history. This action is irreversible.
                  </p>
                </div>
                <Button variant="danger" onClick={() => alert('Operational Decommission required.')}>
                  Delete Studio
                </Button>
              </Card>
            </div>
          )}

          {activeTab !== 'basic' && activeTab !== 'profile' && (
            <div className="space-y-6">
              <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
                {TABS.find(t => t.id === activeTab)?.label.toUpperCase()}
              </div>
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
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">Authorized Session Lock</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Automatically sign out inactive terminals after 15 minutes.</div>
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
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">Billing Failure Telegrams</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Notify management immediately of failed collection transactions.</div>
                      </div>
                      {renderToggleSwitch(true, () => {})}
                    </div>
                  </>
                )}

                {activeTab === 'billing' && (
                  <>
                    <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="space-y-0.5">
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">Active Operational Tier</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Your institution is registered under the Doers Studio Gold standard.</div>
                      </div>
                      <div className="text-[12px] font-medium text-[var(--accent-text)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-[var(--radius-sm)]">
                        GOLD OPERATIONAL
                      </div>
                    </div>
                    <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="space-y-0.5">
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">Tax & GST Identification</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Update GSTIN parameters for localized institutional compliance invoices.</div>
                      </div>
                      <Button variant="secondary">Configure tax</Button>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
