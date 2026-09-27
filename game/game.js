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
    captureDevices: 5,
    activeDialogue: null,
    dialogueIndex: 0,
    currentMap: "town",
    transitionCooldown: 0,
    encounterCooldown: 0,
    battle: null
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

    // Store the actual chosen Entheon outside the battle object so its HP
    // and future progression can persist from one encounter to the next.
    gameState.starterData = {
        species: name,
        level: speciesData.level,
        maxHp: speciesData.maxHp,
        currentHp: speciesData.maxHp,
        moves: speciesData.moves.map(move => ({ ...move }))
    };

    // Begin the party structure with the chosen starter. The active battle
    // system still uses starterData for now; the full party/switching system
    // will be layered on top of this later.
    gameState.party = [{
        species: name,
        level: speciesData.level,
        maxHp: speciesData.maxHp,
        currentHp: speciesData.maxHp,
        moves: speciesData.moves.map(move => ({ ...move }))
    }];

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
        name: "Kaleo",
        data: [
            "########################################",
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
                name: "Young Trainer",
                x: 22,
                y: 12,
                color: "#d26b6b",
                lines: [
                    "Hey! You're a new trainer too, right?",
                    "I've been exploring the area around town.",
                    "Maybe we'll meet again when we're both a little stronger."
                ]
            },
            {
                id: "resident",
                name: "Kaleo Resident",
                x: 27,
                y: 21,
                color: "#6b9ed2",
                lines: [
                    "The paths around Kaleo connect to places far beyond this area.",
                    "You should talk to people whenever you visit a new settlement.",
                    "You never know what you might learn."
                ]
            }
        ]
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
        exit: { x: 10, y: 10, targetMap: "town", targetX: 20, targetY: 7 },
        npcs: [
            {
                id: "researcher",
                type: "researcher",
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
    return currentMap.npcs.filter(npc => !npc.chosen);
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

    loadMap("town", 4, 25);

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

    if (spawnX !== null) player.x = spawnX;
    if (spawnY !== null) player.y = spawnY;

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
    const maxY = getMapHeight() - 1.55;

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
    const tileX = Math.floor(player.x);
    const tileY = Math.floor(player.y);
    const tile = getTile(tileX, tileY);

    if (tile !== TILE.DOOR) {
        return;
    }

    if (gameState.currentMap === "town") {
        transitionTo(
            "research_center",
            12,
            9,
            "You enter the Entheon Research Center."
        );
        return;
    }

    if (gameState.currentMap === "research_center") {
        // The Research Center door is at town tile (19, 7).
        // The tile immediately to its right, (20, 7), is outside the building.
        // Use the map's exit data as the single source of truth.
        const exit = currentMap.exit;

        if (exit) {
            transitionTo(
                exit.targetMap,
                exit.targetX,
                exit.targetY,
                "You step back outside into Kaleo."
            );
        }
    }
}


// ============================================================
// WILD ENCOUNTERS + BATTLE SYSTEM
// ============================================================

const speciesBattleData = {
    // Starter moves currently unlocked at Level 5.
    // These follow the established species move pools.
    Nimblet: {
        level: 5,
        maxHp: 40,
        moves: [
            { name: "Tackle", category: "Physical", power: 40, damage: 7, effect: "—" },
            { name: "Scratch", category: "Physical", power: 40, damage: 8, effect: "—" },
            { name: "Quick Attack", category: "Physical", power: 40, damage: 7, effect: "Priority attack" }
        ]
    },
    Pipiri: {
        level: 5,
        maxHp: 40,
        moves: [
            { name: "Tackle", category: "Physical", power: 40, damage: 7, effect: "—" },
            { name: "Water Pulse", category: "Special", power: 60, damage: 10, effect: "Chance to Confuse" },
            { name: "Aqua Jet", category: "Physical", power: 40, damage: 7, effect: "Priority attack" }
        ]
    },
    Morrowe: {
        level: 5,
        maxHp: 40,
        moves: [
            { name: "Scratch", category: "Physical", power: 40, damage: 8, effect: "—" },
            { name: "Bite", category: "Physical", power: 60, damage: 10, effect: "Chance to Flinch" },
            { name: "Shadow Claw", category: "Physical", power: 55, damage: 11, effect: "Increased critical-hit chance" }
        ]
    },
    Orrin: {
        level: 3,
        maxHp: 30,
        moves: [
            { name: "Tackle", category: "Physical", power: 40, damage: 5, effect: "—" },
            { name: "Scratch", category: "Physical", power: 40, damage: 5, effect: "—" }
        ]
    },
    Brindlew: {
        level: 3,
        maxHp: 32,
        moves: [
            { name: "Tackle", category: "Physical", power: 40, damage: 5, effect: "—" },
            { name: "Scratch", category: "Physical", power: 40, damage: 5, effect: "—" }
        ]
    }
};

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
    runButton: document.getElementById("battle-run")
};

