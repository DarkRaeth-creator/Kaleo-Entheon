// ============================================================
// KALEO – WORLD OF ENTHEON
// Step 5: Capture System + Party Foundation
// ============================================================


// ------------------------------------------------------------
// BATTLE STATE
// ------------------------------------------------------------

const gameState = {
    mode: "intro",
    currentScene: "welcome",
    playerName: "",
    gender: null,
    starter: null,
    starterAvailable: false,
    starterData: null,
    party: [],
    activePartyIndex: 0,
    selectedPartyIndex: 0,
    captureDevices: 5,
    vale: 1500,
    crystals: {
        capture: { id: "capture", name: "Capture Crystal", grade: "Capture", quantity: 5 }
    },
    items: {
        recoveryTonic: { id: "recoveryTonic", name: "Recovery Tonic", description: "Restores 25 HP to one Entheon.", quantity: 3, kind: "heal", amount: 25 },
        revivalTonic: { id: "revivalTonic", name: "Revival Tonic", description: "Revives a fainted Entheon at 50% of its maximum HP.", quantity: 1, kind: "revive", amount: 0.5 }
    },
    shop: {
        merchantId: "travelling-merchant",
        stock: {
            recoveryTonic: { id: "recoveryTonic", name: "Recovery Tonic", description: "Restores 25 HP to one Entheon.", price: 100 },
            revivalTonic: { id: "revivalTonic", name: "Revival Tonic", description: "Revives a fainted Entheon at 50% of its maximum HP.", price: 300 },
            capture: { id: "capture", name: "Capture Crystal", description: "Standard crystal used for Entheon resonance and capture.", price: 150 }
        }
    },
    pendingItemId: null,
    partyScreenBattleMode: false,
    partyScreenForced: false,
    activeDialogue: null,
    dialogueIndex: 0,
    currentMap: "town",
    transitionCooldown: 0,
    encounterCooldown: 0,
    battle: null,
    trainerBattle: null,
    evolutionPromptOpen: false
};


// ============================================================
// SCREEN ELEMENTS
// ============================================================

const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const optionsContainer = document.getElementById("options");

const introScreen = document.getElementById("intro-screen");
const overworldScreen = document.getElementById("overworld-screen");
const starterStatus = document.getElementById("starter-status");
const areaStatus = document.getElementById("area-status");
const worldMessage = document.getElementById("world-message");

const npcDialogue = document.getElementById("npc-dialogue");
const npcDialogueName = document.getElementById("npc-dialogue-name");
const npcDialogueText = document.getElementById("npc-dialogue-text");

const battleScreen = document.getElementById("battle-screen");

const partyPanel = document.getElementById("party-panel");
const partyList = document.getElementById("party-list");
const partyButton = document.getElementById("party-button");
const partyScreen = document.getElementById("party-screen");
const partyCloseButton = document.getElementById("party-close-button");
const partyScreenList = document.getElementById("party-screen-list");
const partyDetail = document.getElementById("party-detail");
const crystalScreen = document.getElementById("crystal-screen");
const crystalList = document.getElementById("crystal-list");
const crystalCloseButton = document.getElementById("crystal-close-button");
const inventoryScreen = document.getElementById("inventory-screen");
const inventoryList = document.getElementById("inventory-list");
const inventoryCloseButton = document.getElementById("inventory-close-button");
const inventoryTarget = document.getElementById("inventory-target");
const shopScreen = document.getElementById("shop-screen");
const shopList = document.getElementById("shop-list");
const shopVale = document.getElementById("shop-vale");
const shopCloseButton = document.getElementById("shop-close-button");
function setCaptureStatus(text) {
    const battleArea =
        document.getElementById("battle-screen") ||
        document.querySelector(".battle-screen") ||
        document.getElementById("game-screen") ||
        document.querySelector(".game-screen");

    if (!battleArea) return;

    let overlay = document.getElementById("capture-status-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "capture-status-overlay";
        overlay.className = "capture-status-overlay";
        battleArea.appendChild(overlay);
    }
    overlay.textContent = text;
    overlay.classList.remove("hidden");
}

function clearCaptureStatus() {
    const overlay = document.getElementById("capture-status-overlay");
    if (overlay) overlay.remove();
}

const captureEffect = document.getElementById("capture-effect");
const battleCreatureVisual = document.getElementById("battle-creature-visual");


// ============================================================
// INTRO SCENE SYSTEM
// ============================================================

function showScene(title, text, options = []) {
    sceneTitle.textContent = title;
    sceneText.innerHTML = text;
    optionsContainer.innerHTML = "";

    options.forEach(option => {
        const button = document.createElement("button");

        button.className = "option-button";
        button.textContent = option.text;
        button.addEventListener("click", option.action);

        optionsContainer.appendChild(button);
    });
}

function showOpening() {
    showCharacterChoice();
}

function showCharacterChoice() {
    gameState.currentScene = "character-choice";

    showScene(
        "Choose Your Character",
        `
        <p>Before your journey begins, decide who you will be in Kaleo.</p>
        <p>Your choice changes your trainer's appearance in the overworld.</p>
        `,
        [
            { text: "Boy", action: () => chooseGender("boy") },
            { text: "Girl", action: () => chooseGender("girl") }
        ]
    );
}

function chooseGender(gender) {
    gameState.gender = gender;
    showNameEntry();
}

function showNameEntry() {
    gameState.currentScene = "name-entry";

    sceneTitle.textContent = "What's Your Name?";
    sceneText.innerHTML = `
        <p>What should people call you in Kaleo?</p>
        <input id="player-name-input" class="name-input" maxlength="12" autocomplete="off" placeholder="Enter your name">
    `;
    optionsContainer.innerHTML = "";

    const input = document.getElementById("player-name-input");
    const button = document.createElement("button");
    button.className = "option-button";
    button.textContent = "Confirm Name";
    button.addEventListener("click", confirmPlayerName);
    optionsContainer.appendChild(button);

    input.focus();
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") confirmPlayerName();
    });
}

function confirmPlayerName() {
    const input = document.getElementById("player-name-input");
    const name = input ? input.value.trim() : "";

    if (!name) {
        input?.focus();
        return;
    }

    gameState.playerName = name;
    startOverworld();
}

function showArrival() {
    startOverworld();
}

function showResearchCenter() {
    startOverworld();
}

function showStarterIntroduction() {
    startOverworld();
}

function showStarterSelection() {
    gameState.currentScene = "starter-selection";

    showScene(
        "Choose Your First Entheon",
        `
        <p>
        Three young Entheon have been selected as potential companions.
        </p>
        <p>
        Take your time. You can examine each one before making your decision.
        </p>
        `,
        [
            { text: "Nimblet", action: () => showStarter("Nimblet") },
            { text: "Pipiri", action: () => showStarter("Pipiri") },
            { text: "Morrowe", action: () => showStarter("Morrowe") }
        ]
    );
}

function showStarter(name) {
    gameState.currentScene = "starter-" + name.toLowerCase();

    showScene(
        name,
        `
        <p>You approach <strong>${name}</strong>.</p>
        <p>You take a moment to observe the young Entheon carefully.</p>
        <p>
        More detailed species information will be connected to the
        game data as development continues.
        </p>
        `,
        [
            {
                text: "Choose " + name,
                action: () => chooseStarter(name)
            },
            {
                text: "Look at the other starters",
                action: showStarterSelection
            }
        ]
    );
}

function chooseStarter(name) {
    if (gameState.currentMap !== "research_center") return;

    gameState.starter = name;

    const speciesData = speciesBattleData[name];
    if (!speciesData) {
        console.error("No battle data exists for starter:", name);
        return;
    }

    // Create the chosen starter as a persistent creature object. Its
    // statistics, XP and moves now belong to the individual Entheon.
    const starterCreature = createCreature(name, speciesData.level);
    gameState.starterData = starterCreature;
    gameState.party = [starterCreature];

    gameState.activePartyIndex = 0;
    gameState.selectedPartyIndex = 0;

    starterStatus.textContent = "Starter: " + name;
    renderParty();

    const starterNpc = currentMap.npcs.find(npc => npc.type === "starter" && npc.species === name);
    if (starterNpc) starterNpc.chosen = true;

    // The chosen starter is removed from the research-center world state.
    // The other two remain available as world characters until we decide how
    // the permanent research-center presentation should work.

    openNpcDialogue({
        id: "starter-choice",
        type: "message",
        name: name,
        lines: [
            `${name} is now your partner.`,
            `You received ${name}! Your journey through Kaleo can begin.`
        ]
    });
}



// ============================================================
// MAP DATA
// ============================================================

const TILE_SIZE = 32;

const TILE = {
    GRASS: ".",
    TREE: "T",
    WATER: "W",
    PATH: "G",
    WALL: "#",
    DOOR: "D",
    TALL_GRASS: "V"
};

