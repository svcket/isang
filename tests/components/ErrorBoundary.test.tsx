import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const ThrowError = () => {
    throw new Error("Test Error");
};

const SafeComponent = () => <div>Safe Content</div>;

describe("ErrorBoundary Component", () => {
    // Silence console.error for this test suite as we expect errors
    const originalError = console.error;
    beforeEach(() => {
        console.error = vi.fn();
    });
    afterEach(() => {
        console.error = originalError;
    });

    it("renders children when no error works", () => {
        render(
            <ErrorBoundary>
                <SafeComponent />
            </ErrorBoundary>
        );
        expect(screen.getByText("Safe Content")).toBeInTheDocument();
    });

    it("renders fallback UI when error occurs", () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText("Something went wrong displaying this section.")).toBeInTheDocument();
    });

    it("renders custom fallback if provided", () => {
        render(
            <ErrorBoundary fallback={<div>Custom Error Message</div>}>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText("Custom Error Message")).toBeInTheDocument();
    });
});
