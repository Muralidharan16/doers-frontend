import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/features/reports/hooks/useDashboard", () => ({
  useExpiringSubscriptions: vi.fn(() => ({ data: [] })),
  useCollections: vi.fn(() => ({
    data: [
      { date: "2026-05-01", cash: 10000, upi: 15000, card: 5000, total: 30000, count: 3 },
      { date: "2026-05-02", cash: 15000, upi: 20000, card: 10000, total: 45000, count: 4 },
    ],
  })),
  useAttendance: vi.fn(() => ({ data: { hours: [] } }))
}));

vi.mock("@/features/gym", () => ({
  useBranchStore: vi.fn(() => ({ selectedBranch: null }))
}));

describe("DashboardPage", () => {
  it("renders the API collection total and truthful unavailable states", () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    
    render(
      <QueryClientProvider client={qc}>
        <DashboardPage />
      </QueryClientProvider>
    );

    expect(screen.getByText("₹75,000")).toBeInTheDocument();
    expect(screen.getByText("Revenue trend unavailable")).toBeInTheDocument();
    expect(screen.getByText("Trend reporting is not connected.")).toBeInTheDocument();
    expect(screen.getByText("Payment alerts unavailable")).toBeInTheDocument();

    expect(screen.queryByText("On Track (+4.2%)")).not.toBeInTheDocument();
    expect(screen.queryByText("Revenue visualization unavailable")).toBeInTheDocument();
    // Excluded items should remain:
    expect(screen.getByText("8 Trial Days Remaining")).toBeInTheDocument();
    expect(screen.getByText("Trial progression verified")).toBeInTheDocument();
    expect(screen.getByText("Active Autopay")).toBeInTheDocument();
    expect(screen.getByText(/Current Load/i)).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
    expect(screen.getByText(/Check-ins Today/i)).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("+14%")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("+18.4%")).toBeInTheDocument();
    expect(screen.getByText(/72 mins/i)).toBeInTheDocument();
  });
});