const maps = {
    town: {
        name: "Westmere — Southern Settlement",
        data: [
            "####################D####################",
            "#......................................#",
            "#......................................#",
            "#..TT..............GGGG...............#",
            "#..TT..............GGGG...............#",
            "#.................GGGG................#",
            "#.................GGGG................#",
            "#.............####D....................#",
            "#.............#...#...................#",
            "#.............#...#...................#",
            "#.............#####...................#",
            "#....VVVVVV............................#",
            "#....VVVVVV............................#",
            "#....WWWW..............................#",
            "#....WWWW..............................#",
            "#....WWWW..............TT.............#",
            "#......................TT.............#",
            "#......................................#",
            "#................GGGG....VVVVVV........#",
            "#................GGGG....VVVVVV........#",
            "#................GGGG..................#",
            "#......................................#",
            "#......................TT.............#",
            "#......................TT.............#",
            "#......................................#",
            "#..........GGGG........................#",
            "#..........GGGG........................#",
            "#......................................#",
            "#......................................#",
            "########################################"
        ],
        spawn: { x: 4, y: 25 },
        exit: null,
        // World skeleton connection: the southern Westmere settlement
        // connects northward to the route leading to Everhope City.
        exits: [
            { x: 20, y: 0, targetMap: "route_south_everhope", targetX: 14.5, targetY: 15.5, message: "You leave the southern Westmere settlement and follow the Main Trail toward Everhope City." },
            { x: 14, y: 7, targetMap: "research_center", targetX: 10.5, targetY: 9.5, message: "You enter the Entheon Research Center." }
        ],
        // Temporary encounter probabilities for the current starting area.
        // Species eligibility comes from Westmere's canonical regional list;
        // the exact habitat tables will be expanded as individual routes are built.
        encounters: [
            { species: "Nimblet", minLevel: 2, maxLevel: 3, weight: 2 },
            { species: "Brindlew", minLevel: 2, maxLevel: 3, weight: 98 }
        ],
        npcs: [
            {
                id: "trainer",
                type: "trainer",
                interaction: "trainer",
                name: "Young Trainer",
                x: 22,
                y: 12,
                color: "#d26b6b",
                lines: [
                    "Hey! You're a new trainer too, right?",
                    "I've been exploring the area around town.",
                    "Let's see how your Entheon handles a real trainer battle!"
                ],
                battle: {
                    reward: 120,
                    team: [
                        { species: "Orrin", level: 3 },
                        { species: "Brindlew", level: 4 }
                    ],
                    victory: "Not bad! I'll have to train harder next time.",
                    defeat: "Looks like I need a lot more practice..."
                }
            },
            {
                id: "resident",
                type: "npc",
                interaction: "dialogue",
                name: "Kaleo Resident",
                x: 27,
                y: 21,
                color: "#6b9ed2",
                lines: [
                    "The paths around Kaleo connect to places far beyond this area.",
                    "You should talk to people whenever you visit a new settlement.",
                    "You never know what you might learn."
                ]
            },
            {
                id: "restoration-attendant",
                type: "restoration",
                interaction: "restoration",
                name: "Restoration Attendant",
                x: 31,
                y: 24,
                color: "#69a9a0",
                lines: [
                    "Welcome to the Restoration Hub.",
                    "We can restore your Entheon to full health."
                ]
            },
            {
                id: "travelling-merchant",
                type: "merchant",
                interaction: "merchant",
                name: "Travelling Merchant",
                x: 34,
                y: 10,
                color: "#b88a52",
                lines: [
                    "Oh! A customer! Funny, I was just about to leave.",
                    "I travel wherever trainers need supplies. Somehow, I always arrive at exactly the right place.",
                    "I sell the essentials every travelling Trainer needs."
                ],
                shop: {
                    inventory: ["recoveryTonic", "revivalTonic", "capture"]
                }
            }
        ]
    },

    route_south_everhope: {
        name: "Westmere — Main Trail to Everhope City",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "town", targetX: 20.5, targetY: 1.5, message: "You return to the southern Westmere settlement." },
            { x: 14, y: 0, targetMap: "everhope_city", targetX: 14.5, targetY: 15.5, message: "The Main Trail brings you to Everhope City." }
        ],
        encounters: []
    },

    everhope_city: {
        name: "Everhope City",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "route_south_everhope", targetX: 14.5, targetY: 1.5, message: "You head back toward the southern Westmere settlement." },
            { x: 14, y: 0, targetMap: "route_everhope_settlement2", targetX: 14.5, targetY: 15.5, message: "You leave Everhope City along the Main Trail." }
        ],
        encounters: [],
        npcs: []
    },

    route_everhope_settlement2: {
        name: "Westmere — Main Trail to Settlement 2",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "everhope_city", targetX: 14.5, targetY: 1.5, message: "You return to Everhope City." },
            { x: 14, y: 0, targetMap: "westmere_settlement2", targetX: 14.5, targetY: 15.5, message: "You arrive at Settlement 2 in Westmere." }
        ],
        encounters: []
    },

    westmere_settlement2: {
        name: "Westmere — Settlement 2",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "route_everhope_settlement2", targetX: 14.5, targetY: 1.5, message: "You return toward Everhope City." },
            { x: 14, y: 0, targetMap: "route_settlement2_settlement3", targetX: 14.5, targetY: 15.5, message: "You leave Settlement 2 along the Main Trail." }
        ],
        encounters: [],
        npcs: []
    },

    route_settlement2_settlement3: {
        name: "Westmere — Main Trail to Settlement 3",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "westmere_settlement2", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 2." },
            { x: 14, y: 0, targetMap: "westmere_settlement3", targetX: 14.5, targetY: 15.5, message: "You arrive at Settlement 3 in Westmere." }
        ],
        encounters: []
    },

    westmere_settlement3: {
        name: "Westmere — Settlement 3",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "route_settlement2_settlement3", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 2." }
        ],
        encounters: [],
        npcs: []
    },

    route_westmere_dunridge: {
        name: "Dunridge — Main Trail",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 0, targetMap: "dunridge_settlement2", targetX: 14.5, targetY: 15.5, message: "You arrive at a Dunridge settlement." },
            { x: 14, y: 16, targetMap: "westmere_settlement3", targetX: 14.5, targetY: 1.5, message: "You return toward Westmere." }
        ],
        encounters: []
    },

    dunridge_settlement2: {
        name: "Dunridge — Settlement 2",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#....GGGG....................#",
            "#....GGGG....................#",
            "#....GGGG....................#",
            "#....GGGG....................#",
            "#............................#",
            "#........TT..................#",
            "#........TT..................#",
            "#............................#",
            "#..............VVVV..........#",
            "#..............VVVV..........#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 0, targetMap: "route_dunridge_settlement2_stonehaven", targetX: 14.5, targetY: 15.5, message: "The Main Trail continues toward Stonehaven." },
            { x: 14, y: 16, targetMap: "route_westmere_dunridge", targetX: 14.5, targetY: 1.5, message: "You return toward Westmere." }
        ],
        encounters: []
    },

    route_dunridge_settlement2_stonehaven: {
        name: "Dunridge — Main Trail",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 0, targetMap: "dunridge_settlement1", targetX: 14.5, targetY: 15.5, message: "You arrive at another Dunridge settlement." },
            { x: 14, y: 16, targetMap: "dunridge_settlement2", targetX: 14.5, targetY: 1.5, message: "You return to the eastern Dunridge settlement." }
        ],
        encounters: []
    },

    dunridge_settlement1: {
        name: "Dunridge — Southwestern Settlement",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#....GGGG....................#",
            "#....GGGG....................#",
            "#....GGGG....................#",
            "#....GGGG....................#",
            "#............................#",
            "#........TT..................#",
            "#........TT..................#",
            "#............................#",
            "#..............VVVV..........#",
            "#..............VVVV..........#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 0, targetMap: "route_dunridge_settlement1_stonehaven", targetX: 14.5, targetY: 15.5, message: "The trail continues north toward Stonehaven." },
            { x: 14, y: 16, targetMap: "route_dunridge_settlement2_stonehaven", targetX: 14.5, targetY: 1.5, message: "You return to the eastern Dunridge settlement." }
        ],
        encounters: []
    },

    route_dunridge_settlement1_stonehaven: {
        name: "Dunridge — Trail to Stonehaven",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 0, targetMap: "stonehaven", targetX: 14.5, targetY: 15.5, message: "You arrive at Stonehaven." },
            { x: 14, y: 16, targetMap: "dunridge_settlement1", targetX: 14.5, targetY: 1.5, message: "You return to the southwestern Dunridge settlement." }
        ],
        encounters: []
    },

    stonehaven: {
        name: "Stonehaven",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#....TT......................#",
            "#....TT......................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "route_dunridge_settlement2_stonehaven", targetX: 14.5, targetY: 1.5, message: "You return to the Dunridge settlement." }
        ],
        encounters: [],
        npcs: []
    },

    research_center: {
        name: "Entheon Research Center",
        data: [
            "####################",
            "#..................#",
            "#..TT..............#",
            "#..TT..............#",
            "#..................#",
            "#.....####.........#",
            "#.....#..#.........#",
            "#.....#..#.........#",
            "#.....####.........#",
            "#..................#",
            "#.........D........#",
            "####################"
        ],
        spawn: { x: 12, y: 9 },
        exits: [
            { x: 10, y: 10, targetMap: "town", targetX: 14.5, targetY: 7.5, message: "You step back outside into the southern Westmere settlement." }
        ],
        npcs: [
            {
                id: "researcher",
                type: "researcher",
                interaction: "professor",
                name: "Researcher",
                x: 6,
                y: 4,
                color: "#8b6bbd",
                lines: [
                    "Welcome to the Entheon Research Center.",
                    "Today is an important day. You are ready to begin your journey through Kaleo.",
                    "I have three young Entheon here who are ready to meet a new trainer.",
                    "When you are ready, take a look at them and choose the companion you connect with."
                ]
            },
            {
                id: "starter-nimblet",
                type: "starter",
                species: "Nimblet",
                name: "Nimblet",
                x: 9,
                y: 4,
                color: "#d3a65f",
                lines: [
                    "Nimblet watches you curiously.",
                    "It seems comfortable around you."
                ]
            },
            {
                id: "starter-pipiri",
                type: "starter",
                species: "Pipiri",
                name: "Pipiri",
                x: 11,
                y: 4,
                color: "#78a9d8",
                lines: [
                    "Pipiri looks up at you.",
                    "It gives a small, energetic chirp."
                ]
            },
            {
                id: "starter-morrowe",
                type: "starter",
                species: "Morrowe",
                name: "Morrowe",
                x: 13,
                y: 4,
                color: "#6e5b82",
                lines: [
                    "Morrowe studies you quietly.",
                    "There is something calm and watchful about it."
                ]
            },
            {
                id: "assistant",
                type: "npc",
                interaction: "dialogue",
                name: "Research Assistant",
                x: 16,
                y: 4,
                color: "#5d9f9b",
                lines: [
                    "Most of our work involves observing Entheon in their natural habitats.",
                    "The more trainers explore, the more we learn.",
                    "Perhaps your journey will teach us something new."
                ]
            }
        ]
    }
};

let currentMap = maps.town;

function getMapWidth() {
    return currentMap.data[0].length;
}

function getMapHeight() {
    return currentMap.data.length;
}

function getWorldWidth() {
    return getMapWidth() * TILE_SIZE;
}

function getWorldHeight() {
    return getMapHeight() * TILE_SIZE;
}


// ============================================================
// PLAYER + CAMERA
// ============================================================

const player = {
    x: 4,
    y: 25,
    width: 20,
    height: 24,
    speed: 4
};

const camera = {
    x: 0,
    y: 0
};


// ============================================================
// CURRENT MAP NPCS
// ============================================================

function getNpcs() {
    return (currentMap.npcs || []).filter(npc => !npc.chosen);
}


// ============================================================
// INPUT
// ============================================================

const keys = {};

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)
    ) {
        event.preventDefault();
    }

    if (
        ["e", "enter", " "].includes(key) &&
        gameState.mode === "overworld"
    ) {
        if (gameState.activeDialogue) {
            advanceDialogue();
        } else {
            interact();
        }

        return;
    }

    keys[key] = true;
});

document.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});


// ============================================================
// START / MAP LOADING
// ============================================================

function startOverworld() {
    gameState.mode = "overworld";
    gameState.currentScene = "overworld";
    gameState.activeDialogue = null;
    gameState.dialogueIndex = 0;
    gameState.currentMap = "town";
    gameState.encounterCooldown = 0;
    gameState.battle = null;

    loadMap("town", 4.5, 25.5);

    introScreen.classList.add("hidden");
    overworldScreen.classList.remove("hidden");

    showWorldMessage(
        `Welcome to Kaleo, ${gameState.playerName}. Visit the Entheon Research Center to begin your journey.`
    );

    drawGame();

    cancelAnimationFrame(animationFrame);
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(gameLoop);
}

function findSafeSpawn(x, y) {
    const candidates = [
        [x, y],
        [x, y + 0.55],
        [x, y - 0.55],
        [x + 0.55, y],
        [x - 0.55, y],
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y]
    ];

    for (const [cx, cy] of candidates) {
        if (canMoveTo(cx, cy)) {
            return { x: cx, y: cy };
        }
    }

    // Last resort: use the requested location. This should only be reached
    // if a future map designer creates a completely enclosed spawn area.
    return { x, y };
}

function loadMap(mapId, spawnX = null, spawnY = null) {
    if (!maps[mapId]) {
        console.error("Unknown map:", mapId);
        return;
    }

    currentMap = maps[mapId];
    gameState.currentMap = mapId;

    // Clear held movement keys when changing maps.
    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });

    if (spawnX !== null && spawnY !== null) {
        const safe = findSafeSpawn(spawnX, spawnY);
        player.x = safe.x;
        player.y = safe.y;
    }

    // Give the player a short grace period after entering a new map.
    gameState.transitionCooldown = 350;

    areaStatus.textContent = currentMap.name;

    closeNpcDialogue();
    updateCamera();
    drawGame();
}

function transitionTo(mapId, x, y, message) {
    loadMap(mapId, x, y);

    if (message) {
        showWorldMessage(message);
    }
}


// ============================================================
// GAME LOOP
// ============================================================

let animationFrame = null;
let lastTime = 0;

function gameLoop(timestamp) {
    const delta = Math.min((timestamp - lastTime) / 16.67, 2);
    lastTime = timestamp;

    if (!gameState.activeDialogue) {
        updatePlayer(delta);
    }

    updateCamera();
    drawGame();

    animationFrame = requestAnimationFrame(gameLoop);
}


// ============================================================
// MOVEMENT + COLLISION
// ============================================================

