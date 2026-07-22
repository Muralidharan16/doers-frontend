import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PaymentsPage from "./page";
import paymentsPageSource from "./page.tsx?raw";

describe("PaymentsPage", () => {
  it("renders truthful empty states and does not render fabricated payment records", () => {
    render(<PaymentsPage />);
    
    expect(screen.getAllByText("Payment data unavailable").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Payment reporting is not connected.").length).toBeGreaterThan(0);
    expect(screen.getAllByText("No payment records available").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Payment ledger data is not connected.").length).toBeGreaterThan(0);

    expect(screen.queryByText("₹29,700")).not.toBeInTheDocument();
    expect(screen.queryByText("₹16,100")).not.toBeInTheDocument();
    expect(screen.queryByText("₹12,500")).not.toBeInTheDocument();
    expect(screen.queryByText("82%")).not.toBeInTheDocument();
    expect(screen.queryByText("Devon Lane")).not.toBeInTheDocument();
    expect(screen.queryByText("Kathryn Murphy")).not.toBeInTheDocument();
  });

  it("does not retain a mock payment declaration in production source", () => {
    expect(paymentsPageSource).not.toContain("MOCK_PAYMENTS");
  });
});
