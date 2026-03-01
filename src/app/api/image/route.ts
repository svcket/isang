import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Image proxy endpoint.
 *
 * Usage:  /api/image?url=<encoded-image-url>
 *
 * This route:
 *  1. Fetches the remote image server-side (avoids CORS / hot-link blocking).
 *  2. Streams it back to the client with a Cache-Control header.
 *  3. Can be used with `next/image` via `remotePatterns` allowlist or `unoptimized`.
 */
export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json(
            { error: "Missing 'url' query parameter" },
            { status: 400 }
        );
    }

    // Basic validation: only allow http(s)
    let parsed: URL;
    try {
        parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Invalid protocol");
        }
    } catch {
        return NextResponse.json(
            { error: "Invalid URL" },
            { status: 400 }
        );
    }

    try {
        const upstream = await fetch(parsed.toString(), {
            headers: {
                // Pass through a generic UA to avoid bot-blocking
                "User-Agent":
                    "Mozilla/5.0 (compatible; IsangBot/1.0; +https://isang.app)",
            },
            signal: AbortSignal.timeout(8000), // 8s timeout
        });

        if (!upstream.ok) {
            return NextResponse.json(
                { error: `Upstream returned ${upstream.status}` },
                { status: upstream.status }
            );
        }

        const contentType =
            upstream.headers.get("content-type") || "image/jpeg";
        const body = await upstream.arrayBuffer();

        return new NextResponse(body, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, s-maxage=604800",
                "X-Image-Source": parsed.hostname,
            },
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
            { error: `Failed to fetch image: ${message}` },
            { status: 502 }
        );
    }
}
