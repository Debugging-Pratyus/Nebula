export interface PlanetData {
  id: string;
  name: string;
  tagline: string;
  classification: string;
  diameter: string;
  distance: string;
  orbitalPeriod: string;
  surfaceTemp: string;
  moons: number;
  atmosphereComposition: string;
  color: string;
  emissive: string;
  glowColor: string;
  ring: boolean;
  ringInner?: number;
  ringOuter?: number;
  ringColor?: string;
  description: string;
  lore: string;
  features: string[];
}

export const PLANETS: PlanetData[] = [
  {
    id: "aethelgard",
    name: "Aethelgard",
    tagline: "The Sapphire Colossus",
    classification: "Gas Giant • Class IV",
    diameter: "139,820 km",
    distance: "5.20 AU",
    orbitalPeriod: "11.86 Earth Years",
    surfaceTemp: "-110°C",
    moons: 79,
    atmosphereComposition: "89% H₂, 10% He, 1% Methane",
    color: "#6b46c1",
    emissive: "#2d1663",
    glowColor: "#a855f7",
    ring: true,
    ringInner: 2.5,
    ringOuter: 4.2,
    ringColor: "#93c5fd",
    description:
      "A towering purple-indigo giant encircled by luminous crystalline rings that catch and refract the faint light of distant stellar cores.",
    lore: "Legend holds that the ancient nomadic cartographers calibrated their celestial compasses by the harmonic resonance emitted from Aethelgard's rings.",
    features: [
      "Perpetual cryo-vortices spanning thousands of kilometers",
      "Liquid metallic hydrogen mantle creating massive auroral belts",
      "Rings composed of 99% pure water ice and hyper-dense silicates",
    ],
  },
  {
    id: "solaria",
    name: "Solaria Prime",
    tagline: "The Obsidian Forge",
    classification: "Silicate Terrestrial • Class I",
    diameter: "8,940 km",
    distance: "0.38 AU",
    orbitalPeriod: "88 Earth Days",
    surfaceTemp: "430°C",
    moons: 0,
    atmosphereComposition: "Trace Sodium, Potassium, Helium",
    color: "#f97316",
    emissive: "#7c2d12",
    glowColor: "#fb923c",
    ring: false,
    description:
      "A scorched terrestrial world bathed in perpetual coronal flares, where tectonic fissures bleed molten magma into crystalline basalt seas.",
    lore: "Deep within Solaria's nightside chasms, heat-resistant mineral spires crystallize under extreme thermal differentials, yielding rare pyro-crystals.",
    features: [
      "Thermal tidal ridges that crest and break like fiery ocean waves",
      "Atmospheric ablation causing a faint sodium comet-tail",
      "Zero tectonic respite—continual crustal regeneration",
    ],
  },
  {
    id: "elysium",
    name: "Elysium VII",
    tagline: "The Oceanic Sanctuary",
    classification: "Pelagic Super-Earth • Class III",
    diameter: "17,400 km",
    distance: "1.08 AU",
    orbitalPeriod: "412 Earth Days",
    surfaceTemp: "18°C",
    moons: 2,
    atmosphereComposition: "74% N₂, 22% O₂, 3% Ar, 1% H₂O",
    color: "#06b6d4",
    emissive: "#083344",
    glowColor: "#38bdf8",
    ring: false,
    description:
      "A serene globe enveloped entirely by an azure ocean, punctuated by swirling bioluminescent storms and colossal underwater rift-currents.",
    lore: "Bioluminescent phytoplankton colonies in Elysium's southern currents pulse in coordinated patterns discernible even from high orbital orbit.",
    features: [
      "Depth-defying oceanic trenches reaching over 80 kilometers deep",
      "Bioluminescent cloud banks that gently glow throughout planetary dusk",
      "Dual resonant tidal moons creating majestic cyclical wave crests",
    ],
  },
  {
    id: "khoros",
    name: "Khoros Null",
    tagline: "The Glacial Bastion",
    classification: "Cryo-Terrestrial • Class II",
    diameter: "11,200 km",
    distance: "2.85 AU",
    orbitalPeriod: "4.8 Earth Years",
    surfaceTemp: "-160°C",
    moons: 4,
    atmosphereComposition: "92% Nitrogen, 6% Argon, 2% Methane",
    color: "#818cf8",
    emissive: "#1e1b4b",
    glowColor: "#c7d2fe",
    ring: true,
    ringInner: 2.2,
    ringOuter: 3.1,
    ringColor: "#a5b4fc",
    description:
      "A petrified world of nitrogen glaciers and cobalt ice plains, shielded beneath an ethereal ozone veil that reflects emerald and violet auroras.",
    lore: "Subsurface acoustic sensors from early autonomous probes detected rhythmic subterranean shifts, colloquially termed 'The Khoros Pulse'.",
    features: [
      "Cryovolcanoes spewing slush of ammonia and liquid water",
      "Pristine mirrored plains reflecting deep interstellar space",
      "Atmospheric ion storms sparking iridescent static across the rings",
    ],
  },
];
