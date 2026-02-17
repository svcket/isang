import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ResponseShell from "@/components/response/ResponseShell";
import type { ResponseBlock } from "@/types";

describe("ResponseShell Component", () => {
    const mockData: ResponseBlock = {
        type: "TRIP_PLAN",
        summary: "Test Summary",
        trip_meta: {
            destination: "Test Dest",
            duration: "5 days",
            currency: "$",
            budget_est: "$100",
            dates: "Aug 24 - Aug 31",
            travelers: "2 Travelers"
        },
        sections: [
            {
                id: "sec-1",
                type: "LODGING", // Maps to StaysSection
                title: "Where to Stay",
                items: [
                    { id: "item-1", title: "Hotel A", image_url: "", meta: [], price_chip: "$100" }
                ],
                sources: []
            }
        ],
        actions: [
            { action_id: "act-1", label: "Primary Action", style: "PRIMARY" },
            { action_id: "act-2", label: "Secondary Action", style: "SECONDARY" }
        ]
    };

    it("renders trip meta", () => {
        render(<ResponseShell data={mockData} />);
        expect(screen.getByText("Test Dest")).toBeInTheDocument();
        expect(screen.getByText("Aug 24 - Aug 31")).toBeInTheDocument();
    });

    it("renders sections", () => {
        render(<ResponseShell data={mockData} />);
        expect(screen.getByRole("heading", { name: "Lodgings" })).toBeInTheDocument();
        expect(screen.getByText("Hotel A")).toBeInTheDocument();
    });

    it("renders actions", () => {
        render(<ResponseShell data={mockData} />);
        const primaryBtn = screen.getByText("Primary Action");
        const secondaryBtn = screen.getByText("Secondary Action");

        expect(primaryBtn).toBeInTheDocument();
        expect(secondaryBtn).toBeInTheDocument();
    });

    it("calls onAction when action buttons are clicked", () => {
        const handleAction = vi.fn();
        render(<ResponseShell data={mockData} onAction={handleAction} />);

        fireEvent.click(screen.getByText("Primary Action"));
        expect(handleAction).toHaveBeenCalledWith("act-1", undefined);
    });
});