function updatePlayer(delta) {
    // Prevent a map transition from immediately triggering another transition.
    if (gameState.transitionCooldown > 0) {
        gameState.transitionCooldown -= delta * 16.67;
    }

    if (gameState.encounterCooldown > 0) {
        gameState.encounterCooldown -= delta * 16.67;
    }

    let dx = 0;
    let dy = 0;

    if (keys["arrowup"] || keys["w"]) dy -= 1;
    if (keys["arrowdown"] || keys["s"]) dy += 1;
    if (keys["arrowleft"] || keys["a"]) dx -= 1;
    if (keys["arrowright"] || keys["d"]) dx += 1;

    if (dx === 0 && dy === 0) return;

    if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
    }

    const movement = player.speed * delta / TILE_SIZE;

    const newX = player.x + dx * movement;
    const newY = player.y + dy * movement;

    // Check horizontal and vertical movement independently so the player
    // can slide along walls instead of becoming completely stuck.
    if (canMoveTo(newX, player.y)) {
        player.x = newX;
    }

    if (canMoveTo(player.x, newY)) {
        player.y = newY;
    }

    const minX = 0.55;
    const maxX = getMapWidth() - 1.55;
    const minY = 0.55;
    const maxY = getMapHeight() - 0.55;

    player.x = Math.max(minX, Math.min(maxX, player.x));
    player.y = Math.max(minY, Math.min(maxY, player.y));

    if (gameState.transitionCooldown <= 0) {
        checkAutomaticTransitions();
    }

    if (gameState.encounterCooldown <= 0 && getTile(Math.floor(player.x), Math.floor(player.y)) === TILE.TALL_GRASS) {
        if (Math.random() < 0.018) {
            startWildEncounter();
        }
    }
}

function canMoveTo(x, y) {
    const radius = 0.28;

    const points = [
        [x - radius, y - radius],
        [x + radius, y - radius],
        [x - radius, y + radius],
        [x + radius, y + radius]
    ];

    const terrainClear = points.every(([px, py]) => {
        const tile = getTile(Math.floor(px), Math.floor(py));

        return tile !== TILE.WALL &&
               tile !== TILE.TREE &&
               tile !== TILE.WATER;
    });

    if (!terrainClear) {
        return false;
    }

    return !getNpcs().some(npc => {
        const distance = Math.hypot(x - npc.x, y - npc.y);
        return distance < 0.65;
    });
}

function getTile(x, y) {
    if (
        y < 0 ||
        y >= currentMap.data.length ||
        x < 0 ||
        x >= currentMap.data[0].length
    ) {
        return TILE.WALL;
    }

    return currentMap.data[y][x];
}


// ============================================================
// MAP TRANSITIONS
// ============================================================

function checkAutomaticTransitions() {
    // Check the centre of each door tile rather than relying only on
    // Math.floor(player.x/y). This makes boundary doors reliable even when
    // collision radius or movement speed changes slightly.
    const exits = currentMap.exits || [];
    const worldExit = exits.find(exit => {
        const distance = Math.hypot(
            player.x - (exit.x + 0.5),
            player.y - (exit.y + 0.5)
        );
        return distance <= (exit.triggerRadius || 0.62);
    });

    if (!worldExit) return;

    transitionTo(
        worldExit.targetMap,
        worldExit.targetX,
        worldExit.targetY,
        worldExit.message
    );
}


// ============================================================
// WILD ENCOUNTERS + BATTLE SYSTEM
// ============================================================

const DEV_EVOLUTION_TEST = true;

// Canonical level-based evolution requirements currently documented for Kaleo.
// The framework is intentionally structured so later methods (items, bond,
// time of day, etc.) can be added without replacing the evolution system.
const evolutionData = {
    Nimblet: { evolvesInto: "Nymbril", method: "level", level: 16 },
    Nymbril: { evolvesInto: "Nymbrake", method: "level", level: 36 },
    Pipiri: { evolvesInto: "Pirello", method: "level", level: 17 },
    Pirello: { evolvesInto: "Piravelle", method: "level", level: 36 },
    Morrowe: { evolvesInto: "Morveth", method: "level", level: 18 },
    Morveth: { evolvesInto: "Morvayne", method: "level", level: 40 },
    Kivvi: { evolvesInto: "Kivara", method: "level", level: 16 },
    Kivara: { evolvesInto: "Kivarune", method: "level", level: 36 },
    Brindlew: { evolvesInto: "Brindrel", method: "level", level: 17 },
    Brindrel: { evolvesInto: "Brinderv", method: "level", level: 36 },
    Sovel: { evolvesInto: "Sovelle", method: "level", level: 18 },
    Sovelle: { evolvesInto: "Sovaryn", method: "level", level: 38 },
    Tarnit: { evolvesInto: "Tarnelle", method: "level", level: 16 },
    Tarnelle: { evolvesInto: "Tarnovar", method: "level", level: 36 },
    Quiblet: { evolvesInto: "Quivane", method: "level", level: 17 },
    Quivane: { evolvesInto: "Quivaryn", method: "level", level: 36 },
    Elnu: { evolvesInto: "Elvara", method: "level", level: 18 },
    Elvara: { evolvesInto: "Elvarin", method: "level", level: 36 }
};

const speciesBattleData = {
    // Prototype numeric statistics. The canonical reference establishes
    // Base Statistics as part of species data, but does not currently give
    // numeric values. These are therefore explicit balancing values for the
    // prototype and can be rebalanced later.
    Nimblet: {
        level: 5,
        baseStats: { hp: 28, attack: 52, defense: 40, specialAttack: 40, specialDefense: 38, speed: 60 },
        moves: [
            { level: 1, name: "Tackle", category: "Physical", power: 40, accuracy: 100, effect: "—" },
            { level: 1, name: "Scratch", category: "Physical", power: 40, accuracy: 100, effect: "—" },
            { level: 4, name: "Quick Attack", category: "Physical", power: 40, accuracy: 100, effect: "Priority attack" },
            { level: 7, name: "Quick Strike", category: "Physical", power: 40, accuracy: 100, effect: "Priority attack" },
            { level: 10, name: "Focus", category: "Status", power: 0, accuracy: 100, effect: "Raises Attack and accuracy" },
            { level: 13, name: "Agility", category: "Status", power: 0, accuracy: 100, effect: "Raises Speed" }
        ]
    },
    Pipiri: {
        level: 5,
        baseStats: { hp: 28, attack: 38, defense: 46, specialAttack: 54, specialDefense: 50, speed: 34 },
        moves: [
            { level: 1, name: "Tackle", category: "Physical", power: 40, accuracy: 100, effect: "—" },
            { level: 1, name: "Water Pulse", category: "Special", power: 60, accuracy: 100, effect: "Chance to Confuse" },
            { level: 4, name: "Aqua Jet", category: "Physical", power: 40, accuracy: 100, effect: "Priority attack" },
            { level: 7, name: "Cleansing Flow", category: "Status", power: 0, accuracy: 100, effect: "Removes selected status conditions" },
            { level: 10, name: "Brine Armor", category: "Status", power: 0, accuracy: 100, effect: "Raises Defense" },
            { level: 13, name: "Restorative Pulse", category: "Status", power: 0, accuracy: 100, effect: "Restores moderate HP" }
        ]
    },
    Morrowe: {
        level: 5,
        baseStats: { hp: 28, attack: 50, defense: 40, specialAttack: 48, specialDefense: 44, speed: 48 },
        moves: [
            { level: 1, name: "Scratch", category: "Physical", power: 40, accuracy: 100, effect: "—" },
            { level: 1, name: "Bite", category: "Physical", power: 60, accuracy: 100, effect: "Chance to Flinch" },
            { level: 4, name: "Shadow Claw", category: "Physical", power: 55, accuracy: 100, effect: "Increased critical-hit chance" },
            { level: 7, name: "Shadow Bolt", category: "Special", power: 60, accuracy: 100, effect: "—" },
            { level: 10, name: "Umbral Step", category: "Status", power: 0, accuracy: 100, effect: "Raises Evasion and changes positioning" },
            { level: 13, name: "Night Veil", category: "Status", power: 0, accuracy: 100, effect: "Creates concealment" }
        ]
    },
    Orrin: {
        level: 3,
        baseStats: { hp: 24, attack: 42, defense: 36, specialAttack: 30, specialDefense: 34, speed: 40 },
        moves: [
            { level: 1, name: "Tackle", category: "Physical", power: 40, accuracy: 100, effect: "—" },
            { level: 1, name: "Scratch", category: "Physical", power: 40, accuracy: 100, effect: "—" }
        ]
    },
    Brindlew: {
        level: 3,
        baseStats: { hp: 26, attack: 44, defense: 46, specialAttack: 34, specialDefense: 40, speed: 32 },
        moves: [
            { level: 1, name: "Tackle", category: "Physical", power: 40, accuracy: 100, effect: "—" },
            { level: 1, name: "Scratch", category: "Physical", power: 40, accuracy: 100, effect: "—" },
            { level: 4, name: "Vine Lash", category: "Physical", power: 45, accuracy: 100, effect: "—" },
            { level: 7, name: "Leaf Dart", category: "Special", power: 50, accuracy: 100, effect: "—" },
            { level: 10, name: "Root Bind", category: "Status", power: 0, accuracy: 100, effect: "Restricts movement and deals residual damage" },
            { level: 13, name: "Growth", category: "Status", power: 0, accuracy: 100, effect: "Raises Attack and Special Attack" }
        ]
    }
};

function ensureEvolutionSpeciesData(targetSpecies, sourceSpecies) {
    if (speciesBattleData[targetSpecies]) return speciesBattleData[targetSpecies];

    const source = speciesBattleData[sourceSpecies];
    if (!source) return null;

    // Prototype fallback for species whose final numeric stat/move data has
    // not yet been authored. This lets the evolution framework be tested
    // without pretending these provisional values are canonical.
    speciesBattleData[targetSpecies] = {
        level: source.level,
        baseStats: {
            hp: source.baseStats.hp + 4,
            attack: source.baseStats.attack + 4,
            defense: source.baseStats.defense + 4,
            specialAttack: source.baseStats.specialAttack + 4,
            specialDefense: source.baseStats.specialDefense + 4,
            speed: source.baseStats.speed + 4
        },
        moves: source.moves.map(move => ({ ...move }))
    };

    return speciesBattleData[targetSpecies];
}

function getEvolutionRequirement(member) {
    const rule = evolutionData[member?.species];
    if (!rule || rule.method !== "level") return null;
    if ((member.level || 1) < rule.level) return null;
    return rule;
}

function markEvolutionEligibility(member) {
    const rule = getEvolutionRequirement(member);
    if (!rule) return false;
    member.pendingEvolution = {
        evolvesInto: rule.evolvesInto,
        method: rule.method,
        requirement: rule.level
    };
    return true;
}

function evolveCreature(member) {
    if (!member?.pendingEvolution) return false;

    const targetSpecies = member.pendingEvolution.evolvesInto;
    const previousSpecies = member.species;
    const previousMaxHp = Math.max(1, member.maxHp || 1);
    const hpRatio = Math.max(0, Math.min(1, (member.currentHp ?? previousMaxHp) / previousMaxHp));

    ensureEvolutionSpeciesData(targetSpecies, previousSpecies);
    if (!speciesBattleData[targetSpecies]) return false;

    member.species = targetSpecies;
    member.stats = calculateCreatureStats(targetSpecies, member.level);
    member.maxHp = member.stats.hp;
    member.currentHp = member.currentHp <= 0 ? 0 : Math.max(1, Math.round(member.maxHp * hpRatio));
    member.moves = getMoveSetForLevel(targetSpecies, member.level);
    member.pendingEvolution = null;

    gameState.starter = gameState.activePartyIndex >= 0 && gameState.party[gameState.activePartyIndex] === member
        ? targetSpecies
        : gameState.starter;
    if (gameState.starterData === member) gameState.starterData = member;

    return true;
}

