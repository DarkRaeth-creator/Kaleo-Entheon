// ============================================================
// KALEO — WORLD OF ENTHEON
// Master World Registry / Route Graph
//
// This file is the authoritative WORLD-GRAPH layer for Kaleo.
// It defines locations and how the player travels between them.
//
// Important distinction:
//   LOCATION -> ROUTE -> LOCATION
//
// A route is a gameplay area and may eventually contain one or
// many actual map sections. This registry does NOT require every
// route to have its final map built yet.
// ============================================================

const KALEO_WORLD = {
    name: "Kaleo",

    // Approximate normalized positions on the supplied numbered world map.
    // These are presentation coordinates only; route connectivity remains
    // authoritative in the routes/ferryRoutes arrays below.
    mapPoints: {
        "settlement-1": { x: 32.7, y: 58.0 },
        "everhope-city": { x: 37.1, y: 50.7 },
        "settlement-2": { x: 35.9, y: 43.6 },
        "settlement-3": { x: 29.9, y: 43.0 },
        "settlement-4": { x: 24.1, y: 55.7 },
        "harveston-city": { x: 24.2, y: 60.9 },
        "settlement-5": { x: 32.4, y: 66.7 },
        "settlement-6": { x: 29.3, y: 76.8 },
        "settlement-7": { x: 41.3, y: 67.9 },
        "settlement-9": { x: 31.2, y: 37.0 },
        "settlement-10": { x: 23.7, y: 37.9 },
        "stonehaven-city": { x: 24.0, y: 28.8 },
        "settlement-11": { x: 17.8, y: 27.4 },
        "settlement-12": { x: 15.6, y: 41.2 },
        "gullhaven-city": { x: 12.0, y: 69.1 },
        "settlement-13": { x: 15.4, y: 79.9 },
        "settlement-14": { x: 25.6, y: 21.4 },
        "settlement-15": { x: 31.4, y: 16.7 },
        "thermalis-city": { x: 41.0, y: 29.9 },
        "settlement-16": { x: 37.7, y: 24.9 },
        "settlement-17": { x: 42.7, y: 19.2 },
        "settlement-18": { x: 51.2, y: 29.2 },
        "settlement-19": { x: 59.4, y: 28.2 },
        "winterhold-city": { x: 58.4, y: 20.7 },
        "northreach-city": { x: 68.7, y: 25.0 },
        "settlement-20": { x: 73.7, y: 32.8 },
        "lakecrest-city": { x: 81.7, y: 45.6 },
        "settlement-21": { x: 65.5, y: 48.0 },
        "settlement-22": { x: 59.2, y: 41.1 },
        "settlement-23": { x: 68.1, y: 54.2 },
        "settlement-24": { x: 68.3, y: 61.4 },
        "fairhaven-city": { x: 94.0, y: 53.5 },
        "settlement-25": { x: 81.1, y: 65.0 },
        "settlement-26": { x: 83.0, y: 39.9 },
        "lume-city": { x: 53.0, y: 51.0 },
        "highreach-hot-springs": { x: 35.8, y: 16.8 }
    },

    regions: [
        { id: "westmere", name: "Westmere", majorCity: "everhope-city", gymId: "everhope-gym", landmark: "great-tree" },
        { id: "greenvale", name: "Greenvale", majorCity: "harveston-city", gymId: "harveston-gym", landmark: "great-windmill" },
        { id: "dunridge", name: "Dunridge", majorCity: "stonehaven-city", gymId: null, landmark: null },
        { id: "seawick", name: "Seawick", majorCity: "gullhaven-city", gymId: "gullhaven-gym", landmark: null },
        { id: "highreach", name: "Highreach", majorCity: "thermalis-city", gymId: "thermalis-gym", landmark: "highreach-hot-springs" },
        { id: "northvale", name: "Northvale", majorCity: "northreach-city", gymId: "northreach-gym", landmark: "cascading-river" },
        { id: "isen", name: "Isen", majorCity: "winterhold-city", gymId: null, landmark: "frozen-expanse" },
        { id: "hawthorne", name: "Hawthorne", majorCity: "lakecrest-city", gymId: "lakecrest-gym", landmark: "great-hawthorne-lake" },
        { id: "eastmere", name: "Eastmere", majorCity: "fairhaven-city", gymId: "fairhaven-gym", landmark: null },
        { id: "lume", name: "Lume", majorCity: "lume-city", gymId: null, landmark: "lume-port" }
    ],

    // ========================================================
    // LOCATION NODES
    // ========================================================
    // Settlement 8 intentionally does not exist.
    locations: [
        // Westmere
        { id: "settlement-1", number: 1, region: "westmere", type: "settlement", name: "Settlement 1", mapId: "town" },
        { id: "everhope-city", region: "westmere", type: "major-city", name: "Everhope City", mapId: "everhope_city", gymId: "everhope-gym" },
        { id: "settlement-2", number: 2, region: "westmere", type: "settlement", name: "Settlement 2", mapId: "westmere_settlement2" },
        { id: "settlement-3", number: 3, region: "westmere", type: "settlement", name: "Settlement 3", mapId: "westmere_settlement3" },

        // Greenvale
        { id: "settlement-4", number: 4, region: "greenvale", type: "settlement", name: "Settlement 4", mapId: "greenvale_settlement4" },
        { id: "harveston-city", region: "greenvale", type: "major-city", name: "Harveston", mapId: "harveston_city", gymId: "harveston-gym" },
        { id: "settlement-5", number: 5, region: "greenvale", type: "settlement", name: "Settlement 5", mapId: "greenvale_settlement5" },
        { id: "settlement-6", number: 6, region: "greenvale", type: "settlement", name: "Settlement 6", mapId: "greenvale_settlement6" },
        { id: "settlement-7", number: 7, region: "greenvale", type: "settlement", name: "Settlement 7", mapId: "greenvale_settlement7", portTo: "lume-city" },

        // Dunridge
        { id: "settlement-9", number: 9, region: "dunridge", type: "settlement", name: "Settlement 9", mapId: "dunridge_settlement2" },
        { id: "settlement-10", number: 10, region: "dunridge", type: "settlement", name: "Settlement 10", mapId: "dunridge_settlement1" },
        { id: "stonehaven-city", region: "dunridge", type: "major-city", name: "Stonehaven", mapId: "stonehaven" },

        // Seawick
        { id: "settlement-11", number: 11, region: "seawick", type: "settlement", name: "Mullhaven", mapId: "seawick_settlement11" },
        { id: "settlement-12", number: 12, region: "seawick", type: "settlement", name: "Settlement 12", mapId: "seawick_settlement12" },
        { id: "gullhaven-city", region: "seawick", type: "major-city", name: "Gullhaven", mapId: "gullhaven_city", gymId: "gullhaven-gym" },
        { id: "settlement-13", number: 13, region: "seawick", type: "settlement", name: "Settlement 13", mapId: "seawick_settlement13" },

        // Highreach
        { id: "settlement-14", number: 14, region: "highreach", type: "settlement", name: "Settlement 14", mapId: "highreach_settlement1" },
        { id: "settlement-15", number: 15, region: "highreach", type: "settlement", name: "Settlement 15", mapId: "highreach_settlement2" },
        { id: "settlement-16", number: 16, region: "highreach", type: "settlement", name: "Settlement 16", mapId: "highreach_settlement3" },
        { id: "thermalis-city", region: "highreach", type: "major-city", name: "Thermalis", mapId: "thermalis_city", gymId: "thermalis-gym" },

        // Northvale
        { id: "settlement-17", number: 17, region: "northvale", type: "settlement", name: "Settlement 17", mapId: "northvale_settlement17" },
        { id: "settlement-18", number: 18, region: "northvale", type: "settlement", name: "Settlement 18", mapId: "northvale_settlement18", portTo: "lume-city" },
        { id: "settlement-19", number: 19, region: "northvale", type: "settlement", name: "Settlement 19", mapId: "northvale_settlement19" },
        { id: "northreach-city", region: "northvale", type: "major-city", name: "Northreach", mapId: "northreach_city", gymId: "northreach-gym" },

        // Isen
        { id: "winterhold-city", region: "isen", type: "major-city", name: "Winterhold", mapId: "winterhold_city" },

        // Hawthorne
        { id: "settlement-20", number: 20, region: "hawthorne", type: "settlement", name: "Settlement 20", mapId: "hawthorne_settlement20" },
        { id: "lakecrest-city", region: "hawthorne", type: "major-city", name: "Lakecrest City", mapId: "lakecrest_city", gymId: "lakecrest-gym" },
        { id: "settlement-21", number: 21, region: "hawthorne", type: "settlement", name: "Settlement 21", mapId: "hawthorne_settlement21" },
        { id: "settlement-22", number: 22, region: "hawthorne", type: "settlement", name: "Settlement 22", mapId: "hawthorne_settlement22", portTo: "lume-city" },
        { id: "settlement-23", number: 23, region: "hawthorne", type: "settlement", name: "Settlement 23", mapId: "hawthorne_settlement23" },

        // Eastmere
        { id: "settlement-26", number: 26, region: "eastmere", type: "settlement", name: "Settlement 26", mapId: "eastmere_settlement26" },
        { id: "fairhaven-city", region: "eastmere", type: "major-city", name: "Fairhaven", mapId: "fairhaven_city", gymId: "fairhaven-gym" },
        { id: "settlement-25", number: 25, region: "eastmere", type: "settlement", name: "Settlement 25", mapId: "eastmere_settlement25" },
        { id: "settlement-24", number: 24, region: "eastmere", type: "settlement", name: "Settlement 24", mapId: "eastmere_settlement24", portTo: "lume-city" },

        // Lume
        { id: "lume-city", region: "lume", type: "major-city", name: "Lume", mapId: "lume_city" }
    ],

    // ========================================================
    // LANDMARK NODES
    // ========================================================
    landmarks: [
        { id: "great-tree", name: "The Great Tree", region: "westmere" },
        { id: "great-windmill", name: "The Great Windmill", region: "greenvale" },
        { id: "highreach-hot-springs", name: null, displayLabel: "Hot Springs", region: "highreach" },
        { id: "cascading-river", name: "The Cascading River", region: "northvale" },
        { id: "great-hawthorne-lake", name: "Great Hawthorne Lake", region: "hawthorne" },
        { id: "frozen-expanse", name: "The Frozen Expanse", region: "isen" },
        { id: "lume-port", name: "Lume Port", region: "lume" }
    ],

    // ========================================================
    // ROUTES
    // ========================================================
    // Every entry represents LOCATION -> ROUTE -> LOCATION.
    // mapId is the future playable route map identifier. A null mapId
    // means the connection is established in the world graph but its
    // playable map has not been built yet.
    //
    // mapSections is intentionally empty until a route is physically
    // built. A route can later contain one or many map sections.
    routes: [
        // Westmere main progression
        { id: "route-1-everhope", from: "settlement-1", to: "everhope-city", direction: "north", reverseDirection: "south", kind: "main-trail", mapId: "route_south_everhope", mapSections: [] },
        { id: "route-everhope-2", from: "everhope-city", to: "settlement-2", direction: "northwest", reverseDirection: "southeast", kind: "main-trail", mapId: "route_everhope_settlement2", mapSections: [] },
        { id: "route-2-3", from: "settlement-2", to: "settlement-3", direction: "west", reverseDirection: "east", kind: "main-trail", mapId: "route_settlement2_settlement3", mapSections: [] },

        // Westmere branch into Greenvale
        { id: "route-3-4", from: "settlement-3", to: "settlement-4", direction: "southwest", reverseDirection: "northeast", kind: "secondary-trail", mapId: "route_settlement3_greenvale", mapSections: ["route_settlement3_greenvale"] },
        { id: "route-4-harveston", from: "settlement-4", to: "harveston-city", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_4_harveston", mapSections: [] },
        { id: "route-harveston-5", from: "harveston-city", to: "settlement-5", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_harveston_5", mapSections: [] },
        { id: "route-5-6", from: "settlement-5", to: "settlement-6", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_5_6", mapSections: [] },
        { id: "route-6-7", from: "settlement-6", to: "settlement-7", direction: "southeast", reverseDirection: "northwest", kind: "main-trail", mapId: "route_6_7", mapSections: [] },

        // Westmere -> Dunridge
        { id: "route-3-9", from: "settlement-3", to: "settlement-9", direction: "northeast", reverseDirection: "southwest", kind: "main-trail", mapId: "route_westmere_dunridge", mapSections: [] },
        { id: "route-9-10", from: "settlement-9", to: "settlement-10", direction: "west", reverseDirection: "east", kind: "main-trail", mapId: "route_dunridge_settlement2_stonehaven", mapSections: [] },
        { id: "route-10-stonehaven", from: "settlement-10", to: "stonehaven-city", direction: "north", reverseDirection: "south", kind: "main-trail", mapId: "route_dunridge_settlement1_stonehaven", mapSections: [] },

        // Stonehaven -> Seawick
        { id: "route-stonehaven-11", from: "stonehaven-city", to: "settlement-11", direction: "northwest", reverseDirection: "southeast", kind: "main-trail", mapId: "route_stonehaven_seawick", mapSections: ["route_stonehaven_seawick"] },
        { id: "route-11-12", from: "settlement-11", to: "settlement-12", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_11_12", mapSections: ["route_11_12"] },
        { id: "route-12-gullhaven", from: "settlement-12", to: "gullhaven-city", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_12_gullhaven", mapSections: ["route_12_gullhaven"] },
        { id: "route-gullhaven-13", from: "gullhaven-city", to: "settlement-13", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_gullhaven_13", mapSections: [] },

        // Stonehaven -> Highreach
        { id: "route-stonehaven-14", from: "stonehaven-city", to: "settlement-14", direction: "northeast", reverseDirection: "southwest", kind: "main-trail", mapId: "route_stonehaven_highreach", mapSections: [] },
        { id: "route-14-15", from: "settlement-14", to: "settlement-15", direction: "northeast", reverseDirection: "southwest", kind: "main-trail", mapId: "route_highreach_settlement1_2", mapSections: [] },
        { id: "route-15-16", from: "settlement-15", to: "settlement-16", direction: "southeast", reverseDirection: "northwest", kind: "main-trail", mapId: "route_highreach_15_16", mapSections: ["route_highreach_15_16"] },

        // Highreach branch to hot springs
        { id: "route-15-hot-springs", from: "settlement-15", to: "highreach-hot-springs", direction: "north", reverseDirection: "south", kind: "secondary-trail", mapId: "route_15_hot_springs", mapSections: ["route_15_hot_springs"] },

        // Highreach -> Thermalis / Northvale
        { id: "route-16-thermalis", from: "settlement-16", to: "thermalis-city", direction: "southeast", reverseDirection: "northwest", kind: "main-trail", mapId: "route_highreach_16_thermalis", mapSections: ["route_highreach_16_thermalis"] },
        { id: "route-16-17", from: "settlement-16", to: "settlement-17", direction: "northeast", reverseDirection: "southwest", kind: "main-trail", mapId: "route_highreach_16_17", mapSections: ["route_highreach_16_17"] },

        // Northvale
        { id: "route-17-18", from: "settlement-17", to: "settlement-18", direction: "southeast", reverseDirection: "northwest", kind: "main-trail", mapId: "route_17_18", mapSections: ["route_17_18"] },
        { id: "route-18-19", from: "settlement-18", to: "settlement-19", direction: "east", reverseDirection: "west", kind: "main-trail", mapId: "route_18_19", mapSections: ["route_18_19"] },
        { id: "route-19-northreach", from: "settlement-19", to: "northreach-city", direction: "southeast", reverseDirection: "northwest", kind: "main-trail", mapId: "route_19_northreach", mapSections: ["route_19_northreach"] },
        { id: "route-19-winterhold", from: "settlement-19", to: "winterhold-city", direction: "northwest", reverseDirection: "southeast", kind: "secondary-trail", mapId: "route_19_winterhold", mapSections: ["route_19_winterhold"] },
        { id: "route-northreach-20", from: "northreach-city", to: "settlement-20", direction: "southeast", reverseDirection: "northwest", kind: "main-trail", mapId: "route_northreach_20", mapSections: [] },

        // Hawthorne
        { id: "route-20-lakecrest", from: "settlement-20", to: "lakecrest-city", direction: "southwest", reverseDirection: "northeast", kind: "main-trail", mapId: "route_20_lakecrest", mapSections: [] },
        { id: "route-lakecrest-21", from: "lakecrest-city", to: "settlement-21", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_lakecrest_21", mapSections: [] },
        { id: "route-21-22", from: "settlement-21", to: "settlement-22", direction: "northwest", reverseDirection: "southeast", kind: "secondary-trail", mapId: "route_21_22", mapSections: [] },
        { id: "route-21-23", from: "settlement-21", to: "settlement-23", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_21_23", mapSections: [] },

        // Lakecrest -> Eastmere branch
        { id: "route-lakecrest-26", from: "lakecrest-city", to: "settlement-26", direction: "northeast", reverseDirection: "southwest", kind: "main-trail", mapId: "route_lakecrest_26", mapSections: [] },
        { id: "route-26-fairhaven", from: "settlement-26", to: "fairhaven-city", direction: "southeast", reverseDirection: "northwest", kind: "main-trail", mapId: "route_26_fairhaven", mapSections: [] },
        { id: "route-fairhaven-25", from: "fairhaven-city", to: "settlement-25", direction: "south", reverseDirection: "north", kind: "main-trail", mapId: "route_fairhaven_25", mapSections: [] },
        { id: "route-fairhaven-24", from: "fairhaven-city", to: "settlement-24", direction: "southwest", reverseDirection: "northeast", kind: "main-trail", mapId: "route_fairhaven_24", mapSections: [] },
        { id: "route-24-23", from: "settlement-24", to: "settlement-23", direction: "northwest", reverseDirection: "southeast", kind: "secondary-trail", mapId: "route_24_23", mapSections: [] }
    ],

    // ========================================================
    // FERRY NETWORK
    // ========================================================
    // These are separate from overland routes. Each numbered port
    // connects to Lume.
    ferryRoutes: [
        { id: "ferry-2-lume", from: "settlement-2", direction: "southeast", to: "lume-city" },
        { id: "ferry-7-lume", from: "settlement-7", direction: "northeast", to: "lume-city" },
        { id: "ferry-18-lume", from: "settlement-18", direction: "south", to: "lume-city" },
        { id: "ferry-22-lume", from: "settlement-22", direction: "southwest", to: "lume-city" },
        { id: "ferry-24-lume", from: "settlement-24", direction: "northwest", to: "lume-city" }
    ],

    // ========================================================
    // GYMS
    // ========================================================
    gyms: [
        { id: "everhope-gym", name: "Everhope Gym", city: "Everhope City", region: "westmere", affinity: ["Gale"] },
        { id: "harveston-gym", name: "Harveston Gym", city: "Harveston", region: "greenvale", affinity: ["Verdant"] },
        { id: "gullhaven-gym", name: "Gullhaven Gym", city: "Gullhaven", region: "seawick", affinity: ["Tide"] },
        { id: "thermalis-gym", name: "Thermalis Gym", city: "Thermalis", region: "highreach", affinity: ["Flame", "Stone"] },
        { id: "northreach-gym", name: "Northreach Gym", city: "Northreach", region: "northvale", affinity: ["Metal", "Frost"] },
        { id: "lakecrest-gym", name: "Lakecrest Gym", city: "Lakecrest City", region: "hawthorne", affinity: ["Volt"] },
        { id: "fairhaven-gym", name: "Fairhaven Gym", city: "Fairhaven", region: "eastmere", affinity: ["Mystic"] }
    ],

    rules: {
        regionCount: 10,
        gymCount: 7,
        settlementNumbering: "1–7, 9–26; Settlement 8 does not exist.",
        routeModel: "location-route-location",
        routeCanContainMultipleMapSections: true,
        directionalRoutes: true,
        directionModel: "Routes use compass directions from the source location to the destination; reverseDirection is the destination-side approach.",
        gymsAreIndependent: true
    }
};

// Convenience helpers for future map/route systems.
KALEO_WORLD.getLocation = function (id) {
    return this.locations.find(location => location.id === id) || null;
};

KALEO_WORLD.getRoutesFrom = function (locationId) {
    return this.routes.filter(route => route.from === locationId || route.to === locationId);
};

KALEO_WORLD.getFerriesFrom = function (locationId) {
    return this.ferryRoutes.filter(route => route.from === locationId || route.to === locationId);
};

window.KALEO_WORLD = KALEO_WORLD;
