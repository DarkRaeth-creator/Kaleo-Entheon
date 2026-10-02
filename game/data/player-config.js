/*
 * KALEO — Player Visual Configuration
 *
 * The renderer is intentionally asset-layout agnostic. Preferred production
 * sheets are 256×96 (four 64×96 frames), while the old 128×48 prototype
 * sheets remain readable for backwards compatibility.
 *
 * Runtime resolution order:
 * 1. Combined character sheet (preferred).
 * 2. Direction/outfit or direction-only sheet.
 * 3. Layered base + outfit + hair + eyes sheets.
 *
 * Every sheet is a four-frame horizontal animation.
 */
window.KALEO_PLAYER_CONFIG = {
    assetRoot: "../images/player",
    productionFrame: { width: 64, height: 96 },
    // World display is independent from source artwork resolution.
    // The current 32px tile world displays the 64×96 source frame at 48×72.
    worldFrame: { width: 48, height: 72, footOffset: 4 },
    directions: ["down", "left", "right", "up"],

    male: {
        label: "Male",
        default: { hair: "blond", eyes: "amber", outfit: "default" },
        hair: [
            { id: "blond", label: "Blond" },
            { id: "brown", label: "Brown" },
            { id: "black", label: "Black" },
            { id: "red", label: "Red" },
            { id: "white", label: "White / Silver" }
        ],
        eyes: [
            { id: "amber", label: "Amber" },
            { id: "blue", label: "Blue" },
            { id: "green", label: "Green" },
            { id: "brown", label: "Brown" },
            { id: "grey", label: "Grey" }
        ],
        outfits: [
            { id: "default", label: "Default" },
            { id: "casual", label: "Casual" },
            { id: "academy", label: "Academy" },
            { id: "explorer", label: "Explorer" },
            { id: "jacket", label: "Jacket" }
        ]
    },

    female: {
        label: "Female",
        default: { hair: "brown", eyes: "brown", outfit: "default" },
        hair: [
            { id: "brown", label: "Brown" },
            { id: "blonde", label: "Blonde" },
            { id: "black", label: "Black" },
            { id: "red", label: "Red" },
            { id: "auburn", label: "Auburn" }
        ],
        eyes: [
            { id: "brown", label: "Brown" },
            { id: "blue", label: "Blue" },
            { id: "green", label: "Green" },
            { id: "hazel", label: "Hazel" },
            { id: "grey", label: "Grey" }
        ],
        outfits: [
            { id: "default", label: "Default" },
            { id: "casual", label: "Casual" },
            { id: "academy", label: "Academy" },
            { id: "explorer", label: "Explorer" },
            { id: "dress", label: "Dress" }
        ]
    }
};