function createEvolutionPrompt(member) {
    if (!member?.pendingEvolution || gameState.evolutionPromptOpen) return;

    gameState.evolutionPromptOpen = true;
    const target = member.pendingEvolution.evolvesInto;

    const overlay = document.createElement("div");
    overlay.className = "evolution-prompt-overlay";
    overlay.id = "evolution-prompt-overlay";
    overlay.innerHTML = `
        <div class="evolution-prompt">
            <div class="evolution-prompt-kicker">EVOLUTION READY</div>
            <h2>${member.species} is ready to evolve!</h2>
            <p>${member.species} can evolve into <strong>${target}</strong>.</p>
            <div class="evolution-prompt-actions">
                <button type="button" id="evolution-confirm" class="option-button">Evolve</button>
                <button type="button" id="evolution-delay" class="option-button">Later</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    document.getElementById("evolution-confirm").addEventListener("click", () => {
        const oldSpecies = member.species;
        const evolved = evolveCreature(member);
        closeEvolutionPrompt();
        if (evolved) {
            renderParty();
            renderPartyScreen();
            showWorldMessage(`${oldSpecies} evolved into ${member.species}!`);
        }
    });

    document.getElementById("evolution-delay").addEventListener("click", () => {
        closeEvolutionPrompt();
        showWorldMessage(`${member.species} will remain in its current form for now.`);
        renderParty();
        renderPartyScreen();
    });
}

function closeEvolutionPrompt() {
    const overlay = document.getElementById("evolution-prompt-overlay");
    if (overlay) overlay.remove();
    gameState.evolutionPromptOpen = false;
}

function openPendingEvolution(member) {
    if (!member) return;
    if (!member.pendingEvolution) markEvolutionEligibility(member);
    if (member.pendingEvolution) createEvolutionPrompt(member);
}

const MAX_LEVEL = 100;

function xpRequiredForLevel(level) {
    return level >= MAX_LEVEL ? 0 : 50 + level * 25;
}

function getMoveSetForLevel(species, level) {
    const data = speciesBattleData[species];
    if (!data) return [];
    return data.moves.filter(move => move.level <= level).map(move => ({ ...move }));
}

function calculateCreatureStats(species, level) {
    const data = speciesBattleData[species];
    if (!data) return null;
    const growth = Math.max(0, level - 1);
    const base = data.baseStats;
    return {
        hp: base.hp + growth * 3,
        attack: base.attack + growth,
        defense: base.defense + growth,
        specialAttack: base.specialAttack + growth,
        specialDefense: base.specialDefense + growth,
        speed: base.speed + growth
    };
}

function createCreature(species, level, currentHp = null) {
    const data = speciesBattleData[species];
    if (!data) return null;
    const stats = calculateCreatureStats(species, level);
    const maxHp = stats.hp;
    return {
        species,
        level,
        xp: 0,
        xpToNext: xpRequiredForLevel(level),
        stats,
        maxHp,
        currentHp: currentHp === null ? maxHp : Math.min(currentHp, maxHp),
        moves: getMoveSetForLevel(species, level)
    };
}

function ensureCreatureProgressionData(member) {
    if (!member || !speciesBattleData[member.species]) return member;
    const level = member.level || speciesBattleData[member.species].level || 1;
    const stats = calculateCreatureStats(member.species, level);
    const oldMaxHp = member.maxHp;

    if (member.xp === undefined) member.xp = 0;
    member.xpToNext = xpRequiredForLevel(level);
    member.maxHp = stats.hp;

    if (member.currentHp === undefined || member.currentHp === null) {
        member.currentHp = member.maxHp;
    } else if (oldMaxHp && oldMaxHp !== member.maxHp && member.currentHp > 0) {
        member.currentHp = Math.min(member.maxHp, Math.round(member.currentHp / oldMaxHp * member.maxHp));
    } else {
        member.currentHp = Math.min(member.currentHp, member.maxHp);
    }

    member.stats = stats;
    member.moves = getMoveSetForLevel(member.species, level);
    return member;
}

function awardExperience(member, amount) {
    ensureCreatureProgressionData(member);
    member.xp += amount;
    const levels = [];

    while (member.level < MAX_LEVEL) {
        const required = xpRequiredForLevel(member.level);
        if (member.xp < required) break;

        member.xp -= required;
        member.level += 1;
        levels.push(member.level);

        const stats = calculateCreatureStats(member.species, member.level);
        member.stats = stats;
        member.maxHp = stats.hp;
        member.currentHp = member.maxHp;
        member.moves = getMoveSetForLevel(member.species, member.level);
    }

    if (levels.length > 0) {
        markEvolutionEligibility(member);
    }

    member.xpToNext = xpRequiredForLevel(member.level);
    return { gained: amount, levels };
}

function getDamageForMove(attacker, defender, move) {
    if (!move || move.power <= 0) return 0;
    const physical = move.category === "Physical";
    const attackStat = physical ? attacker.stats.attack : attacker.stats.specialAttack;
    const defenseStat = physical ? defender.stats.defense : defender.stats.specialDefense;
    const raw = (((2 * attacker.level / 5 + 2) * move.power * attackStat / Math.max(1, defenseStat)) / 35) + 2;
    const variance = 0.90 + Math.random() * 0.11;
    return Math.max(1, Math.floor(raw * variance));
}

const battleUI = {
    wildName: document.getElementById("battle-wild-name"),
    wildLevel: document.getElementById("battle-wild-level"),
    wildHp: document.getElementById("battle-wild-hp"),
    wildHpFill: document.getElementById("battle-hp-fill"),
    playerName: document.getElementById("battle-player-name"),
    playerLevel: document.getElementById("battle-player-level"),
    playerHp: document.getElementById("battle-player-hp"),
    playerHpFill: document.getElementById("battle-player-hp-fill"),
    message: document.getElementById("battle-message"),
    moves: document.getElementById("battle-moves"),
    fightButton: document.getElementById("battle-fight"),
    captureButton: document.getElementById("battle-capture"),
    partyButton: document.getElementById("battle-party"),
    inventoryButton: document.getElementById("battle-inventory"),
    runButton: document.getElementById("battle-run")
};

battleUI.fightButton.addEventListener("click", () => {
    const battle = gameState.battle;
    if (!battle || battle.locked || !battle.playerTurn || battle.wild.hp <= 0) return;

    battle.showMoves = true;
    renderBattle();
});

battleUI.captureButton.addEventListener("click", openCrystalScreen);
if (battleUI.inventoryButton) {
    battleUI.inventoryButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!gameState.battle || gameState.battle.locked || !gameState.battle.playerTurn || gameState.battle.wild.hp <= 0) return;
        openInventory(true);
    });
}
if (battleUI.partyButton) {
    battleUI.partyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!gameState.battle || gameState.battle.locked || !gameState.battle.playerTurn) return;
        openPartyScreen(true, false);
    });
}

const inventoryButton = document.getElementById("inventory-button");
if (inventoryButton) {
    inventoryButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openInventory(false);
    });
}

if (inventoryCloseButton) {
    inventoryCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeInventory();
    });
}

if (shopCloseButton) {
    shopCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeMerchantShop();
    });
}

if (partyButton) {
    partyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openPartyScreen(false, false);
    });
}

if (partyCloseButton) {
    partyCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closePartyScreen();
    });
}
battleUI.runButton.addEventListener("click", battleRun);


function renderParty() {
    if (!partyPanel || !partyList) return;

    if (!gameState.party || gameState.party.length === 0) {
        partyPanel.classList.add("hidden");
        partyList.innerHTML = "";
        renderPartyScreen();
        return;
    }

    partyPanel.classList.remove("hidden");
    partyList.innerHTML = gameState.party.map((member, index) => {
        const hp = Math.max(0, member.currentHp);
        const maxHp = Math.max(1, member.maxHp);
        const hpPercent = Math.max(0, Math.min(100, hp / maxHp * 100));

        return `
            <div class="party-member${index === gameState.activePartyIndex ? " active" : ""}${hp <= 0 ? " fainted" : ""}">
                <div class="party-member-number">${index + 1}</div>
                <div class="party-member-info">
                    <div class="party-member-top">
                        <span class="party-member-name">${member.species}</span>
                        <span class="party-member-level">Lv. ${member.level}</span>
                    </div>
                    <div class="party-hp-track">
                        <div class="party-hp-fill" style="width:${hpPercent}%"></div>
                    </div>
                    <div class="party-hp-text">${hp} / ${maxHp} HP</div>
                    <div class="party-hp-text">XP ${member.xp || 0} / ${member.xpToNext || 0}</div>
                </div>
            </div>`;
    }).join("");

    renderPartyScreen();
}

function renderPartyScreen() {
    if (!partyScreenList || !partyDetail) return;

    if (!gameState.party || gameState.party.length === 0) {
        partyScreenList.innerHTML = "";
        partyDetail.innerHTML = '<div class="party-detail-empty">Your party is empty.</div>';
        return;
    }

    if (gameState.selectedPartyIndex < 0 || gameState.selectedPartyIndex >= gameState.party.length) {
        gameState.selectedPartyIndex = 0;
    }

    partyScreenList.innerHTML = gameState.party.map((member, index) => {
        const hp = Math.max(0, member.currentHp);
        const maxHp = Math.max(1, member.maxHp);
        const hpPercent = Math.max(0, Math.min(100, hp / maxHp * 100));
        const active = index === gameState.activePartyIndex;
        const selected = index === gameState.selectedPartyIndex;

        return `
            <button type="button"
                    class="party-screen-card${active ? " active" : ""}${selected ? " selected" : ""}${hp <= 0 ? " fainted" : ""}"
                    data-party-index="${index}">
                <div class="party-screen-card-number">${index + 1}</div>
                <div class="party-screen-card-main">
                    <div class="party-screen-card-title">
                        <strong>${member.species}</strong>
                        <span>Lv. ${member.level}</span>
                    </div>
                    <div class="party-hp-track">
                        <div class="party-hp-fill" style="width:${hpPercent}%"></div>
                    </div>
                    <div class="party-screen-hp">${hp} / ${maxHp} HP</div>
                </div>
                ${active ? '<span class="party-active-badge">ACTIVE</span>' : ""}
            </button>`;
    }).join("");

    partyScreenList.querySelectorAll("[data-party-index]").forEach(button => {
        button.addEventListener("click", () => {
            gameState.selectedPartyIndex = Number(button.dataset.partyIndex);
            renderPartyScreen();
        });
    });

    const member = gameState.party[gameState.selectedPartyIndex];
    const moves = Array.isArray(member.moves) ? member.moves : [];

    partyDetail.innerHTML = `
        <div class="party-detail-header">
            <div>
                <div class="party-detail-name">${member.species}</div>
                <div class="party-detail-level">Level ${member.level}</div>
            </div>
            ${gameState.selectedPartyIndex === gameState.activePartyIndex
                ? '<span class="party-detail-active">Current Entheon</span>'
                : ""}
        </div>
        <div class="party-detail-stat">
            <div class="party-detail-stat-label">
                <span>HP</span>
                <strong>${Math.max(0, member.currentHp)} / ${Math.max(1, member.maxHp)}</strong>
            </div>
            <div class="party-detail-hp-track">
                <div class="party-hp-fill" style="width:${Math.max(0, Math.min(100, member.currentHp / Math.max(1, member.maxHp) * 100))}%"></div>
            </div>
        </div>
        <div class="party-detail-section">
            <h3>Progression</h3>
            <div class="party-detail-move">
                <strong>XP</strong>
                <span>${member.xp || 0} / ${member.xpToNext || 0}</span>
            </div>
            <div class="party-detail-move">
                <strong>Stats</strong>
                <span>ATK ${member.stats?.attack ?? "—"} · DEF ${member.stats?.defense ?? "—"} · SpA ${member.stats?.specialAttack ?? "—"} · SpD ${member.stats?.specialDefense ?? "—"} · SPD ${member.stats?.speed ?? "—"}</span>
            </div>
        </div>
        <div class="party-detail-section">
            <h3>Moves</h3>
            <div class="party-detail-moves">
                ${moves.length
                    ? moves.map(move => `
                        <div class="party-detail-move">
                            <strong>${move.name}</strong>
                            <span>Power: ${move.power ?? "—"}</span>
                        </div>`).join("")
                    : '<div class="party-detail-empty">No moves recorded.</div>'}
            </div>
        </div>
        <button type="button" id="party-switch-button" class="party-switch-button"
                ${gameState.selectedPartyIndex === gameState.activePartyIndex || member.currentHp <= 0 ? "disabled" : ""}>
            ${member.currentHp <= 0 ? "Fainted" : gameState.selectedPartyIndex === gameState.activePartyIndex ? "Active Entheon" : `Switch to ${member.species}`}
        </button>
        ${member.pendingEvolution ? `
            <button type="button" id="party-evolution-button" class="party-evolution-button">
                Ready to evolve into ${member.pendingEvolution.evolvesInto}
            </button>` : ""}
        ${DEV_EVOLUTION_TEST && evolutionData[member.species] ? `
            <button type="button" id="dev-evolution-button" class="party-dev-button">
                DEV: Make Evolution Available
            </button>` : ""}`;

    const switchButton = document.getElementById("party-switch-button");
    if (switchButton) {
        switchButton.addEventListener("click", () => switchActivePartyMember(gameState.selectedPartyIndex));
    }

    const evolutionButton = document.getElementById("party-evolution-button");
    if (evolutionButton) {
        evolutionButton.addEventListener("click", () => openPendingEvolution(member));
    }

    const devEvolutionButton = document.getElementById("dev-evolution-button");
    if (devEvolutionButton) {
        devEvolutionButton.addEventListener("click", () => {
            const rule = evolutionData[member.species];
            if (!rule) return;
            member.level = Math.max(member.level, rule.level);
            ensureEvolutionSpeciesData(rule.evolvesInto, member.species);
            ensureCreatureProgressionData(member);
            member.xp = 0;
            markEvolutionEligibility(member);
            renderParty();
            renderPartyScreen();
            openPendingEvolution(member);
        });
    }
}

function switchActivePartyMember(index) {
    const member = (gameState.party || [])[index];
    if (!member) return;
    if (index === gameState.activePartyIndex) return;
    if (member.currentHp <= 0) {
        if (!gameState.partyScreenForced) {
            showWorldMessage(`${member.species} has no HP and cannot be selected right now.`);
        }
        return;
    }

    ensureCreatureProgressionData(member);

    gameState.activePartyIndex = index;
    gameState.selectedPartyIndex = index;
    gameState.starter = member.species;
    gameState.starterData = member;

    if (gameState.battle && gameState.partyScreenBattleMode) {
        const battle = gameState.battle;
        battle.player = {
            creature: member,
            name: member.species,
            level: member.level,
            hp: member.currentHp,
            maxHp: member.maxHp,
            stats: { ...member.stats },
            moves: member.moves.map(move => ({ ...move }))
        };
        battle.showMoves = false;
        battle.forceSwitch = false;
        battle.locked = true;

        const forcedSwitch = gameState.partyScreenForced;
        renderParty();
        gameState.partyScreenForced = false;
        closePartyScreen();

        battle.playerTurn = true;
        battle.locked = false;
        battle.forceSwitch = false;
        renderBattle(`${member.species} was sent into battle!`);

        // A voluntary switch uses the player's turn. A forced switch happens
        // after the opponent's attack, so the replacement gets the next turn.
        if (!forcedSwitch) {
            setTimeout(wildBattleAttack, 750);
        }
        return;
    }

    renderParty();
    showWorldMessage(`${member.species} is now your active Entheon.`);
}

function openPartyScreen(battleMode = false, forced = false) {
    if (!gameState.party || gameState.party.length === 0) {
        showWorldMessage("You don't have any Entheon in your party yet.");
        return;
    }

    gameState.partyScreenBattleMode = battleMode;
    gameState.partyScreenForced = forced;
    gameState.selectedPartyIndex = gameState.activePartyIndex;
    renderPartyScreen();
    partyScreen.classList.remove("hidden");

    if (partyCloseButton) {
        partyCloseButton.textContent = forced ? "Choose Entheon" : "Close";
        partyCloseButton.disabled = forced;
        partyCloseButton.classList.toggle("hidden", forced);
    }
}

function closePartyScreen() {
    if (gameState.partyScreenForced) return;
    partyScreen.classList.add("hidden");
    gameState.partyScreenBattleMode = false;
    gameState.partyScreenForced = false;
    if (partyCloseButton) {
        partyCloseButton.textContent = "Close";
        partyCloseButton.disabled = false;
        partyCloseButton.classList.remove("hidden");
    }
}

function getEncounterPool() {
    // The pool belongs to the current map, so future routes can define their
    // own species without changing the battle code. Starters are explicitly
    // excluded as a safety rule even if one is accidentally added to a pool.
    return (currentMap.encounters || []).filter(entry => {
        return speciesBattleData[entry.species];
    });
}

function chooseWeightedEncounter(pool) {
    const totalWeight = pool.reduce((sum, entry) => sum + Math.max(0, entry.weight || 0), 0);
    if (totalWeight <= 0) return pool[Math.floor(Math.random() * pool.length)];

    let roll = Math.random() * totalWeight;
    for (const entry of pool) {
        roll -= Math.max(0, entry.weight || 0);
        if (roll < 0) return entry;
    }

    return pool[pool.length - 1];
}

function randomInt(min, max) {
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function calculateScaledHp(baseHp, baseLevel, level) {
    const scale = Math.max(0, level - baseLevel);
    return baseHp + scale * 3;
}

function startWildEncounter() {
    // There is no default starter anymore. A battle can only begin
    // after the player has actually received an Entheon.
    if (!gameState.starter || !gameState.starterData) {
        showWorldMessage("You need an Entheon partner before entering tall grass.");
        gameState.encounterCooldown = 1200;
        return;
    }

    const encounterPool = getEncounterPool();
    if (encounterPool.length === 0) {
        showWorldMessage("No wild Entheon are currently defined for this area.");
        gameState.encounterCooldown = 1200;
        return;
    }

    const encounter = chooseWeightedEncounter(encounterPool);
    const wildSpecies = encounter.species;
    const wildData = speciesBattleData[wildSpecies];

    if (!wildData) {
        console.error("Encounter species has no battle data:", wildSpecies);
        gameState.encounterCooldown = 1200;
        return;
    }

    let activeMember = gameState.party[gameState.activePartyIndex] || gameState.party[0];
    if (!activeMember) {
        showWorldMessage("You need an Entheon partner before entering tall grass.");
        gameState.encounterCooldown = 1200;
        return;
    }

    if (activeMember.currentHp <= 0) {
        const replacementIndex = gameState.party.findIndex(member => member.currentHp > 0);
        if (replacementIndex >= 0) {
            gameState.activePartyIndex = replacementIndex;
            gameState.selectedPartyIndex = replacementIndex;
            activeMember = gameState.party[replacementIndex];
            gameState.starter = activeMember.species;
            gameState.starterData = activeMember;
            renderParty();
        } else {
            showWorldMessage("All of your Entheon have fainted. Visit a Restoration Hub before entering tall grass.");
            gameState.encounterCooldown = 1200;
            return;
        }
    }

    gameState.starter = activeMember.species;
    gameState.starterData = activeMember;

    const playerData = ensureCreatureProgressionData(activeMember);
    const wildLevel = randomInt(encounter.minLevel, encounter.maxLevel);
    const wildCreature = createCreature(wildSpecies, wildLevel);

    gameState.mode = "battle";

    gameState.battle = {
        player: {
            creature: playerData,
            name: playerData.species,
            level: playerData.level,
            hp: playerData.currentHp,
            maxHp: playerData.maxHp,
            stats: { ...playerData.stats },
            moves: playerData.moves.map(move => ({ ...move }))
        },
        wild: {
            creature: wildCreature,
            name: wildCreature.species,
            level: wildCreature.level,
            hp: wildCreature.currentHp,
            maxHp: wildCreature.maxHp,
            stats: { ...wildCreature.stats },
            moves: wildCreature.moves.map(move => ({ ...move }))
        },
        playerTurn: true,
        locked: false,
        showMoves: false,
        forceSwitch: false,
        outcome: null
    };

    battleScreen.classList.remove("hidden");
    overworldScreen.classList.add("hidden");

    renderBattle();
}

function renderBattle(message = null) {
    const battle = gameState.battle;
    if (!battle) return;

    battleUI.wildName.textContent = `Wild ${battle.wild.name}`;
    battleUI.wildLevel.textContent = `Lv. ${battle.wild.level}`;
    battleUI.wildHp.textContent = `${battle.wild.hp} / ${battle.wild.maxHp}`;
    battleUI.wildHpFill.style.width =
        `${Math.max(0, battle.wild.hp / battle.wild.maxHp * 100)}%`;

    battleUI.playerName.textContent = battle.player.name;
    battleUI.playerLevel.textContent = `Lv. ${battle.player.level}`;
    battleUI.playerHp.textContent = `${battle.player.hp} / ${battle.player.maxHp}`;
    battleUI.playerHpFill.style.width =
        `${Math.max(0, battle.player.hp / battle.player.maxHp * 100)}%`;

    if (message !== null) {
        battleUI.message.textContent = message;
    }

    battleUI.moves.innerHTML = "";

    // Fight is the primary battle menu. The move list is only visible
    // after the player clicks Fight, just like the intended battle flow.
    battleUI.moves.classList.toggle("hidden", !battle.showMoves);
    battleUI.fightButton.disabled = battle.locked || !battle.playerTurn || battle.wild.hp <= 0;

    if (battle.showMoves) {
        battle.player.moves.forEach(move => {
            const button = document.createElement("button");
            button.className = "move-button";
            button.disabled = !battle.playerTurn || battle.locked || battle.wild.hp <= 0;

            button.innerHTML = `
                <span class="move-name">${move.name}</span>
                <span class="move-meta">${move.category} · Power ${move.power}</span>
            `;

            button.title = move.effect;
            button.addEventListener("click", () => useMove(move));

            battleUI.moves.appendChild(button);
        });
    }

    const trainerBattle = battle.type === "trainer";
    const totalCrystals = getTotalCrystalCount();
    battleUI.captureButton.disabled = trainerBattle ||
        battle.locked ||
        !battle.playerTurn ||
        battle.wild.hp <= 0 ||
        totalCrystals <= 0;

    battleUI.captureButton.textContent = trainerBattle
        ? "Capture unavailable"
        : `Capture (${totalCrystals})`;

    if (battleUI.partyButton) {
        battleUI.partyButton.disabled = battle.locked || !battle.playerTurn || battle.wild.hp <= 0;
    }
    if (battleUI.inventoryButton) {
        battleUI.inventoryButton.disabled = battle.locked || !battle.playerTurn || battle.wild.hp <= 0;
    }

    battleUI.runButton.disabled = trainerBattle || battle.locked || !battle.playerTurn;
}

function useMove(move) {
    const battle = gameState.battle;
    if (!battle || !battle.playerTurn || battle.locked || battle.wild.hp <= 0) return;

    battle.locked = true;
    battle.showMoves = false;

    const damage = getDamageForMove(battle.player, battle.wild, move);
    battle.wild.hp = Math.max(0, battle.wild.hp - damage);

    if (battle.wild.hp <= 0) {
        battle.outcome = "defeat";
        renderBattle(
            `${battle.player.name} used ${move.name}! It dealt ${damage} damage. ${battle.type === "trainer" ? `The trainer's ${battle.wild.name} was defeated!` : `The wild ${battle.wild.name} was defeated!`}`
        );

        if (battle.type === "trainer") {
            setTimeout(() => handleTrainerCreatureDefeat(), 1100);
        } else {
            setTimeout(() => endWildEncounter("The battle is over."), 1100);
        }
        return;
    }

    renderBattle(
        `${battle.player.name} used ${move.name}! It dealt ${damage} damage.`
    );

    setTimeout(wildBattleAttack, 750);
}

function wildBattleAttack() {
    const battle = gameState.battle;
    if (!battle || battle.wild.hp <= 0) return;

    const move = battle.wild.moves[Math.floor(Math.random() * battle.wild.moves.length)];
    const damage = getDamageForMove(battle.wild, battle.player, move);
    battle.player.hp = Math.max(0, battle.player.hp - damage);

    if (battle.player.hp <= 0) {
        const fainted = gameState.party[gameState.activePartyIndex];
        if (fainted) fainted.currentHp = 0;

        const hasReplacement = gameState.party.some((member, index) =>
            index !== gameState.activePartyIndex && member.currentHp > 0
        );

        battle.player.hp = 0;
        battle.locked = true;
        battle.playerTurn = false;
        battle.showMoves = false;

        if (!hasReplacement) {
            renderBattle(
                `${battle.type === "trainer" ? `The trainer's ${battle.wild.name}` : `The wild ${battle.wild.name}`} used ${move.name}! ${battle.player.name} fainted! Your whole party is unable to battle.`
            );
            setTimeout(() => battle.type === "trainer" ? endTrainerBattle(false) : endWildEncounter("Your party needs to recover."), 1300);
            return;
        }

        battle.forceSwitch = true;
        renderBattle(
            `${battle.type === "trainer" ? `The trainer's ${battle.wild.name}` : `The wild ${battle.wild.name}`} used ${move.name}! ${battle.player.name} fainted! Choose another Entheon.`
        );

        setTimeout(() => openPartyScreen(true, true), 700);
        return;
    }

    battle.playerTurn = true;
    battle.locked = false;
    battle.showMoves = false;

    renderBattle(
        `${battle.type === "trainer" ? `The trainer's ${battle.wild.name}` : `The wild ${battle.wild.name}`} used ${move.name}! It dealt ${damage} damage.`
    );
}

function startTrainerBattle(npc) {
    const team = Array.isArray(npc.battle?.team) ? npc.battle.team : [];
    if (!team.length) return;

    let activeMember = gameState.party[gameState.activePartyIndex];
    if (!activeMember || activeMember.currentHp <= 0) {
        const replacementIndex = gameState.party.findIndex(member => member.currentHp > 0);
        if (replacementIndex < 0) {
            showWorldMessage("Your entire party needs to recover before you can battle this trainer.");
            return;
        }
        gameState.activePartyIndex = replacementIndex;
        activeMember = gameState.party[replacementIndex];
    }

    const first = createCreature(team[0].species, team[0].level);
    gameState.trainerBattle = {
        npc,
        team,
        index: 0,
        reward: Number(npc.battle.reward || 0),
        won: false
    };

    gameState.mode = "battle";
    gameState.battle = {
        type: "trainer",
        trainer: npc,
        player: {
            creature: activeMember,
            name: activeMember.species,
            level: activeMember.level,
            hp: activeMember.currentHp,
            maxHp: activeMember.maxHp,
            stats: { ...activeMember.stats },
            moves: activeMember.moves.map(move => ({ ...move }))
        },
        wild: {
            creature: first,
            name: first.species,
            level: first.level,
            hp: first.currentHp,
            maxHp: first.maxHp,
            stats: { ...first.stats },
            moves: first.moves.map(move => ({ ...move }))
        },
        playerTurn: true,
        locked: false,
        showMoves: false,
        forceSwitch: false,
        outcome: null
    };

    battleScreen.classList.remove("hidden");
    overworldScreen.classList.add("hidden");
    renderBattle(`${npc.name} challenges you! ${npc.name} sent out ${first.species}!`);
}

function handleTrainerCreatureDefeat() {
    const battle = gameState.battle;
    const trainerBattle = gameState.trainerBattle;
    if (!battle || battle.type !== "trainer" || !trainerBattle) return;

    trainerBattle.index += 1;
    if (trainerBattle.index >= trainerBattle.team.length) {
        trainerBattle.won = true;
        battle.locked = true;
        renderBattle(`${trainerBattle.npc.name} has no more Entheon! You won the battle!`);
        setTimeout(() => endTrainerBattle(true), 1100);
        return;
    }

    const nextData = trainerBattle.team[trainerBattle.index];
    const next = createCreature(nextData.species, nextData.level);
    battle.wild = {
        creature: next,
        name: next.species,
        level: next.level,
        hp: next.currentHp,
        maxHp: next.maxHp,
        stats: { ...next.stats },
        moves: next.moves.map(move => ({ ...move }))
    };
    battle.outcome = null;
    battle.locked = false;
    battle.playerTurn = true;
    battle.showMoves = false;
    renderBattle(`${trainerBattle.npc.name} sent out ${next.species}!`);
}

function endTrainerBattle(victory) {
    const finished = gameState.battle;
    const trainerBattle = gameState.trainerBattle;
    if (!finished || !trainerBattle) return;

    const activeMember = gameState.party[gameState.activePartyIndex];
    if (activeMember) {
        activeMember.currentHp = Math.min(activeMember.maxHp, finished.player.hp);
        if (victory) {
            const xpGain = trainerBattle.team.reduce((sum, entry) => sum + 35 + entry.level * 14, 0);
            const result = awardExperience(activeMember, xpGain);
            const levelText = result.levels.length ? ` ${activeMember.species} reached Level ${result.levels.join(", ")}!` : "";
            gameState.vale += trainerBattle.reward;
            gameState.trainerBattle = null;
            gameState.battle = null;
            gameState.mode = "overworld";
            battleScreen.classList.add("hidden");
            overworldScreen.classList.remove("hidden");
            gameState.encounterCooldown = 1200;
            renderParty();
            showWorldMessage(`${trainerBattle.npc.name} was defeated! You received ${trainerBattle.reward} Vale and ${xpGain} XP.${levelText}`);
            drawGame();
            if (activeMember.pendingEvolution) setTimeout(() => createEvolutionPrompt(activeMember), 900);
            return;
        }
    }

    gameState.trainerBattle = null;
    gameState.battle = null;
    gameState.mode = "overworld";
    battleScreen.classList.add("hidden");
    overworldScreen.classList.remove("hidden");
    gameState.encounterCooldown = 1200;
    renderParty();
    showWorldMessage("Your party needs to recover before continuing.");
    drawGame();
}

function calculateCaptureChance(battle) {
    // Prototype capture formula. This is deliberately simple for now and will
    // be replaced when the full item/stat system is implemented.
    const hpRatio = battle.wild.hp / battle.wild.maxHp;
    const missingHp = 1 - hpRatio;

    // 20% at full HP, rising to 85% at 0 HP.
    return Math.min(0.85, Math.max(0.20, 0.20 + missingHp * 0.65));
}

function getItemInventory() {
    if (!gameState.items) gameState.items = {};
    return gameState.items;
}

function getUsableItemEntries() {
    return Object.values(getItemInventory()).filter(item => (item.quantity || 0) > 0);
}

function renderInventoryList() {
    if (!inventoryList) return;
    const items = getUsableItemEntries();
    const crystals = Object.values(getCrystalInventory());
    const itemHtml = items.length ? items.map(item => `
        <button type="button" class="inventory-card" data-item-id="${item.id}">
            <div class="inventory-icon">✦</div>
            <div class="inventory-info">
                <strong>${item.name}</strong>
                <span>${item.description}</span>
            </div>
            <div class="inventory-card-actions">
                <span class="inventory-quantity">×${item.quantity}</span>
                <span class="inventory-use-label">Use</span>
            </div>
        </button>
    `).join("") : '<div class="inventory-empty">You do not have any usable items.</div>';

    const crystalHtml = crystals.length ? crystals.map(crystal => `
        <div class="inventory-card inventory-resource">
            <div class="inventory-icon">◇</div>
            <div class="inventory-info">
                <strong>${crystal.name}</strong>
                <span>${crystal.grade} grade · Capture equipment</span>
            </div>
            <div class="inventory-quantity">×${crystal.quantity}</div>
        </div>
    `).join("") : '<div class="inventory-empty">No capture crystals.</div>';

    inventoryList.innerHTML = `
        <div class="inventory-currency-banner"><strong>Vale</strong><span>${getVale().toLocaleString()}</span></div>
        <div class="inventory-section-title">Consumables</div>
        ${itemHtml}
        <div class="inventory-section-title">Capture Crystals</div>
        ${crystalHtml}
    `;

    inventoryList.querySelectorAll("[data-item-id]").forEach(button => {
        button.addEventListener("click", () => beginItemUse(button.dataset.itemId));
    });
}

function renderInventoryTargets(itemId) {
    if (!inventoryTarget) return;
    const item = getItemInventory()[itemId];
    if (!item) return;
    inventoryTarget.classList.remove("hidden");
    inventoryTarget.innerHTML = `
        <div class="inventory-target-title">Choose an Entheon</div>
        <div class="inventory-target-list">
            ${gameState.party.map((member, index) => {
                const fainted = member.currentHp <= 0;
                const invalid = item.kind === "heal" ? fainted || member.currentHp >= member.maxHp : !fainted;
                return `<button type="button" class="inventory-target-button" data-target-index="${index}" ${invalid ? "disabled" : ""}>
                    <strong>${member.species}</strong><span>Lv. ${member.level} · ${Math.max(0, member.currentHp)} / ${member.maxHp} HP</span>
                </button>`;
            }).join("")}
        </div>
        <button type="button" class="ui-small-button inventory-cancel-target" id="inventory-target-cancel">Cancel</button>
    `;
    inventoryTarget.querySelectorAll("[data-target-index]").forEach(button => {
        button.addEventListener("click", () => useItemOnParty(itemId, Number(button.dataset.targetIndex)));
    });
    document.getElementById("inventory-target-cancel")?.addEventListener("click", () => {
        gameState.pendingItemId = null;
        inventoryTarget.classList.add("hidden");
        inventoryTarget.innerHTML = "";
    });
}

function openInventory(battleMode = false) {
    if (gameState.party.length === 0) {
        showWorldMessage("You don't have any Entheon yet.");
        return;
    }
    if (battleMode) {
        const battle = gameState.battle;
        if (!battle || battle.locked || !battle.playerTurn || battle.wild.hp <= 0) return;
    }
    gameState.pendingItemId = null;
    gameState.inventoryBattleMode = battleMode;
    renderInventoryList();
    if (inventoryTarget) {
        inventoryTarget.classList.add("hidden");
        inventoryTarget.innerHTML = "";
    }
    inventoryScreen.classList.remove("hidden");
}

function closeInventory() {
    if (inventoryScreen) inventoryScreen.classList.add("hidden");
    gameState.pendingItemId = null;
    gameState.inventoryBattleMode = false;
    if (inventoryTarget) {
        inventoryTarget.classList.add("hidden");
        inventoryTarget.innerHTML = "";
    }
}

function beginItemUse(itemId) {
    const item = getItemInventory()[itemId];
    if (!item || item.quantity <= 0) return;
    gameState.pendingItemId = itemId;
    renderInventoryTargets(itemId);
}

function useItemOnParty(itemId, targetIndex) {
    const item = getItemInventory()[itemId];
    const target = gameState.party[targetIndex];
    if (!item || !target || item.quantity <= 0) return;

    let changed = false;
    let message = "";
    if (item.kind === "heal") {
        if (target.currentHp <= 0 || target.currentHp >= target.maxHp) return;
        const before = target.currentHp;
        target.currentHp = Math.min(target.maxHp, target.currentHp + item.amount);
        const healed = target.currentHp - before;
        message = `You used a ${item.name} on ${target.species}. It restored ${healed} HP.`;
        changed = healed > 0;
    } else if (item.kind === "revive") {
        if (target.currentHp > 0) return;
        target.currentHp = Math.max(1, Math.floor(target.maxHp * item.amount));
        message = `You used a ${item.name} on ${target.species}. ${target.species} was revived!`;
        changed = true;
    }

    if (!changed) return;
    item.quantity--;
    renderParty();

    const battleMode = !!gameState.inventoryBattleMode;
    closeInventory();

    if (battleMode && gameState.battle) {
        const battle = gameState.battle;
        battle.locked = true;
        battle.showMoves = false;
        const active = gameState.party[gameState.activePartyIndex];
        battle.player.hp = active.currentHp;
        battle.player.maxHp = active.maxHp;
        battle.player.stats = { ...active.stats };
        renderBattle(message);
        setTimeout(() => wildBattleAttack(), 750);
    } else {
        showWorldMessage(message);
    }
}

function getCrystalInventory() {
    if (!gameState.crystals) {
        gameState.crystals = {
            capture: { id: "capture", name: "Capture Crystal", grade: "Capture", quantity: gameState.captureDevices || 0 }
        };
    }
    return gameState.crystals;
}

function getTotalCrystalCount() {
    return Object.values(getCrystalInventory()).reduce((sum, crystal) => sum + Math.max(0, crystal.quantity || 0), 0);
}

function renderCrystalList() {
    if (!crystalList) return;
    const crystals = Object.values(getCrystalInventory());
    crystalList.innerHTML = crystals.length ? crystals.map(crystal => `
        <button type="button" class="crystal-card${crystal.quantity <= 0 ? " empty" : ""}"
                data-crystal-id="${crystal.id}" ${crystal.quantity <= 0 ? "disabled" : ""}>
            <div class="crystal-icon">◇</div>
            <div class="crystal-info">
                <strong>${crystal.name}</strong>
                <span>${crystal.grade} grade</span>
            </div>
            <div class="crystal-quantity">×${crystal.quantity}</div>
        </button>
    `).join("") : '<div class="crystal-empty">You do not have any capture crystals.</div>';

    crystalList.querySelectorAll("[data-crystal-id]").forEach(button => {
        button.addEventListener("click", () => selectCrystalForCapture(button.dataset.crystalId));
    });
}

function openCrystalScreen() {
    const battle = gameState.battle;
    if (!battle || battle.locked || !battle.playerTurn || battle.wild.hp <= 0 || getTotalCrystalCount() <= 0) return;
    renderCrystalList();
    crystalScreen.classList.remove("hidden");
}

function closeCrystalScreen() {
    if (crystalScreen) crystalScreen.classList.add("hidden");
}

function selectCrystalForCapture(crystalId) {
    closeCrystalScreen();
    battleCapture(crystalId);
}

function battleCapture(crystalId) {
    const battle = gameState.battle;
    if (battle?.type === "trainer") return;
    const crystal = getCrystalInventory()[crystalId];

    if (!battle || battle.locked || !battle.playerTurn || battle.wild.hp <= 0 || !crystal || crystal.quantity <= 0) {
        return;
    }

    battle.locked = true;
    battle.showMoves = false;
    crystal.quantity--;
    gameState.captureDevices = getTotalCrystalCount();

    const chance = calculateCaptureChance(battle, crystal);
    const success = Math.random() < chance;
    const wildName = battle.wild.name;
    const wildLevel = battle.wild.level;
    const crystalName = crystal.name;

    renderBattle(`You hold out the ${crystalName}. The crystal begins to resonate with ${wildName}...`);
    playCaptureResonance(success, () => {
        const currentBattle = gameState.battle;
        if (!currentBattle || currentBattle.wild.name !== wildName) return;

        if (success) {
            const captured = createCreature(
                currentBattle.wild.name,
                wildLevel,
                currentBattle.wild.hp
            );

            gameState.party.push(captured);
            gameState.selectedPartyIndex = gameState.party.length - 1;
            renderParty();
            renderBattle(`The resonance succeeded! ${wildName} was absorbed into the ${crystalName}.`);

            setTimeout(() => {
                endWildEncounter(`${wildName} joined your party. ${crystalName}s remaining: ${crystal.quantity}.`);
            }, 1000);
            return;
        }

        currentBattle.playerTurn = false;
        renderBattle(`The resonance failed! ${wildName} resisted the ${crystalName} and reformed.`);
        setTimeout(wildBattleAttack, 850);
    });
}

function playCaptureResonance(success, onComplete) {
    if (!captureEffect || !battleCreatureVisual) {
        onComplete();
        return;
    }

    // A capture animation is purely visual. The underlying battle creature
    // remains intact until the result is resolved, so a failed resonance can
    // never leave a partially-rendered Entheon behind.
    captureEffect.classList.remove("hidden", "capture-success", "capture-failure");
    battleCreatureVisual.classList.remove("capture-targeting", "capture-absorbing", "capture-reformed");

    requestAnimationFrame(() => {
        battleCreatureVisual.classList.add("capture-targeting");
    });

    setTimeout(() => {
        battleCreatureVisual.classList.add("capture-absorbing");
    }, 550);

    setTimeout(() => {
        captureEffect.classList.add(success ? "capture-success" : "capture-failure");
    }, 1050);

    setTimeout(() => {
        if (success) {
            battleCreatureVisual.classList.add("capture-absorbing");
        } else {
            battleCreatureVisual.classList.remove("capture-targeting", "capture-absorbing");
            battleCreatureVisual.classList.add("capture-reformed");
        }
    }, 1450);

    setTimeout(() => {
        captureEffect.classList.add("hidden");
        captureEffect.classList.remove("capture-success", "capture-failure");
        battleCreatureVisual.classList.remove("capture-targeting", "capture-absorbing", "capture-reformed");
        onComplete();
    }, success ? 2050 : 1950);
}

function calculateCaptureChance(battle, crystal = null) {
    const hpRatio = battle.wild.hp / battle.wild.maxHp;
    const missingHp = 1 - hpRatio;
    const crystalModifier = crystal?.captureModifier || 1.0;
    return Math.min(0.95, Math.max(0.05, (0.20 + missingHp * 0.65) * crystalModifier));
}

function battleRun() {
    const battle = gameState.battle;
    if (!battle || battle.locked || !battle.playerTurn) return;

    battle.locked = true;
    battle.showMoves = false;
    battleUI.runButton.disabled = true;

    battleUI.message.textContent = "You got away safely.";

    setTimeout(() => endWildEncounter("You returned to the route."), 650);
}

function endWildEncounter(message) {
    const finishedBattle = gameState.battle;

    // Preserve the active Entheon's HP between encounters.
    if (finishedBattle?.player) {
        const activeMember = gameState.party[gameState.activePartyIndex];
        if (activeMember) {
            ensureCreatureProgressionData(activeMember);
            activeMember.currentHp = Math.min(activeMember.maxHp, finishedBattle.player.hp);

            // A fainted Entheon stays at 0 HP until the player uses a
            // Restoration Hub (or another future healing method).

            // Only a defeated wild Entheon awards battle XP. Running away and
            // successful capture do not award XP in this progression step.
            if (finishedBattle.outcome === "defeat" && finishedBattle.wild) {
                const xpGain = 30 + finishedBattle.wild.level * 12;
                const result = awardExperience(activeMember, xpGain);

                if (result.levels.length > 0) {
                    message = `${activeMember.species} gained ${xpGain} XP and reached Level ${result.levels.join(", ")}!`;
                } else {
                    message = `${activeMember.species} gained ${xpGain} XP.`;
                }
            }

            gameState.starterData = activeMember;
            gameState.starter = activeMember.species;
        }
        renderParty();
    }

    gameState.mode = "overworld";
    gameState.battle = null;
    gameState.partyScreenBattleMode = false;
    gameState.partyScreenForced = false;
    partyScreen.classList.add("hidden");
    if (partyCloseButton) {
        partyCloseButton.textContent = "Close";
        partyCloseButton.disabled = false;
        partyCloseButton.classList.remove("hidden");
    }
    gameState.encounterCooldown = 1500;

    battleScreen.classList.add("hidden");
    overworldScreen.classList.remove("hidden");

    showWorldMessage(message);
    drawGame();

    const activeMember = gameState.party[gameState.activePartyIndex];
    if (activeMember?.pendingEvolution) {
        setTimeout(() => createEvolutionPrompt(activeMember), 900);
    }
}

// ============================================================
// CAMERA
// ============================================================

function updateCamera() {
    let targetX = player.x * TILE_SIZE - canvas.width / 2;
    let targetY = player.y * TILE_SIZE - canvas.height / 2;

    const maxCameraX = Math.max(0, getWorldWidth() - canvas.width);
    const maxCameraY = Math.max(0, getWorldHeight() - canvas.height);

    camera.x = Math.max(0, Math.min(maxCameraX, targetX));
    camera.y = Math.max(0, Math.min(maxCameraY, targetY));
}


// ============================================================
// RECOVERY / RESTORATION
// ============================================================

function restoreParty() {
    if (!gameState.party || gameState.party.length === 0) {
        showWorldMessage("You don't have any Entheon to restore yet.");
        return false;
    }

    let changed = false;

    gameState.party.forEach(member => {
        ensureCreatureProgressionData(member);
        if (member.currentHp !== member.maxHp) {
            member.currentHp = member.maxHp;
            changed = true;
        }
    });

    // Keep the active battle-facing references synchronized if a recovery
    // action is ever expanded to work from another UI in the future.
    const activeMember = gameState.party[gameState.activePartyIndex];
    if (activeMember) {
        gameState.starterData = activeMember;
        gameState.starter = activeMember.species;
    }

    renderParty();

    showWorldMessage(
        changed
            ? "Your Entheon have been fully restored. Everyone is ready for battle!"
            : "Your Entheon are already at full health."
    );

    return true;
}


// ============================================================
// INTERACTION
// ============================================================

function handleNpcInteraction(npc) {
    const interaction = npc.interaction || npc.type || "dialogue";

    switch (interaction) {
        case "restoration":
            restoreParty();
            return;

        case "starter":
            if (!gameState.starterAvailable) {
                showWorldMessage("The Entheon is waiting for the researcher to introduce you.");
                return;
            }

            if (gameState.starter) {
                showWorldMessage(`You already chose ${gameState.starter}.`);
                return;
            }

            openStarterDialogue(npc);
            return;

        case "professor":
        case "dialogue":
        case "merchant":
        case "trainer":
        default:
            openNpcDialogue(npc);
            return;
    }
}

function interact() {
    // NPC interaction is data-driven: each NPC declares an interaction type,
    // while this function only finds the nearest interactable character.
    const interactionRange = 1.35;

    const nearbyNpcs = getNpcs()
        .map(npc => ({
            npc,
            distance: Math.hypot(player.x - npc.x, player.y - npc.y)
        }))
        .filter(result => result.distance <= interactionRange)
        .sort((a, b) => a.distance - b.distance);

    if (nearbyNpcs.length > 0) {
        handleNpcInteraction(nearbyNpcs[0].npc);
        return;
    }

    // Doors and environmental objects still use the direction the player
    // is facing, so interaction with the world remains predictable.
    const facing = getFacingDirection();
    const targetX = Math.floor(player.x + facing.x);
    const targetY = Math.floor(player.y + facing.y);
    const tile = getTile(targetX, targetY);

    if (tile === TILE.DOOR) {
        enterBuildingAt(targetX, targetY);
        return;
    }

    showWorldMessage("There is nothing to interact with here.");
}


// ============================================================
// NPC DIALOGUE
// ============================================================

function openNpcDialogue(npc) {
    gameState.activeDialogue = npc;
    gameState.dialogueIndex = 0;

    // The researcher has been contacted, so the starter Entheon are now
    // available. This intentionally happens when the conversation starts,
    // rather than relying on the final dialogue keypress being registered.
    // It also makes the interaction robust if the player closes the dialogue
    // before advancing through every line.
    if ((npc.interaction || npc.type) === "professor") {
        gameState.starterAvailable = true;
    }

    npcDialogueName.textContent = npc.name;
    npcDialogue.classList.remove("hidden");

    updateNpcDialogueText();
}

function openStarterDialogue(npc) {
    // Starter NPCs are world objects, not the old intro-screen scene.
    // Use the same dialogue system as every other NPC and identify the
    // species directly from npc.species.
    gameState.activeDialogue = npc;
    gameState.dialogueIndex = 0;

    npcDialogueName.textContent = npc.name;
    npcDialogue.classList.remove("hidden");

    updateNpcDialogueText();
}

function updateNpcDialogueText() {
    const npc = gameState.activeDialogue;

    if (!npc) return;

    const lines = Array.isArray(npc.lines) && npc.lines.length
        ? npc.lines
        : ["..."];
    npcDialogueText.textContent = lines[Math.min(gameState.dialogueIndex, lines.length - 1)];
}

function advanceDialogue() {
    const npc = gameState.activeDialogue;

    if (!npc) return;

    gameState.dialogueIndex++;

    const lineCount = Array.isArray(npc.lines) ? npc.lines.length : 0;

    if (gameState.dialogueIndex >= lineCount) {
        if (npc.type === "starter" || npc.interaction === "starter") {
            const species = npc.species || npc.starterSpecies;
            closeNpcDialogue();
            showStarterConfirmation(species);
            return;
        }

        const interaction = npc.interaction || npc.type;
        closeNpcDialogue();

        // Completing the researcher/professor introduction unlocks the
        // three starter Entheon. The flag is deliberately set here, after
        // the final dialogue line, so merely approaching the NPC does not
        // count as having received the introduction.
        if (interaction === "professor") {
            gameState.starterAvailable = true;
            showWorldMessage("The researcher has introduced you. The three starter Entheon are ready for you to meet.");
        } else if (interaction === "trainer") {
            if (npc.battle) {
                startTrainerBattle(npc);
            } else {
                showWorldMessage("This trainer does not have a battle team yet.");
            }
        } else if (interaction === "merchant") {
            openMerchantShop(npc);
        }
        return;
    }

    updateNpcDialogueText();
}

function getVale() {
    return Math.max(0, Number(gameState.vale || 0));
}

function renderValeDisplays() {
    if (shopVale) shopVale.textContent = `${getVale().toLocaleString()} Vale`;
}

function getMerchantStock(npc) {
    const ids = npc?.shop?.inventory || Object.keys(gameState.shop?.stock || {});
    return ids.map(id => gameState.shop?.stock?.[id]).filter(Boolean);
}

function renderMerchantShop(npc) {
    if (!shopList) return;
    const stock = getMerchantStock(npc);
    renderValeDisplays();
    shopList.innerHTML = stock.length ? stock.map(item => {
        const owned = item.id === "capture"
            ? (getCrystalInventory()[item.id]?.quantity || 0)
            : (getItemInventory()[item.id]?.quantity || 0);
        const canBuy = getVale() >= item.price;
        return `
            <button type="button" class="shop-item" data-shop-item-id="${item.id}" ${canBuy ? "" : "disabled"}>
                <div class="shop-item-icon">${item.id === "capture" ? "◇" : "✦"}</div>
                <div class="shop-item-info">
                    <strong>${item.name}</strong>
                    <span>${item.description}</span>
                    <small>Carried: ×${owned}</small>
                </div>
                <div class="shop-item-price">${item.price.toLocaleString()} Vale</div>
            </button>
        `;
    }).join("") : '<div class="shop-empty">The merchant has nothing in stock right now.</div>';

    shopList.querySelectorAll("[data-shop-item-id]").forEach(button => {
        button.addEventListener("click", () => buyShopItem(button.dataset.shopItemId, npc));
    });
}

function openMerchantShop(npc) {
    if (!shopScreen) return;
    gameState.activeShopNpc = npc;
    renderMerchantShop(npc);
    shopScreen.classList.remove("hidden");
}

function closeMerchantShop() {
    if (shopScreen) shopScreen.classList.add("hidden");
    gameState.activeShopNpc = null;
}

function buyShopItem(itemId, npc = gameState.activeShopNpc) {
    const item = gameState.shop?.stock?.[itemId];
    if (!item || getVale() < item.price) return;

    gameState.vale -= item.price;

    if (itemId === "capture") {
        const crystals = getCrystalInventory();
        if (!crystals.capture) {
            crystals.capture = { id: "capture", name: "Capture Crystal", grade: "Capture", quantity: 0 };
        }
        crystals.capture.quantity++;
        gameState.captureDevices = getTotalCrystalCount();
    } else {
        const inventory = getItemInventory();
        if (!inventory[itemId]) {
            inventory[itemId] = {
                id: itemId,
                name: item.name,
                description: item.description,
                quantity: 0,
                kind: itemId === "recoveryTonic" ? "heal" : "revive",
                amount: itemId === "recoveryTonic" ? 25 : 0.5
            };
        }
        inventory[itemId].quantity++;
    }

    renderMerchantShop(npc);
    renderInventoryList();
    renderCrystalList();
    showWorldMessage(`You bought 1 ${item.name} for ${item.price.toLocaleString()} Vale.`);
}

function showStarterConfirmation(species) {
    gameState.activeDialogue = {
        id: "starter-confirmation",
        type: "starter-confirmation",
        name: species,
        lines: [`Would you like ${species} to become your first Entheon?`]
    };

    npcDialogueName.textContent = species;
    npcDialogueText.textContent = `Would you like ${species} to become your first Entheon?`;
    npcDialogue.classList.remove("hidden");

    const existing = npcDialogue.querySelector(".starter-choice-actions");
    existing?.remove();

    const actions = document.createElement("div");
    actions.className = "starter-choice-actions";
    actions.innerHTML = `
        <button class="option-button" type="button">Choose ${species}</button>
        <button class="option-button" type="button">Not yet</button>
    `;

    actions.children[0].addEventListener("click", () => {
        closeNpcDialogue();
        chooseStarter(species);
    });
    actions.children[1].addEventListener("click", () => closeNpcDialogue());

    npcDialogue.appendChild(actions);
}

function closeNpcDialogue() {
    gameState.activeDialogue = null;
    gameState.dialogueIndex = 0;
    npcDialogue.classList.add("hidden");
    npcDialogue.querySelector(".starter-choice-actions")?.remove();
}


// ============================================================
// DRAWING
// ============================================================

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));

    drawMap();
    drawNpcs();
    drawPlayer();

    ctx.restore();
}

function drawMap() {
    for (let y = 0; y < currentMap.data.length; y++) {
        for (let x = 0; x < currentMap.data[y].length; x++) {
            const tile = currentMap.data[y][x];
            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            drawTile(tile, px, py);
        }
    }
}

function drawTile(tile, x, y) {
    if (tile === TILE.GRASS) {
        ctx.fillStyle = "#68a85a";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#79b969";
        ctx.fillRect(x + 7, y + 8, 3, 3);
        ctx.fillRect(x + 22, y + 19, 3, 3);
    }

    else if (tile === TILE.TALL_GRASS) {
        ctx.fillStyle = "#4f963f";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "#2f7030";
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const bx = x + 5 + i * 5;
            ctx.beginPath();
            ctx.moveTo(bx, y + 25);
            ctx.lineTo(bx + 2, y + 10);
            ctx.stroke();
        }
    }

    else if (tile === TILE.PATH) {
        ctx.fillStyle = "#c8ad78";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#d7bf8d";
        ctx.fillRect(x + 5, y + 6, 3, 3);
        ctx.fillRect(x + 20, y + 20, 3, 3);
    }

    else if (tile === TILE.TREE) {
        ctx.fillStyle = "#3f7d43";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#276332";
        ctx.beginPath();
        ctx.arc(x + 16, y + 13, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#795333";
        ctx.fillRect(x + 13, y + 20, 6, 12);
    }

    else if (tile === TILE.WATER) {
        ctx.fillStyle = "#4c8fc2";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "#75b4dc";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x + 5, y + 12);
        ctx.lineTo(x + 13, y + 12);
        ctx.moveTo(x + 18, y + 22);
        ctx.lineTo(x + 27, y + 22);
        ctx.stroke();
    }

    else if (tile === TILE.WALL) {
        ctx.fillStyle = "#55535d";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "#696771";
        ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    }

    else if (tile === TILE.DOOR) {
        ctx.fillStyle = "#754d32";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#b9824e";
        ctx.fillRect(x + 5, y + 4, TILE_SIZE - 10, TILE_SIZE - 4);

        ctx.fillStyle = "#e0bd68";
        ctx.beginPath();
        ctx.arc(x + 22, y + 18, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawNpcs() {
    getNpcs().forEach(npc => {
        const px = npc.x * TILE_SIZE;
        const py = npc.y * TILE_SIZE;

        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(px, py + 9, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (npc.type === "starter") {
            ctx.fillStyle = npc.color;
            ctx.beginPath();
            ctx.arc(px, py - 4, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#222";
            ctx.fillRect(px - 5, py - 7, 3, 3);
            ctx.fillRect(px + 2, py - 7, 3, 3);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 10px Arial";
            ctx.textAlign = "center";
            ctx.fillText(npc.name, px, py - 22);
            return;
        }

        ctx.fillStyle = npc.color;
        ctx.fillRect(px - 9, py - 7, 18, 18);

        ctx.fillStyle = "#f0c6a4";
        ctx.beginPath();
        ctx.arc(px, py - 11, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#3c2a24";
        ctx.fillRect(px - 7, py - 19, 14, 5);

        ctx.fillStyle = "#222";
        ctx.fillRect(px - 4, py - 12, 2, 2);
        ctx.fillRect(px + 2, py - 12, 2, 2);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        const marker = npc.interaction === "merchant" ? "$" : npc.interaction === "trainer" ? "!" : "!";
        ctx.fillText(marker, px, py - 25);
    });
}

function drawPlayer() {
    const px = player.x * TILE_SIZE;
    const py = player.y * TILE_SIZE;

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(px, py + 9, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = gameState.gender === "girl" ? "#b24f83" : "#3559a8";
    ctx.fillRect(px - 9, py - 7, 18, 18);

    ctx.fillStyle = "#f0c6a4";
    ctx.beginPath();
    ctx.arc(px, py - 11, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4a3025";
    ctx.fillRect(px - 7, py - 19, 14, 5);

    ctx.fillStyle = "#222";
    ctx.fillRect(px - 4, py - 12, 2, 2);
    ctx.fillRect(px + 2, py - 12, 2, 2);
}

function showWorldMessage(message) {
    worldMessage.textContent = message;
    worldMessage.classList.remove("hidden");

    clearTimeout(showWorldMessage.timeout);

    showWorldMessage.timeout = setTimeout(() => {
        worldMessage.classList.add("hidden");
    }, 2500);
}


// ============================================================
// RESTART
// ============================================================

function restartGame() {
    gameState.mode = "intro";
    gameState.currentScene = "welcome";
    gameState.playerName = "";
    gameState.gender = null;
    gameState.starter = null;
    gameState.starterAvailable = false;
    gameState.starterData = null;
    gameState.party = [];
    gameState.activePartyIndex = 0;
    gameState.selectedPartyIndex = 0;
    gameState.captureDevices = 5;
    gameState.crystals = { capture: { id: "capture", name: "Capture Crystal", grade: "Capture", quantity: 5 } };
    gameState.items = {
        recoveryTonic: { id: "recoveryTonic", name: "Recovery Tonic", description: "Restores 25 HP to one Entheon.", quantity: 3, kind: "heal", amount: 25 },
        revivalTonic: { id: "revivalTonic", name: "Revival Tonic", description: "Revives a fainted Entheon at 50% of its maximum HP.", quantity: 1, kind: "revive", amount: 0.5 }
    };
    gameState.pendingItemId = null;
    gameState.inventoryBattleMode = false;
    gameState.activeDialogue = null;
    gameState.dialogueIndex = 0;
    gameState.currentMap = "town";
    gameState.transitionCooldown = 0;
    gameState.encounterCooldown = 0;
    gameState.battle = null;
    gameState.evolutionPromptOpen = false;

    const evolutionOverlay = document.getElementById("evolution-prompt-overlay");
    if (evolutionOverlay) evolutionOverlay.remove();

    // Reset world-state changes made during the previous playthrough.
    Object.values(maps).forEach(map => {
        (map.npcs || []).forEach(npc => {
            if (npc.type === "starter") npc.chosen = false;
        });
    });

    starterStatus.textContent = "Starter: —";
    areaStatus.textContent = "Westmere — Southern Settlement";

    npcDialogue.classList.add("hidden");
    overworldScreen.classList.add("hidden");
    introScreen.classList.remove("hidden");

    showWelcome();
}

function showWelcome() {
    gameState.mode = "intro";
    gameState.currentScene = "welcome";

    showScene(
        "Welcome to Kaleo",
        `
        <p>Your journey is about to begin.</p>
        <p>The world of Kaleo awaits.</p>
        `,
        [
            {
                text: "Begin your journey",
                action: showCharacterChoice
            }
        ]
    );
}


// ============================================================
// START
// ============================================================

showWelcome();