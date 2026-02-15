import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ResponseBlock, Section } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Merges a new ResponseBlock into an existing one.
 * - Updates top-level fields (summary, trip_meta) from the new block.
 * - Merges sections:
 *   - If a section with the same ID exists, it is replaced by the new section.
 *   - Sections not present in the new block are KEPT (persisted).
 *   - New sections are added.
 */
export function mergeResponseBlocks(current: ResponseBlock, incoming: ResponseBlock): ResponseBlock {
  const mergedSections = [...current.sections];

  incoming.sections.forEach(newSection => {
    const index = mergedSections.findIndex(s => s.id === newSection.id);
    if (index >= 0) {
      mergedSections[index] = newSection;
    } else {
      mergedSections.push(newSection);
    }
  });

  return {
    ...current,
    ...incoming,
    sections: mergedSections,
  };
}

