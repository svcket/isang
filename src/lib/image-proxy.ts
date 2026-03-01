/**
 * Returns a proxied URL for a remote image.
 * e.g. imageProxyUrl("https://…/photo.jpg") → "/api/image?url=https%3A…"
 *
 * Usage with next/image:
 *   <Image src={imageProxyUrl(remoteUrl)} ... />
 */
export function imageProxyUrl(remoteUrl: string): string {
    return `/api/image?url=${encodeURIComponent(remoteUrl)}`;
}
