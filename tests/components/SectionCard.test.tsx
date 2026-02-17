import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionCard from "@/components/response/SectionCard";
import type { Section } from "@/types";

describe("SectionCard Component", () => {
    const mockSection: Section = {
        id: "sec-1",
        type: "LODGING",
        title: "Test Section",
        items: [
            { id: "item-1", title: "Item 1", image_url: "", meta: ["Meta 1"], price_chip: "$50" },
            { id: "item-2", title: "Item 2", image_url: "", meta: ["Meta 2"], price_chip: "$60" },
        ],
        sources: ["Source A"]
    };

    it("renders title and items", () => {
        render(<SectionCard section={mockSection} />);
        expect(screen.getByText("Test Section")).toBeInTheDocument();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("renders sources if present", () => {
        render(<SectionCard section={mockSection} />);
        expect(screen.getByText(/Source A/)).toBeInTheDocument();
    });
});
