import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock next/image
vi.mock("next/image", () => ({
    default: (props: unknown) => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return React.createElement("img", props as any);
    },
}));
