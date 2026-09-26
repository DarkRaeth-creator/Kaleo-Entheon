// ============================================================
// KALEO — ENTHEON DATA
// Canonical species data used by the game.
// ============================================================

const ENTHEON = {

    nimblet: {
        id: 1,
        name: "Nimblet",
        affinity: ["Wild"],
        rarity: "Common",

        evolution: {
            line: ["Nimblet", "Nymbril", "Nymbrake"],
            stage: 1
        },

        size: {
            height: 0.45,
            length: 0.75,
            class: "Small"
        },

        concept: "Small monkey-like creature.",

        appearance: [
            "Small, compact primate body.",
            "Short muzzle and rounded ears.",
            "Expressive eyes and an inquisitive face.",
            "Long arms and legs suited for climbing and rapid movement.",
            "A long, flexible, partially prehensile tail.",
            "Small hands and feet with dexterous fingers and toes.",
            "Soft, short fur.",
            "Earthy, natural coloration."
        ],

        behavior: [
            "Curious, energetic and highly inquisitive.",
            "Constantly investigates unfamiliar objects and environments.",
            "Playful and prone to climbing anything it can reach.",
            "Can be mischievous without being malicious.",
            "Highly adaptable and quick to learn from its surroundings."
        ],

        combatIdentity:
            "Fast, evasive and unpredictable. Uses rapid strikes, jumps and acrobatic movement. Prefers mobility and positioning over direct confrontation.",

        specialAbility: {
            name: "Improvised Instinct",
            description:
                "Nimblet instinctively exploits its surroundings when threatened. Terrain, nearby objects and positioning can influence how effectively it evades or responds to an attack."
        },

        starter: true
    },


    pipiri: {
        id: 4,
        name: "Pipiri",
        affinity: ["Tide"],
        rarity: "Common",

        evolution: {
            line: ["Pipiri", "Pirello", "Piravelle"],
            stage: 1
        },

        size: {
            height: 0.30,
            length: 0.55,
            class: "Small"
        },

        concept: "Small axolotl-like amphibious creature.",

        appearance: [
            "Small, rounded amphibious body.",
            "Four short legs.",
            "Broad, soft tail designed for swimming.",
            "Prominent external feathery gills on either side of the head.",
            "Large expressive eyes.",
            "Small rounded mouth.",
            "Smooth, slightly rubbery-looking skin.",
            "Small fin-like ridges along parts of the back.",
            "Compact, cute proportions.",
            "Clearly aquatic and amphibious rather than resembling a conventional fish."
        ],

        coloration: [
            "Soft pink or coral base.",
            "Blue or teal accents.",
            "Pale markings around the face and gills."
        ],

        behavior: [
            "Curious and friendly.",
            "Comfortable around both people and other creatures.",
            "Loves water and frequently spends long periods swimming.",
            "Can be somewhat timid when first encountering unfamiliar environments.",
            "Becomes playful and energetic once comfortable."
        ],

        combatIdentity:
            "Beginner-friendly aquatic fighter. Uses water-based attacks and evasive swimming. More defensive and adaptable than aggressive.",

        specialAbility: {
            name: "Hydrokinetic Recovery",
            description:
                "Pipiri can draw upon surrounding moisture to restore a small amount of vitality after successfully using Tide techniques."
        },

        starter: true
    },


    morrowe: {
        id: 7,
        name: "Morrowe",
        affinity: ["Umbral"],
        rarity: "Common",

        evolution: {
            line: ["Morrowe", "Morveth", "Morvayne"],
            stage: 1
        },

        size: {
            height: 0.40,
            length: 0.75,
            class: "Small"
        },

        concept: "Small dark-coated foxlike nocturnal creature.",

        appearance: [
            "Small quadrupedal body.",
            "Foxlike silhouette without being a direct fox copy.",
            "Dark coat.",
            "Large expressive eyes.",
            "Pointed ears.",
            "Soft, full tail.",
            "Compact paws.",
            "Subtle markings that become more visible in low light.",
            "Cute but mysterious overall appearance."
        ],

        behavior: [
            "Quiet and observant.",
            "More cautious around strangers than Pipiri or Nimblet.",
            "Highly curious but prefers watching from a safe distance.",
            "Most active around dusk and nighttime.",
            "Forms strong bonds with trusted companions.",
            "Can be mischievous when comfortable."
        ],

        combatIdentity:
            "Fast, evasive and stealth-oriented. Uses darkness and positioning. Relies on surprise attacks rather than brute strength.",

        specialAbility: {
            name: "Veiled Presence",
            description:
                "Morrowe becomes difficult to detect when it remains still or moves through darkness."
        },

        starter: true
    }

};


// Convenient list containing the available starter species.
const STARTER_ENTHEON = [
    ENTHEON.nimblet,
    ENTHEON.pipiri,
    ENTHEON.morrowe
];
