import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock next/image
vi.mock("next/image", () => ({
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return React.createElement("img", props);
    },
}));
