import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GymsPage from "./page";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GymsPage", () => {
  it("renders truthful registration and listing unavailable states", () => {
    render(<GymsPage />);

    expect(screen.getByText("Gyms & Facilities")).toBeInTheDocument();
    expect(screen.getByText("Facility registration unavailable")).toBeInTheDocument();
    expect(screen.getByText("Facility creation and provisioning are not connected on this page.")).toBeInTheDocument();
    expect(screen.getByText("Facility data unavailable")).toBeInTheDocument();
    expect(screen.getByText("Facility listing is not connected.")).toBeInTheDocument();
  });

  it("does not render active facility registration controls", () => {
    render(<GymsPage />);

    expect(screen.queryByRole("button", { name: "Add Gym" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Add Gym" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Register Establishment" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Register Establishment" })).not.toBeInTheDocument();
  });

  it("does not invoke browser prompts or fabricate facility records", () => {
    const prompt = vi.spyOn(window, "prompt");

    render(<GymsPage />);

    expect(screen.queryByText("No establishments registered")).not.toBeInTheDocument();
    expect(screen.queryByText("Titan Fitness Principal")).not.toBeInTheDocument();
    expect(screen.queryByText("Titan Fitness Downtown")).not.toBeInTheDocument();
    expect(screen.queryByText("102 El Camino Real, Menlo Park, CA")).not.toBeInTheDocument();
    expect(screen.queryByText("540 University Ave, Palo Alto, CA")).not.toBeInTheDocument();
    expect(screen.queryByText("₹18,500")).not.toBeInTheDocument();
    expect(screen.queryByText("₹11,200")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Facility Should Not Render")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Address Should Not Render")).not.toBeInTheDocument();

    expect(prompt).not.toHaveBeenCalled();
  });
});
