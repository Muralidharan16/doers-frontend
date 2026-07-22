import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import GymsPage from "./page";

describe("GymsPage", () => {
  it("renders truthful empty states and does not render fabricated gyms", () => {
    render(<GymsPage />);
    
    expect(screen.getByText("Facility data unavailable")).toBeInTheDocument();
    expect(screen.getByText("Facility listing is not connected.")).toBeInTheDocument();

    expect(screen.queryByText("No establishments registered")).not.toBeInTheDocument();
    expect(screen.queryByText("Titan Fitness Principal")).not.toBeInTheDocument();
    expect(screen.queryByText("Titan Fitness Downtown")).not.toBeInTheDocument();
    expect(screen.queryByText("102 El Camino Real, Menlo Park, CA")).not.toBeInTheDocument();
    expect(screen.queryByText("540 University Ave, Palo Alto, CA")).not.toBeInTheDocument();
    expect(screen.queryByText("₹18,500")).not.toBeInTheDocument();
    expect(screen.queryByText("₹11,200")).not.toBeInTheDocument();
  });

  it("does not fabricate a facility record from the add control", () => {
    const prompt = vi.spyOn(window, "prompt")
      .mockReturnValueOnce("Test Facility Should Not Render")
      .mockReturnValueOnce("Test Address Should Not Render");

    render(<GymsPage />);
    fireEvent.click(screen.getByRole("button", { name: "Add Gym" }));

    expect(prompt).toHaveBeenCalledTimes(2);
    expect(screen.queryByText("Test Facility Should Not Render")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Address Should Not Render")).not.toBeInTheDocument();
    expect(screen.getByText("Facility data unavailable")).toBeInTheDocument();
  });
});
