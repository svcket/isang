import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ResponseShell from "@/components/response/ResponseShell"; // Using ResponseShell to test CTA group logic
import type { ResponseBlock } from "@/types";

// Since CTAGroup is not a standalone exported component but part of ResponseShell,
// we test the CTA grouping logic via ResponseShell.
describe("CTAGroup Logic (via ResponseShell)", () => {
    const baseData: ResponseBlock = {
        type: "TRIP_PLAN",
        summary: "Summary",
        trip_meta: { destination: "Dest", currency: "$", budget_est: "100" },
        sections: [],
        actions: []
    };

    it("renders only primary action if provided", () => {
        const data = {
            ...baseData,
            actions: [{ action_id: "p1", label: "Primary Only", style: "PRIMARY" }]
        } as ResponseBlock;

        render(<ResponseShell data={data} />);
        const btn = screen.getByText("Primary Only");
        expect(btn).toHaveClass("bg-primary"); // Check style class
    });

    it("renders primary and secondary actions", () => {
        const data = {
            ...baseData,
            actions: [
                { action_id: "p1", label: "Primary", style: "PRIMARY" },
                { action_id: "s1", label: "Secondary", style: "SECONDARY" }
            ]
        } as ResponseBlock;

        render(<ResponseShell data={data} />);
        const pBtn = screen.getByText("Primary");
        const sBtn = screen.getByText("Secondary");

        expect(pBtn).toBeInTheDocument();
        expect(sBtn).toBeInTheDocument();
        expect(sBtn).not.toHaveClass("bg-primary");
    });
});
