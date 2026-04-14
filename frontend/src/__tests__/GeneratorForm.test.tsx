import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GeneratorForm } from "@/components/GeneratorForm";

describe("GeneratorForm", () => {
  it("renders all form fields", () => {
    render(<GeneratorForm onSubmit={vi.fn()} isGenerating={false} />);

    expect(screen.getByLabelText(/describe your dream/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/travel style/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/season/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
  });

  it("disables submit when form is incomplete", () => {
    render(<GeneratorForm onSubmit={vi.fn()} isGenerating={false} />);

    const button = screen.getByRole("button", { name: /generate/i });
    expect(button).toBeDisabled();
  });

  it("enables submit when form is complete", async () => {
    const user = userEvent.setup();
    render(<GeneratorForm onSubmit={vi.fn()} isGenerating={false} />);

    await user.type(
      screen.getByLabelText(/describe your dream/i),
      "I want a relaxing beach vacation with crystal clear water"
    );
    await user.selectOptions(screen.getByLabelText(/travel style/i), "relaxation");
    await user.selectOptions(screen.getByLabelText(/season/i), "summer");
    await user.selectOptions(screen.getByLabelText(/budget/i), "mid-range");

    const button = screen.getByRole("button", { name: /generate/i });
    expect(button).not.toBeDisabled();
  });

  it("calls onSubmit with form data", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<GeneratorForm onSubmit={onSubmit} isGenerating={false} />);

    await user.type(
      screen.getByLabelText(/describe your dream/i),
      "Ancient temples and peaceful gardens"
    );
    await user.selectOptions(screen.getByLabelText(/travel style/i), "cultural");
    await user.selectOptions(screen.getByLabelText(/season/i), "spring");
    await user.selectOptions(screen.getByLabelText(/budget/i), "luxury");

    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      vibe: "Ancient temples and peaceful gardens",
      travelStyle: "cultural",
      season: "spring",
      budgetTier: "luxury",
    });
  });

  it("shows generating state", () => {
    render(<GeneratorForm onSubmit={vi.fn()} isGenerating={true} />);

    expect(screen.getByRole("button", { name: /generating/i })).toBeInTheDocument();
  });
});
