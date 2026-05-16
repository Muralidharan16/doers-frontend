import { useState } from 'react';
import { useTheme } from '@/shared/context/ThemeContext';
import { useDashboardMetrics, useExpiringSubscriptions, useCollections, useAttendance } from '@/features/reports/hooks/useDashboard';
import { Sun, Moon, TrendingUp, Users, UserPlus, AlertCircle, DollarSign, Calendar, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const metricsQuery = useDashboardMetrics();
  const expiringQuery = useExpiringSubscriptions(7);
  const collectionsQuery = useCollections(dateRange.from, dateRange.to);
  const attendanceQuery = useAttendance(30);

  const isDark = theme === 'dark';

  const colors = {
    bg:          isDark ? '#0e0e0e' : '#f5f3ef',
    card:        isDark ? '#1c1c1c' : '#ffffff',
    cardBorder:  isDark ? '#2e2e2e' : '#e8e4de',
    text:        isDark ? '#f0f0f0' : '#1a1a1a',
    textMuted:   isDark ? '#888888' : '#525252',
    textBody:    isDark ? '#aaaaaa' : '#5a5a5a',
    divider:     isDark ? '#272727' : '#ede9e4',
    success:     '#10b981',
    warning:     '#f59e0b',
    danger:      '#ef4444',
    info:        '#3b82f6',
    inputBg:     isDark ? '#111111' : '#ffffff',
    inputBorder: isDark ? '#2e2e2e' : '#e8e4de',
    inputFocus:  isDark ? '#444444' : '#a8a29e',
    inputText:   isDark ? '#f0f0f0' : '#1a1a1a',
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: metricsQuery.data?.total_revenue_month || 0,
      icon: DollarSign,
      color: colors.success,
      format: 'currency',
    },
    {
      title: 'Active Members',
      value: metricsQuery.data?.active_members || 0,
      icon: Users,
      color: colors.info,
      format: 'number',
    },
    {
      title: 'New Members',
      value: metricsQuery.data?.new_members_month || 0,
      icon: UserPlus,
      color: colors.info,
      format: 'number',
    },
    {
      title: 'Churn Rate',
      value: metricsQuery.data?.churn_rate || 0,
      icon: TrendingUp,
      color: metricsQuery.data?.churn_rate && metricsQuery.data.churn_rate > 15 ? colors.danger : colors.warning,
      format: 'percentage',
    },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `₹${value.toLocaleString('en-IN')}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('en-IN');
    }
  };

  const totalCollections = collectionsQuery.data?.reduce((sum, item) => sum + Number(item.total), 0) || 0;
  const maxAttendance = Math.max(...(attendanceQuery.data?.hours.map(h => h.count) || [1]));

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.bg,
      padding: '32px 24px',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease;
        }

        /* KPI Cards */
        .kpi-card {
          background: ${colors.card};
          border: 1px solid ${colors.cardBorder};
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }
        .kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'};
          border-color: ${isDark ? '#3a3a3a' : '#ddd9d3'};
        }

        /* Section divider */
        .section-divider {
          height: 1px;
          background: ${colors.divider};
          margin: 32px 0;
        }

        /* Section Title */
        .section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          color: ${colors.text};
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }

        /* Table */
        .table-container {
          background: ${colors.card};
          border: 1px solid ${colors.cardBorder};
          border-radius: 12px;
          overflow: hidden;
        }
        .table-header {
          background: ${isDark ? '#141414' : '#faf9f7'};
          border-bottom: 1px solid ${colors.divider};
          padding: 16px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 0.5fr;
          gap: 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${colors.textMuted};
        }
        .table-row {
          padding: 16px 24px;
          border-bottom: 1px solid ${colors.divider};
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 0.5fr;
          gap: 16px;
          align-items: center;
          font-size: 14px;
          color: ${colors.textBody};
        }
        .table-row:last-child {
          border-bottom: none;
        }
        .table-row:hover {
          background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
        }

        /* Chart */
        .heatmap-container {
          background: ${colors.card};
          border: 1px solid ${colors.cardBorder};
          border-radius: 12px;
          padding: 24px;
        }
        .heatmap-hours {
          display: grid;
          grid-template-columns: repeat(24, 1fr);
          gap: 4px;
          margin-top: 16px;
        }
        .heatmap-hour {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .heatmap-bar {
          width: 100%;
          border-radius: 4px;
          min-height: 100px;
          background: ${colors.info};
          opacity: 0.6;
          transition: all 0.2s;
          cursor: default;
        }
        .heatmap-bar:hover {
          opacity: 1;
          transform: scaleY(1.03);
        }
        .heatmap-label {
          font-size: 10px;
          color: ${colors.textMuted};
          text-align: center;
        }

        /* Collection Grid */
        .collection-grid {
          background: ${colors.card};
          border: 1px solid ${colors.cardBorder};
          border-radius: 12px;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }
        .collection-item {
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
          border: 1px solid ${colors.divider};
        }
        .collection-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${colors.textMuted};
          margin-bottom: 8px;
          font-weight: 600;
        }
        .collection-value {
          font-size: 20px;
          font-weight: 600;
          color: ${colors.text};
        }

        /* Loading skeleton */
        .skeleton {
          background: ${colors.card};
          border: 1px solid ${colors.cardBorder};
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }
        .skeleton::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}, transparent);
          background-size: 400px 100%;
          animation: shimmer 1.5s infinite linear;
        }

        /* Input Luxury */
        .input-luxury {
          width: 100%;
          padding: 10px 14px;
          background: ${colors.inputBg};
          border: 1px solid ${colors.inputBorder};
          border-radius: 10px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          color: ${colors.inputText};
          outline: none;
          transition: all 0.2s;
        }
        .input-luxury:focus {
          border-color: ${colors.inputFocus};
          box-shadow: 0 0 0 3px ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
        }

        /* Grid layout */
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }
        .grid-2-full {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }
        @media (max-width: 1024px) {
          .grid-2-full {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Main container */}
      <div className="dashboard-container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 32,
            fontWeight: 500,
            color: colors.text,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: 14,
            color: colors.textMuted,
            margin: 0,
            letterSpacing: '0.01em',
          }}>
            Welcome back. Here's your organization performance overview.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid-2">
          {metricsQuery.isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 140 }} />
            ))
          ) : (
            kpiCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="kpi-card">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16,
                  }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: colors.textMuted,
                    }}>
                      {card.title}
                    </span>
                    <Icon size={18} color={card.color} />
                  </div>
                  <div style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: colors.text,
                    letterSpacing: '-0.01em',
                  }}>
                    {formatValue(card.value, card.format)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="section-divider" />

        {/* Collections and Attendance Row */}
        <div className="grid-2-full">
          {/* Collections */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 className="section-title" style={{ margin: 0 }}>Payment Collections</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="date"
                  className="input-luxury"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(p => ({ ...p, from: e.target.value }))}
                />
                <span style={{ color: colors.textMuted }}>—</span>
                <input
                  type="date"
                  className="input-luxury"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(p => ({ ...p, to: e.target.value }))}
                />
              </div>
            </div>
            {collectionsQuery.isLoading ? (
              <div className="skeleton" style={{ height: 150 }} />
            ) : (
              <div className="collection-grid">
                <div className="collection-item">
                  <div className="collection-label">Cash</div>
                  <div className="collection-value">
                    ₹{collectionsQuery.data?.reduce((sum, item) => sum + item.cash, 0).toLocaleString('en-IN') || 0}
                  </div>
                </div>
                <div className="collection-item">
                  <div className="collection-label">UPI</div>
                  <div className="collection-value">
                    ₹{collectionsQuery.data?.reduce((sum, item) => sum + item.upi, 0).toLocaleString('en-IN') || 0}
                  </div>
                </div>
                <div className="collection-item">
                  <div className="collection-label">Card</div>
                  <div className="collection-value">
                    ₹{collectionsQuery.data?.reduce((sum, item) => sum + item.card, 0).toLocaleString('en-IN') || 0}
                  </div>
                </div>
                <div className="collection-item" style={{ borderLeft: `2px solid ${colors.success}` }}>
                  <div className="collection-label">Total</div>
                  <div className="collection-value" style={{ color: colors.success }}>
                    ₹{totalCollections.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attendance Heatmap */}
          <div>
            <h3 className="section-title">Peak Hours</h3>
            {attendanceQuery.isLoading ? (
              <div className="skeleton" style={{ height: 150 }} />
            ) : (
              <div className="heatmap-container">
                <div className="heatmap-hours">
                  {attendanceQuery.data?.hours.map((hour) => (
                    <div key={hour.hour} className="heatmap-hour">
                      <div
                        className="heatmap-bar"
                        style={{
                          height: `${(hour.count / maxAttendance) * 100}%`,
                          opacity: Math.max(0.3, (hour.count / maxAttendance) * 0.9),
                        }}
                        title={`Hour: ${hour.hour}:00, Check-ins: ${hour.count}`}
                      />
                      <div className="heatmap-label">{String(hour.hour).padStart(2, '0')}h</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="section-divider" />

        {/* Expiring Subscriptions */}
        <div>
          <h3 className="section-title">
            <AlertCircle size={18} style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
            Expiring Soon (Next 7 Days)
          </h3>
          {expiringQuery.isLoading ? (
            <div className="skeleton" style={{ height: 250 }} />
          ) : expiringQuery.data && expiringQuery.data.length > 0 ? (
            <div className="table-container">
              <div className="table-header">
                <div>Member</div>
                <div>Email</div>
                <div>Expiry Date</div>
                <div>Days</div>
              </div>
              {expiringQuery.data.map((subscription) => (
                <div key={subscription.member_id} className="table-row">
                  <div style={{ fontWeight: 500, color: colors.text }}>
                    {subscription.member_name}
                  </div>
                  <div>{subscription.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={14} color={colors.warning} />
                    {new Date(subscription.end_date).toLocaleDateString('en-IN')}
                  </div>
                  <div style={{
                    backgroundColor: subscription.days_remaining <= 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: subscription.days_remaining <= 3 ? colors.danger : colors.warning,
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'center',
                  }}>
                    {subscription.days_remaining}d
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-container" style={{
              padding: 40,
              textAlign: 'center',
              color: colors.textMuted,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              <AlertCircle size={24} color={colors.textMuted} />
              <p style={{ margin: 0 }}>No subscriptions expiring in the next 7 days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}