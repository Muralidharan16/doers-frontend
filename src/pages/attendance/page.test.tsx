import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AttendancePage from './page';
import * as reportsHooks from '@/features/reports/hooks/useDashboard';

vi.mock('@/features/reports/hooks/useDashboard', () => ({
  useAttendance: vi.fn(),
}));

type AttendanceResult = ReturnType<typeof reportsHooks.useAttendance>;

const attendanceResult = (value: Partial<AttendanceResult>): AttendanceResult => value as AttendanceResult;

describe('AttendancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getDistributionCard = () => {
    const heading = screen.getByText('Attendance Distribution');
    return heading.closest('.space-y-6') as HTMLElement;
  };

  const getSummaryCard = () => {
    const heading = screen.getByText('Attendance Summary');
    return heading.closest('.space-y-6') as HTMLElement;
  };

  it('Test 1 — populated real API distribution', () => {
    vi.mocked(reportsHooks.useAttendance).mockReturnValue(attendanceResult({
      data: {
        hours: [
          { hour: 6, count: 12 },
          { hour: 17, count: 89 }
        ],
        days_analyzed: 30
      },
      isPending: false,
      isLoading: false,
      isError: false
    }));

    render(<AttendancePage />);

    const distCard = getDistributionCard();
    const distScope = within(distCard);

    expect(distScope.getByText('06:00')).toBeInTheDocument();
    expect(distScope.getByText('17:00')).toBeInTheDocument();
    expect(distScope.getByText('12')).toBeInTheDocument();
    expect(distScope.getByText('89')).toBeInTheDocument();
    expect(distScope.getByText('Aggregated across the last 30 days.')).toBeInTheDocument();

    const sumCard = getSummaryCard();
    const sumScope = within(sumCard);

    expect(sumScope.getByText('Highest recorded hour')).toBeInTheDocument();
    expect(sumScope.getByText('17:00')).toBeInTheDocument();
    expect(sumScope.getByText('89 recorded check-ins')).toBeInTheDocument();
  });

  it('Test 2 — pending state', () => {
    vi.mocked(reportsHooks.useAttendance).mockReturnValue(attendanceResult({
      data: undefined,
      isPending: true,
      isLoading: true,
      isError: false
    }));

    render(<AttendancePage />);

    const distCard = getDistributionCard();
    const distScope = within(distCard);

    expect(distScope.getByText('Loading attendance distribution')).toBeInTheDocument();
    expect(distScope.queryByText('Attendance distribution unavailable')).not.toBeInTheDocument();
    expect(distScope.queryByText('No attendance distribution recorded')).not.toBeInTheDocument();
  });

  it('Test 3 — error state', () => {
    vi.mocked(reportsHooks.useAttendance).mockReturnValue(attendanceResult({
      data: undefined,
      isPending: false,
      isLoading: false,
      isError: true
    }));

    render(<AttendancePage />);

    const distCard = getDistributionCard();
    const distScope = within(distCard);

    expect(distScope.getByText('Attendance distribution unavailable')).toBeInTheDocument();
    expect(distScope.getByText('Attendance reporting could not be loaded.')).toBeInTheDocument();
    expect(distScope.queryByText('Loading attendance distribution')).not.toBeInTheDocument();
    expect(distScope.queryByText('No attendance distribution recorded')).not.toBeInTheDocument();
  });

  it('Test 4 — successful empty state', () => {
    vi.mocked(reportsHooks.useAttendance).mockReturnValue(attendanceResult({
      data: {
        hours: [],
        days_analyzed: 30
      },
      isPending: false,
      isLoading: false,
      isError: false
    }));

    render(<AttendancePage />);

    const distCard = getDistributionCard();
    const distScope = within(distCard);

    expect(distScope.getByText('No attendance distribution recorded')).toBeInTheDocument();
    expect(distScope.getByText('No attendance activity was returned for this reporting period.')).toBeInTheDocument();
    expect(distScope.queryByText('Loading attendance distribution')).not.toBeInTheDocument();
    expect(distScope.queryByText('Attendance distribution unavailable')).not.toBeInTheDocument();
  });

  it('Test 5 — fabricated-content exclusion', () => {
    vi.mocked(reportsHooks.useAttendance).mockReturnValue(attendanceResult({
      data: {
        hours: [
          { hour: 6, count: 12 }
        ],
        days_analyzed: 30
      },
      isPending: false,
      isLoading: false,
      isError: false
    }));

    render(<AttendancePage />);

    expect(screen.queryByText(/Devon Lane|Kathryn Murphy|Eleanor Pena/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Verified/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/42%/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/18 Active/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/64 minutes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/07:00 – 08:30 AM/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/128 members/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/99\.8% Healthy/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Secure biometric sync enabled/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/System Diagnostics/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/today's attendance logs/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Live Heatmap/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Heatmap Distribution/i)).not.toBeInTheDocument();
  });

  it('Test 6 — all-zero non-empty response', () => {
    vi.mocked(reportsHooks.useAttendance).mockReturnValue(attendanceResult({
      data: {
        hours: [
          { hour: 6, count: 0 },
          { hour: 7, count: 0 }
        ],
        days_analyzed: 30
      },
      isPending: false,
      isLoading: false,
      isError: false
    }));

    render(<AttendancePage />);

    expect(screen.getByText('No attendance activity recorded')).toBeInTheDocument();
    expect(screen.getByText('All returned hourly buckets contain zero recorded check-ins.')).toBeInTheDocument();
    expect(screen.getByText('Aggregated across the last 30 days.')).toBeInTheDocument();

    expect(screen.queryByText('Highest recorded hour')).not.toBeInTheDocument();
    expect(screen.queryByText('0 recorded check-ins')).not.toBeInTheDocument();
  });
});
