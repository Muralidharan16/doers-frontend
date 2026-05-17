import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Calendar, DollarSign, Users, BarChart3, TrendingUp, Download } from 'lucide-react';

const REPORT_CARDS = [
  { id: 'revenue', title: 'Revenue Report', description: 'Analyze monthly recurring subscriptions, check-in charges, and tax registries.', icon: DollarSign },
  { id: 'attendance', title: 'Attendance Report', description: 'Track peak occupancy parameters, hour distributions, and trainer schedules.', icon: Calendar },
  { id: 'growth', title: 'Member Growth', description: 'Inspect new registries, cancellations, churn rates, and referral feeds.', icon: Users },
  { id: 'retention', title: 'Retention Report', description: 'Measure cohort lifetimes, renewing rates, and long-term activity maps.', icon: TrendingUp },
];

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-05-31');

  const handleGenerateReport = () => {
    alert(`Generating system report from ${startDate} to ${endDate}...`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Reports & Analytics" 
        category="Intelligence" 
        action={
          <Button variant="primary" onClick={handleGenerateReport} className="gap-2">
            <BarChart3 size={14} />
            <span>Generate Report</span>
          </Button>
        }
      />

      {/* Date Range Picker (side-by-side) */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-[var(--text-muted)]" />
          <span className="text-[13px] text-[var(--text-secondary)]">Specify Report Interval</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '0.5px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
            className="focus:border-[var(--border-focus)] font-mono"
          />
          <span className="text-[12px] text-[var(--text-muted)]">to</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '0.5px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
            className="focus:border-[var(--border-focus)] font-mono"
          />
        </div>
      </div>

      {/* Report Cards Grid (2x2) */}
      <div className="space-y-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          AVAILABLE ANALYTIC FEEDS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_CARDS.map((rc) => {
            const Icon = rc.icon;
            return (
              <Card key={rc.id} className="flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{rc.title}</h3>
                    <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">{rc.description}</p>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                  <Button variant="ghost" className="text-[11px] font-semibold text-[var(--accent)] gap-1 px-1">
                    <Download size={12} />
                    <span>VIEW REPORT</span>
                  </Button>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">REGISTRY SECURE</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-4 pt-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          VISUAL GRAPH REGISTRIES
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Revenue Line Chart */}
          <Card className="space-y-4">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Revenue Stream</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Monthly collection metrics (₹ in thousands)</p>
            </div>

            {/* Dynamic SVG Line Chart */}
            <div className="relative w-full h-[140px] md:h-[180px] lg:h-[240px]">
              <svg className="w-full h-full" viewBox="0 0 500 240" fill="none" preserveAspectRatio="none">
                {/* Horizontal Grid lines (0.5px) */}
                <line x1="0" y1="60" x2="500" y2="60" stroke="var(--border-default)" strokeWidth="0.5" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border-default)" strokeWidth="0.5" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="var(--border-default)" strokeWidth="0.5" />
                <line x1="0" y1="230" x2="500" y2="230" stroke="var(--border-default)" strokeWidth="0.5" />

                {/* Fill Area */}
                <path 
                  d="M 10,230 L 100,160 L 200,120 L 300,140 L 400,60 L 490,40 L 490,230 Z" 
                  fill="var(--accent)" 
                  style={{ opacity: 0.05 }}
                />

                {/* Line Path */}
                <path 
                  d="M 10,230 L 100,160 L 200,120 L 300,140 L 400,60 L 490,40" 
                  stroke="var(--accent)" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                <circle cx="10" cy="230" r="3" fill="var(--accent)" />
                <circle cx="100" cy="160" r="3" fill="var(--accent)" />
                <circle cx="200" cy="120" r="3" fill="var(--accent)" />
                <circle cx="300" cy="140" r="3" fill="var(--accent)" />
                <circle cx="400" cy="60" r="3" fill="var(--accent)" />
                <circle cx="490" cy="40" r="3" fill="var(--accent)" />
              </svg>

              {/* Axis labels (hidden on mobile, visible md+) */}
              <div className="hidden md:flex justify-between text-[11px] text-[var(--text-muted)] mt-2 font-mono">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </Card>

          {/* Member Growth Bar Chart */}
          <Card className="space-y-4">
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">Registries Growth</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Active new subscriber accounts/mo</p>
            </div>

            {/* Dynamic SVG Bar Chart */}
            <div className="relative w-full h-[140px] md:h-[180px] lg:h-[240px]">
              <svg className="w-full h-full" viewBox="0 0 500 240" fill="none" preserveAspectRatio="none">
                {/* Horizontal Grid lines (0.5px) */}
                <line x1="0" y1="60" x2="500" y2="60" stroke="var(--border-default)" strokeWidth="0.5" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border-default)" strokeWidth="0.5" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="var(--border-default)" strokeWidth="0.5" />
                <line x1="0" y1="230" x2="500" y2="230" stroke="var(--border-default)" strokeWidth="0.5" />

                {/* Bars */}
                {/* Bar 1 */}
                <rect x="30" y="160" width="30" height="70" rx="3" fill="var(--accent)" className="transition-all duration-300 hover:fill-[var(--accent-hover)]" />
                {/* Bar 2 */}
                <rect x="110" y="120" width="30" height="110" rx="3" fill="var(--accent)" className="transition-all duration-300 hover:fill-[var(--accent-hover)]" />
                {/* Bar 3 */}
                <rect x="190" y="140" width="30" height="90" rx="3" fill="var(--accent)" className="transition-all duration-300 hover:fill-[var(--accent-hover)]" />
                {/* Bar 4 */}
                <rect x="270" y="80" width="30" height="150" rx="3" fill="var(--accent)" className="transition-all duration-300 hover:fill-[var(--accent-hover)]" />
                {/* Bar 5 */}
                <rect x="350" y="50" width="30" height="180" rx="3" fill="var(--accent)" className="transition-all duration-300 hover:fill-[var(--accent-hover)]" />
                {/* Bar 6 */}
                <rect x="430" y="30" width="30" height="200" rx="3" fill="var(--accent)" className="transition-all duration-300 hover:fill-[var(--accent-hover)]" />
              </svg>

              {/* Axis labels */}
              <div className="hidden md:flex justify-between text-[11px] text-[var(--text-muted)] mt-2 font-mono px-4">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
