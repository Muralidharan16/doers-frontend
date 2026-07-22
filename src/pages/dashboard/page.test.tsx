import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DashboardPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import * as reportsHooks from "@/features/reports/hooks/useDashboard";

vi.mock("@/features/reports/hooks/useDashboard");

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderDashboard = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("DashboardPage", () => {
  it("Test 1 — initial successful load state with populated attendance", () => {
    vi.mocked(reportsHooks.useExpiringSubscriptions).mockReturnValue({ data: [{ member_id: "1", member_name: "John", email: "j@j.com", days_remaining: 3, end_date: "2026-06-01", plan_name: "Basic" }, { member_id: "2", member_name: "Jane", email: "jane@j.com", days_remaining: 2, end_date: "2026-06-01", plan_name: "Basic" }, { member_id: "3", member_name: "Bob", email: "bob@b.com", days_remaining: 1, end_date: "2026-06-01", plan_name: "Pro" }], isLoading: false } as any);
    vi.mocked(reportsHooks.useCollections).mockReturnValue({
      data: [
        { date: "2026-05-01", cash: 10000, upi: 15000, card: 5000, total: 30000, count: 3 },
        { date: "2026-05-02", cash: 15000, upi: 20000, card: 10000, total: 45000, count: 4 },
      ],
      isLoading: false
    } as any);
    vi.mocked(reportsHooks.useAttendance).mockReturnValue({
      data: {
        hours: [
          { hour: 6, count: 12 },
          { hour: 8, count: 20 },
          { hour: 10, count: 35 },
          { hour: 12, count: 45 },
          { hour: 17, count: 89 },
        ],
        days_analyzed: 30
      },
      isLoading: false,
      isPending: false,
      isError: false
    } as any);

    renderDashboard();

    expect(screen.getByText("₹75,000")).toBeInTheDocument();

    const attendanceSection = screen.getByText("Attendance Trends").closest("section") as HTMLElement;
    expect(within(attendanceSection).getByText("6:00")).toBeInTheDocument();
    expect(within(attendanceSection).getByText("17:00")).toBeInTheDocument();
    expect(within(attendanceSection).getByText("Attendance distribution for the last 30 days.")).toBeInTheDocument();

    const expiringRow = screen.getByText("Memberships Expiring").closest(".p-4.rounded-\\[6px\\]") as HTMLElement;
    expect(within(expiringRow).getByText("3")).toBeInTheDocument();

    const liveOccupancyCard = screen.getByText("Live Occupancy").closest(".rounded-\\[8px\\]") as HTMLElement;
    expect(within(liveOccupancyCard).getByText("Occupancy data unavailable")).toBeInTheDocument();
    expect(within(liveOccupancyCard).getByText("Occupancy reporting is not connected.")).toBeInTheDocument();

    const memberActivityCard = screen.getByText("Member Activity").closest(".rounded-\\[8px\\]") as HTMLElement;
    expect(within(memberActivityCard).getByText("Member activity data unavailable")).toBeInTheDocument();
    expect(within(memberActivityCard).getByText("Check-in reporting is not connected.")).toBeInTheDocument();

    const growthBlock = screen.getByText("Monthly Growth").closest(".mt-8") as HTMLElement;
    expect(within(growthBlock).getByText("Growth data unavailable")).toBeInTheDocument();
    expect(within(growthBlock).getByText("Growth reporting is not connected.")).toBeInTheDocument();

    const alertsRow = screen.getByText("Low Attendance Alerts").closest(".p-4.rounded-\\[6px\\]") as HTMLElement;
    expect(within(alertsRow).getByText("Attendance alerts unavailable")).toBeInTheDocument();

    // B3 content remains present
    expect(screen.getByText("8 Trial Days Remaining")).toBeInTheDocument();
    expect(screen.getByText("Trial progression verified")).toBeInTheDocument();
    expect(screen.getByText("₹12,500")).toBeInTheDocument();
    expect(screen.getByText("/ mo")).toBeInTheDocument();
    expect(screen.getByText("Auto-renewing June 12, 2026")).toBeInTheDocument();
    expect(screen.getByText("Active Autopay")).toBeInTheDocument();

    // Representative deferred claims remain present
    expect(screen.getByText("System Condition")).toBeInTheDocument();
    expect(screen.getByText("Attendance Security")).toBeInTheDocument();
    expect(screen.getByText("Billing Systems")).toBeInTheDocument();
    expect(screen.getByText("Member Retention")).toBeInTheDocument();
    expect(screen.getByText("All operations fully nominal")).toBeInTheDocument();
  });

  it("Test 2 — attendance pending", () => {
    vi.mocked(reportsHooks.useExpiringSubscriptions).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(reportsHooks.useCollections).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(reportsHooks.useAttendance).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: true,
      isError: false
    } as any);

    renderDashboard();

    const attendanceSection = screen.getByText("Attendance Trends").closest("section") as HTMLElement;
    expect(within(attendanceSection).getByText("Loading attendance distribution")).toBeInTheDocument();
  });

  it("Test 3 — attendance successful empty", () => {
    vi.mocked(reportsHooks.useExpiringSubscriptions).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(reportsHooks.useCollections).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(reportsHooks.useAttendance).mockReturnValue({
      data: {
        hours: [],
        days_analyzed: 30
      },
      isLoading: false,
      isPending: false,
      isError: false
    } as any);

    renderDashboard();

    const attendanceSection = screen.getByText("Attendance Trends").closest("section") as HTMLElement;
    expect(within(attendanceSection).getByText("No attendance distribution recorded")).toBeInTheDocument();
    expect(within(attendanceSection).getByText("No attendance activity was returned for the last 30 days.")).toBeInTheDocument();
  });

  it("Test 4 — attendance error", () => {
    vi.mocked(reportsHooks.useExpiringSubscriptions).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(reportsHooks.useCollections).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(reportsHooks.useAttendance).mockReturnValue({
      data: undefined,
      isLoading: false,
      isPending: false,
      isError: true
    } as any);

    renderDashboard();

    const attendanceSection = screen.getByText("Attendance Trends").closest("section") as HTMLElement;
    expect(within(attendanceSection).getByText("Attendance distribution unavailable")).toBeInTheDocument();
    expect(within(attendanceSection).getByText("Attendance reporting could not be loaded.")).toBeInTheDocument();
  });

  it("Test 5 — section-scoped B1 assertions", () => {
    vi.mocked(reportsHooks.useExpiringSubscriptions).mockReturnValue({ data: [{ member_id: "1", member_name: "John", email: "j@j.com", days_remaining: 3, end_date: "2026-06-01", plan_name: "Basic" }, { member_id: "2", member_name: "Jane", email: "jane@j.com", days_remaining: 2, end_date: "2026-06-01", plan_name: "Basic" }, { member_id: "3", member_name: "Bob", email: "bob@b.com", days_remaining: 1, end_date: "2026-06-01", plan_name: "Pro" }], isLoading: false } as any);
    vi.mocked(reportsHooks.useCollections).mockReturnValue({
      data: [],
      isLoading: false
    } as any);
    vi.mocked(reportsHooks.useAttendance).mockReturnValue({
      data: {
        hours: [
          { hour: 6, count: 12 }
        ],
        days_analyzed: 30
      },
      isLoading: false,
      isPending: false,
      isError: false
    } as any);

    renderDashboard();

    const liveOccupancyCard = screen.getByText("Live Occupancy").closest(".rounded-\\[8px\\]") as HTMLElement;
    expect(within(liveOccupancyCard).getByText("Occupancy data unavailable")).toBeInTheDocument();
    expect(within(liveOccupancyCard).getByText("Occupancy reporting is not connected.")).toBeInTheDocument();
    expect(within(liveOccupancyCard).queryByText("42%")).not.toBeInTheDocument();
    expect(within(liveOccupancyCard).queryByText("18 active members")).not.toBeInTheDocument();
    expect(within(liveOccupancyCard).queryByText("Stable load")).not.toBeInTheDocument();

    const memberActivityCard = screen.getByText("Member Activity").closest(".rounded-\\[8px\\]") as HTMLElement;
    expect(within(memberActivityCard).getByText("Member activity data unavailable")).toBeInTheDocument();
    expect(within(memberActivityCard).getByText("Check-in reporting is not connected.")).toBeInTheDocument();
    expect(within(memberActivityCard).queryByText("128")).not.toBeInTheDocument();
    expect(within(memberActivityCard).queryByText("+14%")).not.toBeInTheDocument();
    expect(within(memberActivityCard).queryByText("vs previous Thursday")).not.toBeInTheDocument();

    const expiringRow = screen.getByText("Memberships Expiring").closest(".p-4.rounded-\\[6px\\]") as HTMLElement;
    expect(within(expiringRow).getByText("3")).toBeInTheDocument();

    const alertsRow = screen.getByText("Low Attendance Alerts").closest(".p-4.rounded-\\[6px\\]") as HTMLElement;
    expect(within(alertsRow).getByText("—")).toBeInTheDocument();
    expect(within(alertsRow).getByText("Attendance alerts unavailable")).toBeInTheDocument();
    expect(within(alertsRow).queryByText("12")).not.toBeInTheDocument();

    const growthBlock = screen.getByText("Monthly Growth").closest(".mt-8") as HTMLElement;
    expect(within(growthBlock).getByText("Growth data unavailable")).toBeInTheDocument();
    expect(within(growthBlock).getByText("Growth reporting is not connected.")).toBeInTheDocument();
    expect(within(growthBlock).queryByText("+18.4%")).not.toBeInTheDocument();

    const attendanceSection = screen.getByText("Attendance Trends").closest("section") as HTMLElement;
    expect(within(attendanceSection).getByText("6:00")).toBeInTheDocument();
  });
});
