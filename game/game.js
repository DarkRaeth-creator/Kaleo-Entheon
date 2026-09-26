// ============================================================
// KALEO – WORLD OF ENTHEON
// Step 4: Buildings + Interior Maps + Map Transitions
// ============================================================

const gameState = {
    mode: "intro",
    currentScene: "welcome",
    playerName: "",
    starter: null,
    activeDialogue: null,
    dialogueIndex: 0,
    currentMap: "town",
    transitionCooldown: 0
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
    gameState.currentScene = "opening";

    showScene(
        "Kaleo",
        `
        <p>You have arrived in Kaleo.</p>
        <p>Today is the beginning of your journey.</p>
        <p>The world of Kaleo awaits.</p>
        `,
        [
            { text: "Begin", action: showArrival }
        ]
    );
}

function showArrival() {
    gameState.currentScene = "arrival";

    showScene(
        "Arrival",
        `
        <p>
        You stand at the beginning of a journey into a world
        filled with unexplored regions, settlements, forests,
        mountains, rivers and the creatures known as Entheon.
        </p>
        <p>Somewhere ahead lies the path you have chosen to follow.</p>
        `,
        [
            { text: "Continue", action: showResearchCenter }
        ]
    );
}

function showResearchCenter() {
    gameState.currentScene = "research-center";

    showScene(
        "Entheon Research and Training Center",
        `
        <p>
        You stand inside the local Entheon Research and Training Center.
        </p>
        <p>
        Around you are displays, research equipment and information
        about the creatures that inhabit Kaleo.
        </p>
        <p>Beyond the large windows lies the world outside.</p>
        <p>Your journey is about to truly begin.</p>
        `,
        [
            { text: "Continue", action: showStarterIntroduction }
        ]
    );
}

function showStarterIntroduction() {
    gameState.currentScene = "starter-introduction";

    showScene(
        "Your First Entheon",
        `
        <p>
        Before you can begin exploring Kaleo, there is one important
        decision you must make.
        </p>
        <p>You must choose your first Entheon.</p>
        <p>
        Several young Entheon have been selected as suitable
        companions for new trainers.
        </p>
        <p>Each one is different.</p>
        <p>
        Your first companion will be the beginning of your own story in Kaleo.
        </p>
        `,
        [
            { text: "Meet the starters", action: showStarterSelection }
        ]
    );
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
    gameState.starter = name;
    starterStatus.textContent = "Starter: " + name;

    showScene(
        "A New Partnership",
        `
        <p>You have chosen <strong>${name}</strong>.</p>
        <p>
        This Entheon will accompany you as you begin your journey through Kaleo.
        </p>
        <p>Your adventure begins now.</p>
        `,
        [
            { text: "Enter Kaleo", action: startOverworld }
        ]
    );
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
    DOOR: "D"
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
            "#.............#####D..................#",
            "#.............#...#...................#",
            "#.............#...#...................#",
            "#.............#####...................#",
            "#......................................#",
            "#......................................#",
            "#....WWWW..............................#",
            "#....WWWW..............................#",
            "#....WWWW..............TT.............#",
            "#......................TT.............#",
            "#......................................#",
            "#................GGGG..................#",
            "#................GGGG..................#",
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
        spawn: { x: 10, y: 8 },
        exit: { x: 10, y: 10, targetMap: "town", targetX: 15, targetY: 8 },
        npcs: [
            {
                id: "researcher",
                name: "Researcher",
                x: 6,
                y: 4,
                color: "#8b6bbd",
                lines: [
                    "Welcome to the Entheon Research Center.",
                    "There is still much we do not know about the Entheon of Kaleo.",
                    "Take your time and explore. Your journey has only just begun."
                ]
            },
            {
                id: "assistant",
                name: "Research Assistant",
                x: 14,
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
    speed: 3
};

const camera = {
    x: 0,
    y: 0
};


// ============================================================
// CURRENT MAP NPCS
// ============================================================

function getNpcs() {
    return currentMap.npcs;
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

    loadMap("town", 4, 25);

    introScreen.classList.add("hidden");
    overworldScreen.classList.remove("hidden");

    showWorldMessage(
        "Welcome to Kaleo. Explore the area and talk to people with E."
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
            10,
            8,
            "You enter the Entheon Research Center."
        );
        return;
    }

    if (gameState.currentMap === "research_center") {
        transitionTo(
            "town",
            15,
            8,
            "You step back outside into Kaleo."
        );
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
// INTERACTION
// ============================================================

function interact() {
    const facing = getFacingDirection();

    const targetX = Math.floor(player.x + facing.x);
    const targetY = Math.floor(player.y + facing.y);

    const npc = getNpcs().find(character => {
        return Math.abs(character.x - targetX) <= 0.5 &&
               Math.abs(character.y - targetY) <= 0.5;
    });

    if (npc) {
        openNpcDialogue(npc);
        return;
    }

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
        closeNpcDialogue();
        return;
    }

    updateNpcDialogueText();
}

function closeNpcDialogue() {
    gameState.activeDialogue = null;
    gameState.dialogueIndex = 0;
    npcDialogue.classList.add("hidden");
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

    ctx.fillStyle = "#3559a8";
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
    gameState.starter = null;
    gameState.activeDialogue = null;
    gameState.dialogueIndex = 0;
    gameState.currentMap = "town";
    gameState.transitionCooldown = 0;

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
                action: showOpening
            }
        ]
    );
}


// ============================================================
// START
// ============================================================

showWelcome();
