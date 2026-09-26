// ============================================================
// KALEO – WORLD OF ENTHEON
// Step 1: Intro + Playable 2D Overworld Prototype
// ============================================================

const gameState = {
    mode: "intro",
    currentScene: "welcome",
    playerName: "",
    starter: null
};


// ============================================================
// INTRO SCREEN
// ============================================================

const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const optionsContainer = document.getElementById("options");

const introScreen = document.getElementById("intro-screen");
const overworldScreen = document.getElementById("overworld-screen");
const starterStatus = document.getElementById("starter-status");
const worldMessage = document.getElementById("world-message");


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
// 2D OVERWORLD
// ============================================================

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;

const map = [
    "####################",
    "#..........#########",
    "#..TT......#########",
    "#..TT..GGG.........#",
    "#......GGG.........#",
    "#......GGG.........#",
    "#..................#",
    "#.....#####........#",
    "#.....#...#........#",
    "#.....#...#........#",
    "#.....#...#........#",
    "#.....#####........#",
    "#..................#",
    "#....WWWW..........#",
    "#....WWWW..........#",
    "#..................#",
    "#..........TT......#",
    "#..........TT......#",
    "#..................#",
    "####################"
];

const TILE = {
    GRASS: ".",
    TREE: "T",
    WATER: "W",
    PATH: "G",
    WALL: "#"
};

const player = {
    x: 2,
    y: 17,
    width: 20,
    height: 24,
    speed: 3
};

const keys = {};

let animationFrame = null;
let lastTime = 0;

document.addEventListener("keydown", event => {
    keys[event.key.toLowerCase()] = true;

    if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(event.key.toLowerCase())
    ) {
        event.preventDefault();
    }

    if (
        ["e", "enter", " "].includes(event.key.toLowerCase()) &&
        gameState.mode === "overworld"
    ) {
        interact();
    }
});

document.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});


function startOverworld() {
    gameState.mode = "overworld";
    gameState.currentScene = "overworld";

    introScreen.classList.add("hidden");
    overworldScreen.classList.remove("hidden");

    showWorldMessage(
        "Welcome to Kaleo. Explore the area and get used to moving around."
    );

    resizeCanvas();
    drawGame();

    cancelAnimationFrame(animationFrame);
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(gameLoop);
}


function resizeCanvas() {
    // Keep the internal game resolution fixed.
    // CSS handles the visual scaling.
}


function gameLoop(timestamp) {
    const delta = Math.min((timestamp - lastTime) / 16.67, 2);
    lastTime = timestamp;

    updatePlayer(delta);
    drawGame();

    animationFrame = requestAnimationFrame(gameLoop);
}


function updatePlayer(delta) {
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

    const newX = player.x + dx * player.speed * delta / TILE_SIZE;
    const newY = player.y + dy * player.speed * delta / TILE_SIZE;

    if (canMoveTo(newX, player.y)) {
        player.x = newX;
    }

    if (canMoveTo(player.x, newY)) {
        player.y = newY;
    }

    player.x = Math.max(0.55, Math.min(map[0].length - 1.55, player.x));
    player.y = Math.max(0.55, Math.min(map.length - 1.55, player.y));
}


function canMoveTo(x, y) {
    const radius = 0.28;

    const points = [
        [x - radius, y - radius],
        [x + radius, y - radius],
        [x - radius, y + radius],
        [x + radius, y + radius]
    ];

    return points.every(([px, py]) => {
        const tile = getTile(Math.floor(px), Math.floor(py));

        return tile !== TILE.WALL &&
               tile !== TILE.TREE &&
               tile !== TILE.WATER;
    });
}


function getTile(x, y) {
    if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) {
        return TILE.WALL;
    }

    return map[y][x];
}


function interact() {
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

    // Temporary interaction point in the center area.
    if (
        targetX >= 5 &&
        targetX <= 9 &&
        targetY >= 7 &&
        targetY <= 11
    ) {
        showWorldMessage(
            "This area will eventually contain a building or important location."
        );
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


function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawPlayer();
}


function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {

            const tile = map[y][x];
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
}


function drawPlayer() {
    const px = player.x * TILE_SIZE;
    const py = player.y * TILE_SIZE;

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(px, py + 9, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = "#3559a8";
    ctx.fillRect(px - 9, py - 7, 18, 18);

    // Head
    ctx.fillStyle = "#f0c6a4";
    ctx.beginPath();
    ctx.arc(px, py - 11, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#4a3025";
    ctx.fillRect(px - 7, py - 19, 14, 5);

    // Eyes
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

    starterStatus.textContent = "Starter: —";

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
