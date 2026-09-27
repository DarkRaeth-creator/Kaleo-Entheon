// ============================================================
// KALEO — WORLD OF ENTHEON
// Master World Registry
//
// This file contains the established world structure from the
// Kaleo World reference. It is intentionally data-only so maps,
// routes, ferries, gyms and future systems can reference the same
// source of truth instead of hard-coding world information.
// ============================================================

const KALEO_WORLD = {
    name: "Kaleo",

    regions: [
        {
            id: "westmere",
            name: "Westmere",
            majorCity: "Everhope City",
            settlements: ["Valehaven", "Briarwood", "Oakridge"],
            landmark: "The Great Tree",
            gymId: "everhope-gym"
        },
        {
            id: "dunridge",
            name: "Dunridge",
            majorCity: "Stonehaven",
            settlements: ["Pinewatch", "Stonebrook"],
            landmark: null,
            gymId: null
        },
        {
            id: "seawick",
            name: "Seawick",
            majorCity: "Gullhaven",
            settlements: ["Tidewatch", "Driftwood"],
            landmark: null,
            gymId: "gullhaven-gym"
        },
        {
            id: "highreach",
            name: "Highreach",
            majorCity: "Thermalis",
            settlements: ["Frostmere", "Snowfall"],
            landmark: "Highreach Hot Springs",
            gymId: "thermalis-gym"
        },
        {
            id: "greenvale",
            name: "Greenvale",
            majorCity: "Harveston",
            settlements: ["Millbrook", "Meadowfield", "Sunvale"],
            landmark: "The Great Windmill",
            gymId: "harveston-gym"
        },
        {
            id: "lume",
            name: "Lume",
            majorCity: "Lume Port",
            settlements: [],
            landmark: "Lume Port and the surrounding island environment",
            gymId: null
        },
        {
            id: "hawthorne",
            name: "Hawthorne",
            majorCity: "Lakecrest City",
            settlements: ["Stillwater", "Brookmere", "Riverside"],
            landmark: "Great Hawthorne Lake",
            gymId: "lakecrest-gym"
        },
        {
            id: "northvale",
            name: "Northvale",
            majorCity: "Northreach",
            settlements: ["Stonefall", "Rivermarch", "Frostbridge"],
            landmark: "The Cascading River",
            gymId: "northreach-gym"
        },
        {
            id: "eastmere",
            name: "Eastmere",
            majorCity: "Fairhaven",
            settlements: ["Seabrook", "Windmere"],
            landmark: null,
            gymId: "fairhaven-gym"
        },
        {
            id: "isen",
            name: "Isen",
            majorCity: "Winterhold",
            settlements: [],
            landmark: "The Frozen Expanse",
            gymId: null
        }
    ],

    gyms: [
        {
            id: "everhope-gym",
            name: "Everhope Gym",
            city: "Everhope City",
            region: "westmere",
            affinity: ["Gale"],
            crest: "Everhope Crest",
            rosterSize: 6,
            battleProgression: "adaptive",
            challengeOrder: "independent"
        },
        {
            id: "gullhaven-gym",
            name: "Gullhaven Gym",
            city: "Gullhaven",
            region: "seawick",
            affinity: ["Tide"],
            crest: "Gullhaven Crest",
            rosterSize: 6,
            battleProgression: "adaptive",
            challengeOrder: "independent"
        },
        {
            id: "thermalis-gym",
            name: "Thermalis Gym",
            city: "Thermalis",
            region: "highreach",
            affinity: ["Flame", "Stone"],
            crest: "Thermalis Crest",
            rosterSize: 6,
            battleProgression: "adaptive",
            challengeOrder: "independent"
        },
        {
            id: "harveston-gym",
            name: "Harveston Gym",
            city: "Harveston",
            region: "greenvale",
            affinity: ["Verdant"],
            crest: "Harveston Crest",
            rosterSize: 6,
            battleProgression: "adaptive",
            challengeOrder: "independent"
        },
        {
            id: "lakecrest-gym",
            name: "Lakecrest Gym",
            city: "Lakecrest City",
            region: "hawthorne",
            affinity: ["Volt"],
            crest: "Lakecrest Crest",
            rosterSize: 6,
            battleProgression: "adaptive",
            challengeOrder: "independent"
        },
        {
            id: "northreach-gym",
            name: "Northreach Gym",
            city: "Northreach",
            region: "northvale",
            affinity: ["Metal", "Frost"],
            crest: "Northreach Crest",
            rosterSize: 6,
            battleProgression: "adaptive",
            challengeOrder: "independent"
        },
        {
            id: "fairhaven-gym",
            name: "Fairhaven Gym",
            city: "Fairhaven",
            region: "eastmere",
            affinity: ["Mystic"],
            crest: "Fairhaven Crest",
            rosterSize: 6,
            battleProgression: "adaptive",
            challengeOrder: "independent"
        }
    ],

    landmarks: [
        { id: "great-tree", name: "The Great Tree", region: "westmere" },
        { id: "highreach-hot-springs", name: "Highreach Hot Springs", region: "highreach" },
        { id: "great-windmill", name: "The Great Windmill", region: "greenvale" },
        { id: "great-hawthorne-lake", name: "Great Hawthorne Lake", region: "hawthorne" },
        { id: "cascading-river", name: "The Cascading River", region: "northvale" },
        { id: "frozen-expanse", name: "The Frozen Expanse", region: "isen" },
        { id: "lume-port", name: "Lume Port", region: "lume" }
    ],

    transportation: {
        mainTrails: [],
        secondaryTrails: [],
        ferryRoutes: [
            { from: "lume-port", endpoint: null, status: "mapped-endpoint-to-be-linked" },
            { from: "lume-port", endpoint: null, status: "mapped-endpoint-to-be-linked" },
            { from: "lume-port", endpoint: null, status: "mapped-endpoint-to-be-linked" },
            { from: "lume-port", endpoint: null, status: "mapped-endpoint-to-be-linked" },
            { from: "lume-port", endpoint: null, status: "mapped-endpoint-to-be-linked" }
        ]
    },

    rules: {
        regionCount: 10,
        gymCount: 7,
        gymsAreIndependent: true,
        gymCrestCount: 7,
        gymLeaderRosterSize: 6,
        earlyGymSelection: "Gyms 1–5 select an appropriate subset from the established six-member roster.",
        lateGymSelection: "Gyms 6–7 use the complete six-member roster."
    }
};

// Expose the registry globally for the game and future map/editor systems.
window.KALEO_WORLD = KALEO_WORLD;