battleUI.fightButton.addEventListener("click", () => {
    const battle = gameState.battle;
    if (!battle || battle.locked || !battle.playerTurn || battle.wild.hp <= 0) return;

    battle.showMoves = true;
    renderBattle();
});

battleUI.captureButton.addEventListener("click", battleCapture);
battleUI.runButton.addEventListener("click", battleRun);


function renderParty() {
    if (!gameUI.partyPanel || !gameUI.partyList) return;

    if (!gameState.party || gameState.party.length === 0) {
        gameUI.partyPanel.classList.add("hidden");
        gameUI.partyList.innerHTML = "";
        return;
    }

    gameUI.partyPanel.classList.remove("hidden");
    gameUI.partyList.innerHTML = gameState.party.map((member, index) => {
        const hp = Math.max(0, member.currentHp);
        const maxHp = Math.max(1, member.maxHp);
        const hpPercent = Math.max(0, Math.min(100, hp / maxHp * 100));

        return `
            <div class="party-member${index === 0 ? " active" : ""}${hp <= 0 ? " fainted" : ""}">
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
                </div>
            </div>`;
    }).join("");
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

    const playerData = gameState.starterData;
    const wildLevel = randomInt(encounter.minLevel, encounter.maxLevel);

    gameState.mode = "battle";

    gameState.battle = {
        player: {
            name: gameState.starter,
            level: playerData.level,
            hp: playerData.currentHp,
            maxHp: playerData.maxHp,
            moves: playerData.moves
        },
        wild: {
            name: wildSpecies,
            level: wildLevel,
            hp: calculateScaledHp(wildData.maxHp, wildData.level, wildLevel),
            maxHp: calculateScaledHp(wildData.maxHp, wildData.level, wildLevel),
            moves: wildData.moves
        },
        playerTurn: true,
        locked: false,
        showMoves: false
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

    battleUI.captureButton.disabled =
        battle.locked ||
        !battle.playerTurn ||
        battle.wild.hp <= 0 ||
        gameState.captureDevices <= 0;

    battleUI.captureButton.textContent =
        `Capture (${gameState.captureDevices})`;

    battleUI.runButton.disabled = battle.locked || !battle.playerTurn;
}

function useMove(move) {
    const battle = gameState.battle;
    if (!battle || !battle.playerTurn || battle.locked || battle.wild.hp <= 0) return;

    battle.locked = true;
    battle.showMoves = false;

    const damage = move.damage;
    battle.wild.hp = Math.max(0, battle.wild.hp - damage);

    if (battle.wild.hp <= 0) {
        renderBattle(
            `${battle.player.name} used ${move.name}! The wild ${battle.wild.name} was defeated!`
        );

        setTimeout(() => endWildEncounter("The battle is over."), 1100);
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

    const move = battle.wild.moves[
        Math.floor(Math.random() * battle.wild.moves.length)
    ];

    const damage = move.damage;
    battle.player.hp = Math.max(0, battle.player.hp - damage);

    if (battle.player.hp <= 0) {
        renderBattle(
            `The wild ${battle.wild.name} used ${move.name}! ${battle.player.name} fainted!`
        );

        setTimeout(() => endWildEncounter(`${battle.player.name} needs to recover.`), 1100);
        return;
    }

    battle.playerTurn = true;
    battle.locked = false;
    battle.showMoves = false;

    renderBattle(
        `The wild ${battle.wild.name} used ${move.name}! It dealt ${damage} damage.`
    );
}

function calculateCaptureChance(battle) {
    // Prototype capture formula. This is deliberately simple for now and will
    // be replaced when the full item/stat system is implemented.
    const hpRatio = battle.wild.hp / battle.wild.maxHp;
    const missingHp = 1 - hpRatio;

    // 20% at full HP, rising to 85% at 0 HP.
    return Math.min(0.85, Math.max(0.20, 0.20 + missingHp * 0.65));
}

function battleCapture() {
    const battle = gameState.battle;

    if (
        !battle ||
        battle.locked ||
        !battle.playerTurn ||
        battle.wild.hp <= 0 ||
        gameState.captureDevices <= 0
    ) {
        return;
    }

    battle.locked = true;
    battle.showMoves = false;
    gameState.captureDevices--;

    const chance = calculateCaptureChance(battle);
    const success = Math.random() < chance;

    if (success) {
        const captured = {
            species: battle.wild.name,
            level: battle.wild.level,
            maxHp: battle.wild.maxHp,
            currentHp: battle.wild.hp,
            moves: battle.wild.moves.map(move => ({ ...move }))
        };

        gameState.party.push(captured);
        renderParty();

        renderBattle(
            `You captured ${battle.wild.name}! It has been added to your party.`
        );

        setTimeout(() => {
            endWildEncounter(
                `${battle.wild.name} joined your party. Capture devices remaining: ${gameState.captureDevices}.`
            );
        }, 1100);

        return;
    }

    renderBattle(
        `The capture failed! ${battle.wild.name} broke free.`
    );

    setTimeout(wildBattleAttack, 750);
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
    // Preserve the starter's HP between encounters. If it fainted, restore
    // it for now so the prototype cannot leave the player permanently stuck.
    if (gameState.battle?.player && gameState.starterData) {
        gameState.starterData.currentHp = gameState.battle.player.hp;

        if (gameState.starterData.currentHp <= 0) {
            gameState.starterData.currentHp = gameState.starterData.maxHp;
        }

        if (gameState.party[0]) {
            gameState.party[0].currentHp = gameState.starterData.currentHp;
        }
        renderParty();
    }

    gameState.mode = "overworld";
    gameState.battle = null;
    gameState.encounterCooldown = 1500;

    battleScreen.classList.add("hidden");
    overworldScreen.classList.remove("hidden");

    showWorldMessage(message);
    drawGame();
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
// INTERACTION
// ============================================================

function interact() {
    // NPCs can be spoken to from any direction. Find the closest NPC
    // within interaction range instead of requiring the player to face them.
    const interactionRange = 1.35;

    const nearbyNpcs = getNpcs()
        .map(npc => ({
            npc,
            distance: Math.hypot(player.x - npc.x, player.y - npc.y)
        }))
        .filter(result => result.distance <= interactionRange)
        .sort((a, b) => a.distance - b.distance);

    if (nearbyNpcs.length > 0) {
        const npc = nearbyNpcs[0].npc;

        if (npc.type === "researcher") {
            openNpcDialogue(npc);
            gameState.starterAvailable = true;
            return;
        }

        if (npc.type === "starter") {
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
        }

        openNpcDialogue(npc);
        return;
    }

    // Doors and environmental objects still use the direction the player
    // is facing, so interaction with the world remains predictable.
    const facing = getFacingDirection();
    const targetX = Math.floor(player.x + facing.x);
    const targetY = Math.floor(player.y + facing.y);

    const tile = getTile(targetX, targetY);

    if (tile === TILE.TREE) {
        showWorldMessage("A tree blocks your path.");
        return;
    }

    if (tile === TILE.WATER) {
        showWorldMessage("The water is too deep to cross.");
        return;
    }

    if (tile === TILE.DOOR) {
        if (gameState.currentMap === "town") {
            showWorldMessage("The entrance leads into the Entheon Research Center.");
        } else {
            showWorldMessage("The exit leads back into Kaleo.");
        }
        return;
    }

    showWorldMessage("There is nothing to interact with here.");
}

function getFacingDirection() {
    if (keys["arrowup"] || keys["w"]) return { x: 0, y: -1 };
    if (keys["arrowdown"] || keys["s"]) return { x: 0, y: 1 };
    if (keys["arrowleft"] || keys["a"]) return { x: -1, y: 0 };

    return { x: 1, y: 0 };
}


function openStarterDialogue(starterNpc) {
    gameState.activeDialogue = {
        id: starterNpc.id,
        type: "starter",
        name: starterNpc.name,
        lines: starterNpc.lines,
        starterSpecies: starterNpc.species
    };
    gameState.dialogueIndex = 0;

    npcDialogueName.textContent = starterNpc.name;
    npcDialogue.classList.remove("hidden");
    updateNpcDialogueText();
}

// ============================================================
// NPC DIALOGUE
// ============================================================

function openNpcDialogue(npc) {
    gameState.activeDialogue = npc;
    gameState.dialogueIndex = 0;

    npcDialogueName.textContent = npc.name;
    npcDialogue.classList.remove("hidden");

    updateNpcDialogueText();
}

function updateNpcDialogueText() {
    const npc = gameState.activeDialogue;

    if (!npc) return;

    npcDialogueText.textContent = npc.lines[gameState.dialogueIndex];
}

function advanceDialogue() {
    const npc = gameState.activeDialogue;

    if (!npc) return;

    gameState.dialogueIndex++;

    if (gameState.dialogueIndex >= npc.lines.length) {
        if (npc.type === "starter") {
            const species = npc.starterSpecies;
            closeNpcDialogue();
            showStarterConfirmation(species);
            return;
        }

        closeNpcDialogue();
        return;
    }

    updateNpcDialogueText();
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
        ctx.fillText("!", px, py - 25);
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
    gameState.captureDevices = 5;
    gameState.activeDialogue = null;
    gameState.dialogueIndex = 0;
    gameState.currentMap = "town";
    gameState.transitionCooldown = 0;
    gameState.encounterCooldown = 0;
    gameState.battle = null;

    // Reset world-state changes made during the previous playthrough.
    Object.values(maps).forEach(map => {
        map.npcs.forEach(npc => {
            if (npc.type === "starter") npc.chosen = false;
        });
    });

    starterStatus.textContent = "Starter: —";
    areaStatus.textContent = "Kaleo";

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