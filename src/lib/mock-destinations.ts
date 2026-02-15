export type Destination = {
    id: string;
    name: string;
    region: string; // Country or broader region
    flag: string; // Emoji flag
    type: "city" | "region" | "continent";
    image: string; // Placeholder image URL
};

export const MOCK_DESTINATIONS: Destination[] = [
    {
        id: "cpt",
        name: "Cape Town",
        region: "South Africa",
        flag: "🇿🇦",
        type: "city",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071&auto=format&fit=crop"
    },
    {
        id: "cph",
        name: "Copenhagen",
        region: "Denmark",
        flag: "🇩🇰",
        type: "city",
        image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "cc",
        name: "Cape Coast",
        region: "Ghana",
        flag: "🇬🇭",
        type: "city",
        image: "https://images.unsplash.com/photo-1574614342686-2244222da85f?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "cda",
        name: "Cap-d'Ail",
        region: "France",
        flag: "🇫🇷",
        type: "city",
        image: "https://images.unsplash.com/photo-1534234828563-025977935442?q=80&w=2069&auto=format&fit=crop"
    },
    {
        id: "cap",
        name: "Capannori",
        region: "Italy",
        flag: "🇮🇹",
        type: "city",
        image: "https://images.unsplash.com/photo-1528643350106-cfbcf762b325?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "cb",
        name: "Capão Bonito",
        region: "Brazil",
        flag: "🇧🇷",
        type: "city",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "ldn",
        name: "London",
        region: "United Kingdom",
        flag: "🇬🇧",
        type: "city",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "nyc",
        name: "New York",
        region: "United States",
        flag: "🇺🇸",
        type: "city",
        image: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "par",
        name: "Paris",
        region: "France",
        flag: "🇫🇷",
        type: "city",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop"
    },
    {
        id: "tok",
        name: "Tokyo",
        region: "Japan",
        flag: "🇯🇵",
        type: "city",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1988&auto=format&fit=crop"
    },
    {
        id: "col",
        name: "Colombia",
        region: "South America",
        flag: "🇨🇴",
        type: "region",
        image: "https://images.unsplash.com/photo-1533630256860-dffc46747b0e?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "eur",
        name: "Europe",
        region: "Continent",
        flag: "🇪🇺",
        type: "continent",
        image: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=2011&auto=format&fit=crop"
    }
];
