export interface ScientificFeature {
  id: string;
  name: string;
  category: "Geology" | "Atmosphere" | "Discovery" | "Anomaly";
  description: string;
}

export interface PlanetaryMission {
  name: string;
  agency: string;
  year: string;
  significance: string;
}

export interface SolarPlanet {
  id: string;
  name: string;
  tagline: string;
  order: number;
  type: "Terrestrial" | "Gas Giant" | "Ice Giant";
  diameterKm: number;
  diameterRelative: string;
  distanceFromSunAU: number;
  orbitalPeriodDays: number;
  surfaceTempC: string;
  axialTiltDeg: number;
  gravityMps2: number;
  moonsCount: number;
  atmosphereComposition: string;
  coreComposition: string;
  
  // 3D Visual Rendering specs
  texturePath: string;
  nightTexturePath?: string;
  cloudsTexturePath?: string;
  ringTexturePath?: string;
  color: string;
  emissive: string;
  roughness: number;
  metalness: number;
  orbitRadius: number; // Visually scaled for navigable 3D space
  sizeRadius: number;  // Visually balanced relative scale
  rotationSpeed: number;
  orbitSpeed: number;
  hasRings?: boolean;
  ringInner?: number;
  ringOuter?: number;
  ringColor?: string;
  glowColor: string;
  
  // Real scientific content
  overview: string;
  internalStructure: string;
  atmosphereNotes: string;
  missions: PlanetaryMission[];
  features: ScientificFeature[];
  mysteries: string[]; // Unsolved scientific questions
}

export const SUN_DATA = {
  name: "The Sun (Sol)",
  type: "Yellow Dwarf (G2V)",
  diameterKm: 1392700,
  surfaceTempC: "5,500°C",
  coreTempC: "15,000,000°C",
  massRelative: "333,000 × Earth",
  ageYears: "4.6 Billion Years",
  composition: "73% Hydrogen, 25% Helium, 2% Heavier Elements",
  texturePath: "/textures/sun.jpg",
  color: "#ffaa00",
  emissive: "#ff7700",
};

