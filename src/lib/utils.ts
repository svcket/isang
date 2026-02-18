import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ResponseBlock, Section } from "@/types/response-block"

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
  const mergedSections = [...(current.sections || [])];

  if (incoming.sections) {
    incoming.sections.forEach(newSection => {
      const index = mergedSections.findIndex(s => s.id === newSection.id);
      if (index >= 0) {
        mergedSections[index] = newSection;
      } else {
        mergedSections.push(newSection);
      }
    });
  }

  return {
    ...current,
    ...incoming,
    sections: mergedSections,
  };
}

export function generateSection(type: Section['type'], destination: string): Section {
  const items = [];
  const count = 3;

  for (let i = 0; i < count; i++) {
    let title = `Item ${i + 1}`;
    let price = "$100";
    let imageKeyword = destination;

    switch (type) {
      case 'FLIGHT':
        title = `Airline ${i + 1}`;
        price = "$500";
        imageKeyword = "airplane";
        break;
      case 'LODGING':
        title = i === 0
          ? `The Marly Boutique Hotel – beachfront luxury with ocean views`
          : `Kloof Street Hotel – urban charm in the heart of ${destination}`;
        price = i === 0 ? "From ₦450k / night" : "From ₦520k / night";
        imageKeyword = "hotel,luxury";
        break;
      case 'FOOD':
        title = i === 0
          ? `Kloof Street House – romantic, colonial-era dining experience`
          : `The Pot Luck Club – trendy tapas & cocktails`;
        price = i === 0 ? "From ₦15k / meal" : "From ₦45k / meal";
        imageKeyword = "restaurant,food";
        break;
      case 'ACTIVITY':
        title = i === 0 ? `Caldera sunset walk` : `Red Beach visit`;
        price = "Free";
        imageKeyword = "travel,adventure";
        break;
    }

    items.push({
      id: `${type.toLowerCase()}-${destination}-${i}`,
      title,
      image_url: `https://source.unsplash.com/random/400x300?${imageKeyword}`,
      meta: [], // Removed generic "Details"
      price_chip: price,
    });
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    type,
    title: type === 'FLIGHT' ? 'Flights' :
      type === 'LODGING' ? 'Lodgings' :
        type === 'FOOD' ? 'Food & Restaurants' :
          type === 'ACTIVITY' ? 'Things To Do' :
            `${type} in ${destination}`,
    items: items,
  };
}
