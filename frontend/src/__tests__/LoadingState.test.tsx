import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "@/components/LoadingState";

describe("LoadingState", () => {
  it("shows status message", () => {
    render(
      <LoadingState status="generating" statusMessage="Analyzing your travel vibe..." />
    );
    expect(
      screen.getByText("Analyzing your travel vibe...")
    ).toBeInTheDocument();
  });

  it("renders all progress steps", () => {
    render(
      <LoadingState status="generating" statusMessage="Working..." />
    );
    expect(
      screen.getByText("Analyzing your travel vibe")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Finding your dream destination")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Creating your travel poster")
    ).toBeInTheDocument();
  });

  it("shows different message for text_complete", () => {
    render(
      <LoadingState
        status="text_complete"
        statusMessage="Creating your travel poster..."
      />
    );
    expect(
      screen.getByText("Creating your travel poster...")
    ).toBeInTheDocument();
  });
});
