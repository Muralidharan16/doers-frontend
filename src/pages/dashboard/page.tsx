import { useState, useMemo } from 'react';
import { useDashboardMetrics, useExpiringSubscriptions, useCollections, useAttendance } from '@/features/reports';
import {
  TrendingUp,
  Users,
  UserPlus,
  AlertCircle,
  DollarSign,
  Calendar,
  Clock,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

const numberFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Skeleton loader component
function SkeletonLoader({ width = 'w-full', height = 'h-12' }: { width?: string; height?: string }) {
  return <div className={`${width} ${height} bg-bg-card-hover rounded-lg animate-pulse`} />;
}

// Error state component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center gap-4 p-8 bg-bg-card border border-border-default rounded-lg">
      <AlertCircle size={20} className="text-ruby" />
      <div>
        <p className="text-text-secondary font-body text-sm">Failed to load data</p>
        <p className="text-text-muted font-body text-xs mt-1">Please try again</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-auto px-4 py-2 bg-gold/10 hover:bg-gold/15 text-gold rounded-lg text-sm font-body font-medium transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// KPI Card component
function KPICard({
  label,
  value,
  icon: Icon,
  accentColor,
  trend,
  isLoading,
  error,
  onRetry,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size: number; className: string }>;
  accentColor: 'gold' | 'sapphire' | 'sage' | 'amber' | 'ruby';
  trend?: { direction: 'up' | 'down'; value: number; label: string };
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}) {
  const accentClasses = {
    gold: 'border-t-gold',
    sapphire: 'border-t-sapphire',
    sage: 'border-t-sage',
    amber: 'border-t-amber',
    ruby: 'border-t-ruby',
  };

  if (isLoading) {
    return (
      <div className="bg-bg-card border border-border-subtle rounded-lg p-6 space-y-4">
        <SkeletonLoader width="w-2/3" height="h-4" />
        <SkeletonLoader width="w-full" height="h-10" />
        <SkeletonLoader width="w-1/2" height="h-3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-card border border-border-subtle rounded-lg p-6">
        <ErrorState onRetry={onRetry || (() => {})} />
      </div>
    );
  }

  return (
    <div
      className={`
        bg-bg-card border-l-4 ${accentClasses[accentColor]} border-border-subtle rounded-lg p-6
        hover:border-border-default hover:shadow-lg transition-all duration-300 cursor-default
        hover:translate-y-[-3px]
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium">
          {label}
        </span>
        <Icon size={20} className={`text-${accentColor}`} />
      </div>

      <div className="font-display text-4xl font-normal text-text-primary mb-4">
        {value}
      </div>

      {trend && (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          {trend.direction === 'up' ? (
            <TrendingUp size={14} className="text-sage" />
          ) : (
            <TrendingUp size={14} className="text-ruby rotate-180" />
          )}
          <span>
            {trend.value}% <span className="text-text-muted">{trend.label}</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  // State
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  // Queries
  const metricsQuery = useDashboardMetrics();
  const expiringQuery = useExpiringSubscriptions(7);
  const collectionsQuery = useCollections(dateRange.from, dateRange.to);
  const attendanceQuery = useAttendance(30);

  // Computed values
  const totalCollections = useMemo(
    () => collectionsQuery.data?.reduce((sum, item) => sum + item.total, 0) || 0,
    [collectionsQuery.data]
  );

  const collectionBreakdown = useMemo(() => {
    if (!collectionsQuery.data) return { cash: 0, upi: 0, card: 0, total: 0 };
    return {
      cash: collectionsQuery.data.reduce((sum, item) => sum + item.cash, 0),
      upi: collectionsQuery.data.reduce((sum, item) => sum + item.upi, 0),
      card: collectionsQuery.data.reduce((sum, item) => sum + item.card, 0),
      total: totalCollections,
    };
  }, [collectionsQuery.data, totalCollections]);

  const maxAttendance = useMemo(
    () => Math.max(...(attendanceQuery.data?.map(h => h.count) || [1])),
    [attendanceQuery.data]
  );

  const peakHours = useMemo(() => {
    if (!attendanceQuery.data || attendanceQuery.data.length === 0) return '';
    const sorted = [...attendanceQuery.data].sort((a, b) => b.count - a.count).slice(0, 3);
    return sorted.map(h => `${String(h.hour).padStart(2, '0')}:00`).join(', ');
  }, [attendanceQuery.data]);

  const getAttendanceColor = (count: number, max: number) => {
    const percentage = (count / max) * 100;
    if (percentage > 70) return 'bg-gold';
    if (percentage > 40) return 'bg-gold-dark';
    if (percentage > 15) return 'bg-bg-card-hover';
    return 'bg-border-subtle';
  };

  return (
    <div className="w-full space-y-8">
      {/* Block 1 — Page Header */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="font-display text-4xl italic font-light text-text-primary mb-2">
              Good morning, Admin
            </h1>
            <p className="text-text-muted font-body text-sm">
              Track your gym performance and member activity at a glance.
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-subtle rounded-lg hover:border-border-default text-text-secondary font-body text-sm transition-colors">
            <Calendar size={16} />
            <span>{dateRange.from} to {dateRange.to}</span>
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-gold/30 via-gold/15 to-transparent" />
      </div>

      {/* Block 2 — KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Revenue"
          value={
            metricsQuery.isLoading
              ? '—'
              : currencyFormatter.format(metricsQuery.data?.total_revenue_month || 0)
          }
          icon={DollarSign}
          accentColor="gold"
          trend={
            !metricsQuery.isLoading
              ? { direction: 'up', value: 12, label: 'vs last month' }
              : undefined
          }
          isLoading={metricsQuery.isLoading}
          error={metricsQuery.isError}
          onRetry={() => metricsQuery.refetch()}
        />

        <KPICard
          label="Active Members"
          value={
            metricsQuery.isLoading ? '—' : numberFormatter.format(metricsQuery.data?.active_members || 0)
          }
          icon={Users}
          accentColor="sapphire"
          trend={
            !metricsQuery.isLoading
              ? { direction: 'up', value: 8, label: 'this month' }
              : undefined
          }
          isLoading={metricsQuery.isLoading}
          error={metricsQuery.isError}
          onRetry={() => metricsQuery.refetch()}
        />

        <KPICard
          label="New Members"
          value={
            metricsQuery.isLoading ? '—' : numberFormatter.format(metricsQuery.data?.new_members_month || 0)
          }
          icon={UserPlus}
          accentColor="sage"
          trend={
            !metricsQuery.isLoading
              ? { direction: 'up', value: 15, label: 'growth' }
              : undefined
          }
          isLoading={metricsQuery.isLoading}
          error={metricsQuery.isError}
          onRetry={() => metricsQuery.refetch()}
        />

        <KPICard
          label="Churn Rate"
          value={metricsQuery.isLoading ? '—' : `${(metricsQuery.data?.churn_rate || 0).toFixed(1)}%`}
          icon={AlertCircle}
          accentColor={(metricsQuery.data?.churn_rate || 0) > 15 ? 'ruby' : 'amber'}
          trend={
            !metricsQuery.isLoading
              ? { direction: 'down', value: 2, label: 'vs last month' }
              : undefined
          }
          isLoading={metricsQuery.isLoading}
          error={metricsQuery.isError}
          onRetry={() => metricsQuery.refetch()}
        />
      </div>

      {/* Block 3 — Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Collections */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-display text-lg font-normal text-text-primary">Payment Collections</h2>

          {collectionsQuery.isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <SkeletonLoader key={i} height="h-20" />
                ))}
            </div>
          ) : collectionsQuery.isError ? (
            <ErrorState onRetry={() => collectionsQuery.refetch()} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-card border border-border-subtle rounded-lg p-4">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-body font-medium mb-2">
                    Cash
                  </p>
                  <p className="font-display text-2xl text-text-primary">
                    {currencyFormatter.format(collectionBreakdown.cash)}
                  </p>
                </div>

                <div className="bg-bg-card border border-border-subtle rounded-lg p-4">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-body font-medium mb-2">
                    UPI
                  </p>
                  <p className="font-display text-2xl text-text-primary">
                    {currencyFormatter.format(collectionBreakdown.upi)}
                  </p>
                </div>

                <div className="bg-bg-card border border-border-subtle rounded-lg p-4">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-body font-medium mb-2">
                    Card
                  </p>
                  <p className="font-display text-2xl text-text-primary">
                    {currencyFormatter.format(collectionBreakdown.card)}
                  </p>
                </div>

                <div className="bg-bg-card border border-gold/20 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-body font-medium mb-2">
                    Total
                  </p>
                  <p className="font-display text-2xl text-gold">
                    {currencyFormatter.format(collectionBreakdown.total)}
                  </p>
                </div>
              </div>

              {/* Breakdown bar */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted font-body">UPI</span>
                    <span className="text-xs font-medium text-text-secondary">
                      {collectionBreakdown.total > 0
                        ? Math.round((collectionBreakdown.upi / collectionBreakdown.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-bg-card-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sapphire"
                      style={{
                        width: `${(collectionBreakdown.upi / collectionBreakdown.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted font-body">Cash</span>
                    <span className="text-xs font-medium text-text-secondary">
                      {collectionBreakdown.total > 0
                        ? Math.round((collectionBreakdown.cash / collectionBreakdown.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-bg-card-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage"
                      style={{
                        width: `${(collectionBreakdown.cash / collectionBreakdown.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted font-body">Card</span>
                    <span className="text-xs font-medium text-text-secondary">
                      {collectionBreakdown.total > 0
                        ? Math.round((collectionBreakdown.card / collectionBreakdown.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-bg-card-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber"
                      style={{
                        width: `${(collectionBreakdown.card / collectionBreakdown.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Peak Hours */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-lg font-normal text-text-primary">Peak Hours</h2>

          {attendanceQuery.isLoading ? (
            <div className="h-40 bg-bg-card border border-border-subtle rounded-lg" />
          ) : attendanceQuery.isError ? (
            <ErrorState onRetry={() => attendanceQuery.refetch()} />
          ) : (
            <div className="space-y-4">
              <div className="bg-bg-card border border-border-subtle rounded-lg p-6">
                <div className="flex items-end justify-center gap-1 h-40">
                  {attendanceQuery.data?.map((hour, idx) => (
                    <div
                      key={hour.hour}
                      className="flex-1 flex flex-col items-center gap-2"
                      title={`${String(hour.hour).padStart(2, '0')}:00 - ${hour.count} visits`}
                    >
                      <div
                        className={`w-full rounded-t-sm transition-all duration-200 hover:opacity-80 ${getAttendanceColor(
                          hour.count,
                          maxAttendance
                        )}`}
                        style={{
                          height: `${Math.max(4, (hour.count / maxAttendance) * 100)}%`,
                        }}
                      />
                      {/* Show labels at 12AM, 6AM, 12PM, 6PM, 11PM */}
                      {[0, 6, 12, 18, 23].includes(hour.hour) && (
                        <span className="text-xs text-text-muted font-body">
                          {String(hour.hour).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted font-body">
                <Clock size={14} />
                <span>
                  Peak hours:{' '}
                  <span className="text-text-secondary">{peakHours || 'Loading...'}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Block 4 — Expiring Subscriptions */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-normal text-text-primary flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber animate-pulse" />
          Expiring Subscriptions (Next 7 Days)
        </h2>

        {expiringQuery.isLoading ? (
          <div className="bg-bg-card border border-border-subtle rounded-lg divide-y divide-border-subtle">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-6">
                  <SkeletonLoader />
                </div>
              ))}
          </div>
        ) : expiringQuery.isError ? (
          <ErrorState onRetry={() => expiringQuery.refetch()} />
        ) : expiringQuery.data && expiringQuery.data.length > 0 ? (
          <>
            <div className="bg-bg-card border border-border-subtle rounded-lg divide-y divide-border-subtle overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-5 px-6 py-4 bg-bg-card-hover border-b border-border-subtle">
                <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium">
                  Member
                </span>
                <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium">
                  Plan
                </span>
                <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium">
                  Expiry Date
                </span>
                <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium">
                  Gym
                </span>
                <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium text-right">
                  Days Left
                </span>
              </div>

              {/* Table Rows */}
              {expiringQuery.data.map((subscription, idx) => {
                const daysLeft = subscription.days_remaining;
                const badgeColor =
                  daysLeft <= 3 ? 'ruby' : daysLeft <= 5 ? 'amber' : 'sage';
                const badgeClass =
                  daysLeft <= 3
                    ? 'bg-ruby/10 text-ruby'
                    : daysLeft <= 5
                      ? 'bg-amber/10 text-amber'
                      : 'bg-sage/10 text-sage';

                return (
                  <div
                    key={subscription.id}
                    className="grid grid-cols-1 md:grid-cols-5 px-6 py-4 hover:bg-gold/5 transition-colors"
                  >
                    <div className="col-span-1 mb-4 md:mb-0">
                      <p className="font-body font-medium text-text-primary">
                        {subscription.member_name}
                      </p>
                      <p className="text-xs text-text-muted font-body">
                        {subscription.email}
                      </p>
                    </div>

                    <div className="col-span-1 mb-4 md:mb-0 md:hidden">
                      <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium">
                        Plan
                      </span>
                      <p className="font-body text-text-primary">{subscription.plan_name}</p>
                    </div>
                    <div className="col-span-1 hidden md:block">
                      <p className="font-body text-text-primary">{subscription.plan_name}</p>
                    </div>

                    <div className="col-span-1 mb-4 md:mb-0 md:hidden">
                      <span className="text-xs uppercase tracking-widest text-text-muted font-body font-medium">
                        Expiry
                      </span>
                      <p className="font-body text-text-primary">
                        {new Date(subscription.end_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="col-span-1 hidden md:block">
                      <p className="font-body text-text-primary">
                        {new Date(subscription.end_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    <div className="col-span-1 mb-4 md:mb-0">
                      <p className="font-body text-text-secondary text-sm">Main Gym</p>
                    </div>

                    <div className="col-span-1 flex items-center justify-between md:justify-end gap-2">
                      <span className="md:hidden text-xs uppercase tracking-widest text-text-muted font-body font-medium">
                        Days
                      </span>
                      <div
                        className={`px-3 py-1 rounded-md text-sm font-body font-medium ${badgeClass}`}
                      >
                        {daysLeft}d
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer action bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-bg-card border border-border-subtle rounded-lg">
              <div className="flex items-center gap-2 text-sm text-text-muted font-body">
                <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span>Update renewal status on WhatsApp</span>
              </div>
              <a
                href="#"
                className="flex items-center gap-1 text-gold font-body text-sm font-medium hover:text-gold-light transition-colors"
              >
                Send to all <ArrowRight size={14} />
              </a>
            </div>
          </>
        ) : (
          <div className="bg-bg-card border border-border-subtle rounded-lg p-12 text-center space-y-4">
            <div className="flex justify-center">
              <Clock size={32} className="text-text-muted" />
            </div>
            <p className="font-body text-text-secondary">
              No subscriptions expiring in the next 7 days
            </p>
            <p className="font-body text-xs text-text-muted">
              Your members' subscriptions are all in good standing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}