export const SOLAR_PLANETS: SolarPlanet[] = [
  {
    id: "mercury",
    name: "Mercury",
    tagline: "The Sun-Scorched Messenger",
    order: 1,
    type: "Terrestrial",
    diameterKm: 4879,
    diameterRelative: "0.38 × Earth",
    distanceFromSunAU: 0.39,
    orbitalPeriodDays: 88,
    surfaceTempC: "-180°C to 430°C",
    axialTiltDeg: 0.034,
    gravityMps2: 3.7,
    moonsCount: 0,
    atmosphereComposition: "Trace exosphere: Oxygen (42%), Sodium (29%), Hydrogen (22%)",
    coreComposition: "Massive metallic iron core comprising ~85% of planetary radius",
    texturePath: "/textures/mercury.jpg",
    color: "#a39e93",
    emissive: "#2b2a29",
    roughness: 0.85,
    metalness: 0.2,
    orbitRadius: 11.5,
    sizeRadius: 0.7,
    rotationSpeed: 0.008,
    orbitSpeed: 0.04,
    glowColor: "#d4cebe",
    overview:
      "Mercury is the smallest planet and closest to the Sun. Having virtually no atmosphere to trap heat, it experiences the most extreme temperature swings in the solar system.",
    internalStructure:
      "Unlike any other terrestrial world, Mercury's interior is dominated by a colossal iron core (~2,000 km radius), likely partially molten and responsible for its global magnetic dipole.",
    atmosphereNotes:
      "Lacks a persistent atmosphere; instead possesses a tenuous exosphere blasted by the solar wind, continuously replenished by micrometeorite impacts.",
    missions: [
      { name: "Mariner 10", agency: "NASA", year: "1974", significance: "First spacecraft to fly by Mercury and map ~45% of its surface." },
      { name: "MESSENGER", agency: "NASA", year: "2011-2015", significance: "Orbited Mercury for 4 years, discovering volatile water ice inside permanently shadowed polar craters." },
      { name: "BepiColombo", agency: "ESA / JAXA", year: "En Route (2025)", significance: "Dual-orbiter mission investigating interior structure and magnetospheric dynamics." },
    ],
    features: [
      { id: "caloris", name: "Caloris Basin", category: "Geology", description: "A 1,550 km impact basin surrounded by 2 km-high concentric mountain ranges." },
      { id: "rupes", name: "Discovery Rupes", category: "Geology", description: "Enormous lobate scarps formed as the planet cooled and shrank over billions of years." },
      { id: "polar_ice", name: "Polar Ice Deposits", category: "Anomaly", description: "Radar-bright water ice preserved inside permanently shadowed craters at the poles." },
    ],
    mysteries: [
      "Why is Mercury's iron-rich core disproportionately massive compared to its silicate mantle?",
      "How does Mercury maintain an active dynamo magnetic field despite its small planetary volume?",
    ],
  },
  {
    id: "venus",
    name: "Venus",
    tagline: "The Runaway Greenhouse Forge",
    order: 2,
    type: "Terrestrial",
    diameterKm: 12104,
    diameterRelative: "0.95 × Earth",
    distanceFromSunAU: 0.72,
    orbitalPeriodDays: 224.7,
    surfaceTempC: "465°C (Uniform)",
    axialTiltDeg: 177.3, // Retrograde
    gravityMps2: 8.87,
    moonsCount: 0,
    atmosphereComposition: "96.5% Carbon Dioxide, 3.5% Nitrogen, traces of SO₂",
    coreComposition: "Solid/liquid iron-nickel core surrounded by a silicate rock mantle",
    texturePath: "/textures/venus.jpg",
    color: "#e3bb76",
    emissive: "#4a3311",
    roughness: 0.6,
    metalness: 0.1,
    orbitRadius: 15,
    sizeRadius: 1.15,
    rotationSpeed: -0.003, // Retrograde spin
    orbitSpeed: 0.03,
    glowColor: "#fde68a",
    overview:
      "Venus is often called Earth's twin due to similar size and mass, but it is an unforgiving hellscape where surface pressure equals 92 Earth atmospheres and clouds rain sulfuric acid.",
    internalStructure:
      "Possesses a metallic core and rocky mantle similar to Earth, yet lacks a global intrinsic magnetic field—suggesting the core is either not convecting or entirely solid/stagnant.",
    atmosphereNotes:
      "A crushing, super-rotating atmosphere that circulates the entire planet in just 4 Earth days, driving a runaway greenhouse effect hotter than Mercury.",
    missions: [
      { name: "Venera 7 & 13", agency: "Soviet Space Program", year: "1970/1982", significance: "First spacecraft to land on another planet and transmit color photos of the scorched surface." },
      { name: "Magellan", agency: "NASA", year: "1990-1994", significance: "Synthetic aperture radar mapped 98% of the surface beneath the cloud deck." },
      { name: "DAVINCI & VERITAS", agency: "NASA", year: "Upcoming (2030s)", significance: "Next-generation probe atmospheric descent and high-resolution radar topography." },
    ],
    features: [
      { id: "maxwell", name: "Maxwell Montes", category: "Geology", description: "Highest mountain range on Venus, rising 11 km above average planetary elevation." },
      { id: "arachnoids", name: "Arachnoid Structures", category: "Geology", description: "Unique spider-web-like volcanic fractures found only on the Venusian surface." },
      { id: "phosphines", name: "Phosphine Spectral Signatures", category: "Anomaly", description: "Debated chemical absorption lines in the temperate upper cloud layers." },
    ],
    mysteries: [
      "Did Venus once possess temperate oceans before runaway greenhouse vaporization?",
      "Why did Venus experience a catastrophic resurfacing event 300–600 million years ago?",
    ],
  },
  {
    id: "earth",
    name: "Earth",
    tagline: "The Living Blue Marble",
    order: 3,
    type: "Terrestrial",
    diameterKm: 12742,
    diameterRelative: "1.00 × Earth",
    distanceFromSunAU: 1.00,
    orbitalPeriodDays: 365.25,
    surfaceTempC: "-88°C to 58°C (Mean 15°C)",
    axialTiltDeg: 23.44,
    gravityMps2: 9.81,
    moonsCount: 1,
    atmosphereComposition: "78% Nitrogen, 21% Oxygen, 0.9% Argon, 0.04% CO₂",
    coreComposition: "Solid iron inner core with liquid iron-nickel outer core powering the magnetosphere",
    texturePath: "/textures/earth.jpg",
    nightTexturePath: "/textures/earth_night.jpg",
    cloudsTexturePath: "/textures/earth_clouds.jpg",
    color: "#2563eb",
    emissive: "#0a1936",
    roughness: 0.5,
    metalness: 0.15,
    orbitRadius: 21,
    sizeRadius: 1.25,
    rotationSpeed: 0.02,
    orbitSpeed: 0.024,
    glowColor: "#60a5fa",
    overview:
      "Earth is the only known celestial body harboring active biology, liquid surface water oceans, and active plate tectonics that regulate climate across billions of years.",
    internalStructure:
      "Layered into a brittle crust, convecting silicate mantle, liquid outer core generating the geodynamo shield, and a crystalline solid iron inner core.",
    atmosphereNotes:
      "A finely tuned nitrogen-oxygen atmosphere shielded by a powerful magnetosphere that deflects lethal solar wind particles, generating polar auroras.",
    missions: [
      { name: "Apollo 8 & 11", agency: "NASA", year: "1968/1969", significance: "First human voyage beyond low-Earth orbit and first landing on the Moon." },
      { name: "Landsat & Sentinel", agency: "NASA / ESA", year: "1972-Present", significance: "Decades of continuous planetary-scale multispectral remote sensing." },
    ],
    features: [
      { id: "mariana", name: "Mariana Trench", category: "Geology", description: "Deepest oceanic trench on Earth (~11,034 m), carved by oceanic plate subduction." },
      { id: "ozone", name: "Stratospheric Ozone Shield", category: "Atmosphere", description: "Vital chemical layer filtering hazardous ultraviolet radiation." },
      { id: "van_allen", name: "Van Allen Radiation Belts", category: "Discovery", description: "Zones of magnetically trapped energetic charged particles surrounding the globe." },
    ],
    mysteries: [
      "What triggered the exact prebiotic chemistry that sparked abiogenesis 3.8+ billion years ago?",
      "How do geomagnetic reversals initiate and evolve within the turbulent liquid outer core?",
    ],
  },
  {
    id: "mars",
    name: "Mars",
    tagline: "The Rust-Veiled Frontier",
    order: 4,
    type: "Terrestrial",
    diameterKm: 6779,
    diameterRelative: "0.53 × Earth",
    distanceFromSunAU: 1.52,
    orbitalPeriodDays: 687,
    surfaceTempC: "-140°C to 20°C",
    axialTiltDeg: 25.19,
    gravityMps2: 3.72,
    moonsCount: 2,
    atmosphereComposition: "95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon",
    coreComposition: "Sulfur-rich iron core surrounded by a silicate mantle and iron oxide crust",
    texturePath: "/textures/mars.jpg",
    color: "#c2410c",
    emissive: "#431407",
    roughness: 0.75,
    metalness: 0.1,
    orbitRadius: 27,
    sizeRadius: 0.85,
    rotationSpeed: 0.018,
    orbitSpeed: 0.018,
    glowColor: "#fb923c",
    overview:
      "Mars is a cold desert world whose reddish hue comes from oxidized iron dust on its ancient surface. Geological evidence reveals it once had flowing rivers, lakes, and a thicker atmosphere.",
    internalStructure:
      "NASA InSight data revealed a liquid metallic core (~1,830 km radius) under a ~500 km silicate mantle and an unexpectedly thick crust with remnant crustal magnetization.",
    atmosphereNotes:
      "Tenuous atmosphere (<1% Earth pressure), prone to catastrophic global dust storms that can shroud the entire planet for months at a time.",
    missions: [
      { name: "Viking 1 & 2", agency: "NASA", year: "1976", significance: "First operational long-duration Mars landers searching for biosignatures." },
      { name: "Curiosity & Perseverance", agency: "NASA", year: "2012 / 2020", significance: "Nuclear-powered rovers exploring ancient aqueous environments in Gale & Jezero Craters." },
      { name: "Tianwen-1 / Zhurong", agency: "CNSA", year: "2021", significance: "Combined orbiter and radar-equipped rover exploring Utopia Planitia." },
    ],
    features: [
      { id: "olympus_mons", name: "Olympus Mons", category: "Geology", description: "Largest volcano in the solar system, standing 21.9 km high (over 2.5× Mount Everest)." },
      { id: "valles_marineris", name: "Valles Marineris", category: "Geology", description: "A vast canyon system stretching over 4,000 km long and up to 7 km deep." },
      { id: "polar_caps", name: "Perennial Polar Caps", category: "Atmosphere", description: "Layered deposits of water ice and seasonal frozen carbon dioxide dry ice." },
    ],
    mysteries: [
      "Where did Mars' ancient dense atmosphere escape to after its global magnetic field died?",
      "Do subsurface brine reservoirs or hydrothermal pockets still preserve microbial extremophiles?",
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    tagline: "The Monarch of the System",
    order: 5,
    type: "Gas Giant",
    diameterKm: 139820,
    diameterRelative: "11.0 × Earth",
    distanceFromSunAU: 5.20,
    orbitalPeriodDays: 4333,
    surfaceTempC: "-110°C (Cloud Tops)",
    axialTiltDeg: 3.13,
    gravityMps2: 24.79,
    moonsCount: 95,
    atmosphereComposition: "89.8% Hydrogen, 10.2% Helium, traces of Methane, Ammonia, H₂O",
    coreComposition: "Diffuse, fuzzy core of rock and metallic hydrogen under millions of atmospheres",
    texturePath: "/textures/jupiter.jpg",
    color: "#b45309",
    emissive: "#451a03",
    roughness: 0.65,
    metalness: 0.2,
    orbitRadius: 36,
    sizeRadius: 2.5,
    rotationSpeed: 0.04, // Extremely fast rotation (10hr day)
    orbitSpeed: 0.012,
    glowColor: "#f59e0b",
    overview:
      "Jupiter is more than twice as massive as all other solar planets combined. Its immense gravity acts as a gravitational shield, deflecting or capturing comets throughout solar history.",
    internalStructure:
      "Under crushing pressure, hydrogen transitions into liquid metallic hydrogen—an electrically conducting fluid that generates an immense magnetosphere larger than the Sun in our night sky.",
    atmosphereNotes:
      "Vivid alternating light zones and dark belts created by powerful jet streams, ammonia ice clouds, and cyclonic vortex storms.",
    missions: [
      { name: "Voyager 1 & 2", agency: "NASA", year: "1979", significance: "Discovered Jupiter's faint ring system, active volcanism on Io, and ice crust on Europa." },
      { name: "Galileo", agency: "NASA", year: "1995-2003", significance: "First orbiter around Jupiter; deployed an atmospheric descent probe." },
      { name: "Juno", agency: "NASA", year: "2016-Present", significance: "Polar-orbiting probe mapping gravity fields, water abundance, and deep atmospheric dynamics." },
    ],
    features: [
      { id: "great_red_spot", name: "The Great Red Spot", category: "Atmosphere", description: "An anticyclonic storm larger than Earth that has raged continuously for over 350 years." },
      { id: "radiation_belts", name: "Intense Radiation Belts", category: "Anomaly", description: "Trapped high-energy ions that destroy unshielded electronics within hours." },
      { id: "galilean_moons", name: "Galilean Moons", category: "Discovery", description: "Io (volcanic), Europa (subsurface ocean), Ganymede (magnetic), Callisto (cratered)." },
    ],
    mysteries: [
      "Why is Jupiter's core 'dilute' and spread over 30–50% of the planetary radius rather than compact?",
      "What exact chemical compound (chromophore) imparts the vivid reddish-orange color to the Great Red Spot?",
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    tagline: "The Jewel of Celestial Rings",
    order: 6,
    type: "Gas Giant",
    diameterKm: 116460,
    diameterRelative: "9.1 × Earth",
    distanceFromSunAU: 9.58,
    orbitalPeriodDays: 10759,
    surfaceTempC: "-140°C",
    axialTiltDeg: 26.73,
    gravityMps2: 10.44,
    moonsCount: 146,
    atmosphereComposition: "96.3% Hydrogen, 3.25% Helium, traces of Methane and Ammonia",
    coreComposition: "Dense core of rock, ice, and metallic hydrogen enveloped by liquid helium-hydrogen",
    texturePath: "/textures/saturn.jpg",
    ringTexturePath: "/textures/saturn_ring.png",
    color: "#d97706",
    emissive: "#451a03",
    roughness: 0.6,
    metalness: 0.15,
    orbitRadius: 46,
    sizeRadius: 2.1,
    rotationSpeed: 0.038,
    orbitSpeed: 0.009,
    hasRings: true,
    ringInner: 2.5,
    ringOuter: 4.4,
    ringColor: "#fde68a",
    glowColor: "#fef08a",
    overview:
      "Saturn is celebrated for its breathtaking planetary ring system. It is also the least dense planet in the solar system—lighter than water—with an average density of just 0.687 g/cm³.",
    internalStructure:
      "Similar to Jupiter, with a liquid metallic hydrogen layer above a rocky/icy core. Helium precipitation ('helium rain') slowly sinks toward the center, releasing thermal energy.",
    atmosphereNotes:
      "Pale gold hues caused by ammonia crystals in the upper atmosphere. High-speed equatorial winds reach speeds exceeding 1,800 km/h.",
    missions: [
      { name: "Pioneer 11 & Voyagers", agency: "NASA", year: "1979/1980/1981", significance: "First reconnaissance, photographing ring structures and discovering dozens of moons." },
      { name: "Cassini-Huygens", agency: "NASA / ESA / ASI", year: "1997-2017", significance: "13-year orbital mission; Huygens probe landed on Titan; discovered geysers on Enceladus." },
    ],
    features: [
      { id: "saturn_rings", name: "Grand Ring System", category: "Discovery", description: "Spans 282,000 km wide yet only ~10 meters thick, composed of 99% pure water ice particles." },
      { id: "north_hexagon", name: "North Polar Hexagon", category: "Atmosphere", description: "A persistent geometric 6-sided jet stream pattern ~30,000 km across." },
      { id: "enceladus_plumes", name: "Enceladus Cryo-Plumes", category: "Discovery", description: "Geysers spraying water vapor and organics from a global subsurface ocean into space." },
    ],
    mysteries: [
      "Are Saturn's rings youthful remnants of a destroyed moon (10–100M yrs old) or primordial structures?",
      "How does the persistent north polar hexagonal atmospheric jet maintain its sharp geometric symmetry?",
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    tagline: "The Tilted Ice Giant",
    order: 7,
    type: "Ice Giant",
    diameterKm: 50724,
    diameterRelative: "4.0 × Earth",
    distanceFromSunAU: 19.22,
    orbitalPeriodDays: 30687,
    surfaceTempC: "-195°C (Lowest: -224°C)",
    axialTiltDeg: 97.77, // Completely on its side
    gravityMps2: 8.69,
    moonsCount: 28,
    atmosphereComposition: "82.5% Hydrogen, 15.2% Helium, 2.3% Methane",
    coreComposition: "Mantle of supercritical water, ammonia, and methane ices around a small rocky core",
    texturePath: "/textures/uranus.jpg",
    color: "#5eead4",
    emissive: "#042f2e",
    roughness: 0.75,
    metalness: 0.05,
    orbitRadius: 56,
    sizeRadius: 1.6,
    rotationSpeed: -0.015, // Retrograde & sideways
    orbitSpeed: 0.006,
    hasRings: true,
    ringInner: 2.1,
    ringOuter: 2.9,
    ringColor: "#99f6e4",
    glowColor: "#2dd4bf",
    overview:
      "Uranus is an ice giant that orbits the Sun tipped completely on its side, resulting in extreme 42-year seasons of sunlight followed by 42 years of total darkness.",
    internalStructure:
      "Unlike Jupiter and Saturn, Uranus does not possess metallic hydrogen. It is dominated by hot, dense supercritical 'icy' fluids of water, methane, and ammonia under high pressure.",
    atmosphereNotes:
      "Methane gas in the upper atmosphere absorbs red wavelengths, giving Uranus its serene cyan-aquamarine appearance.",
    missions: [
      { name: "Voyager 2", agency: "NASA", year: "1986", significance: "The only spacecraft to ever visit Uranus, discovering 10 new moons and 2 new rings." },
      { name: "Uranus Orbiter and Probe (UOP)", agency: "NASA", year: "Flagship Priority (2030s)", significance: "Top-priority planetary mission to deploy an atmospheric probe and study the magnetosphere." },
    ],
    features: [
      { id: "sideways_tilt", name: "98-Degree Axial Tilt", category: "Anomaly", description: "Likely caused by a colossal collision with an Earth-sized protoplanet during solar system formation." },
      { id: "miranda_cliffs", name: "Verona Rupes on Miranda", category: "Geology", description: "Tallest known cliff in the solar system (~20 km sheer drop), located on Uranus' moon Miranda." },
      { id: "asymmetric_field", name: "Off-Center Magnetic Dipole", category: "Anomaly", description: "Magnetic axis is tilted 59 degrees from rotational axis and displaced from the planetary center." },
    ],
    mysteries: [
      "Why is Uranus emitting virtually zero internal heat compared to its sister ice giant Neptune?",
      "What exact impact mechanism tilted the planet without destabilizing its satellite system?",
    ],
  },
  {
    id: "neptune",
    name: "Neptune",
    tagline: "The Supersonic Wind Realm",
    order: 8,
    type: "Ice Giant",
    diameterKm: 49244,
    diameterRelative: "3.86 × Earth",
    distanceFromSunAU: 30.05,
    orbitalPeriodDays: 60190,
    surfaceTempC: "-200°C",
    axialTiltDeg: 28.32,
    gravityMps2: 11.15,
    moonsCount: 16,
    atmosphereComposition: "80% Hydrogen, 19% Helium, 1.5% Methane",
    coreComposition: "Solid rocky-metallic core surrounded by an icy mantle of water, ammonia, and methane",
    texturePath: "/textures/neptune.jpg",
    color: "#2563eb",
    emissive: "#1e1b4b",
    roughness: 0.5,
    metalness: 0.15,
    orbitRadius: 66,
    sizeRadius: 1.55,
    rotationSpeed: 0.022,
    orbitSpeed: 0.004,
    hasRings: true,
    ringInner: 2.0,
    ringOuter: 2.8,
    ringColor: "#60a5fa",
    glowColor: "#3b82f6",
    overview:
      "Neptune is the most distant major planet in the solar system, discovered mathematically before being seen through a telescope. It is home to the fastest atmospheric winds in the solar system, reaching 2,100 km/h.",
    internalStructure:
      "A dense solid core approximately the mass of Earth, enclosed within a mantle of high-pressure fluid water, methane, and ammonia, where diamonds may literally crystallize and rain down.",
    atmosphereNotes:
      "A deep vivid cobalt blue atmosphere with wispy high-altitude cirrus clouds composed of methane ice crystals.",
    missions: [
      { name: "Voyager 2", agency: "NASA", year: "1989", significance: "Historic flyby providing our first and only close-up imagery of Neptune, its ring arcs, and moon Triton." },
      { name: "James Webb Space Telescope", agency: "NASA / ESA / CSA", year: "2022-Present", significance: "Captured the clearest view of Neptune's delicate rings in over three decades in infrared." },
    ],
    features: [
      { id: "supersonic_winds", name: "Supersonic Equatorial Jet", category: "Atmosphere", description: "Atmospheric winds exceeding Mach 1.5, blowing retrograde against planetary rotation." },
      { id: "triton_geysers", name: "Triton Nitrogen Cryo-Geysers", category: "Discovery", description: "A captured Kuiper Belt dwarf moon with active geysers erupting nitrogen gas 8 km high." },
      { id: "diamond_rain", name: "Mantle Diamond Precipitation", category: "Anomaly", description: "Extreme pressures cracking methane hydrocarbons into metallic hydrogen and sinking diamond hail." },
    ],
    mysteries: [
      "What internal energetic mechanism powers supersonic winds on a planet that receives 900× less solar energy than Earth?",
      "How will Triton's retrograde decaying orbit evolve before it crosses the Roche limit in 3.6 billion years?",
    ],
  },
];
