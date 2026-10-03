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
    playerCustomization: {
        hair: "blond",
        eyes: "amber",
        outfit: "default"
    },
    starter: null,
    starterAvailable: false,
    starterData: null,
    party: [],
    activePartyIndex: 0,
    selectedPartyIndex: 0,
    captureDevices: 5,
    vale: 1500,
    badges: [],
    crystals: {
        capture: { id: "capture", name: "Capture Crystal", grade: "Capture", quantity: 5 }
    },
    items: {
        basicRestore: { id: "basicRestore", name: "Basic Restore", description: "A field restorative for minor injuries. (Prototype: restores 25 HP.)", quantity: 3, kind: "heal", amount: 25 },
        revitalizingElixir: { id: "revitalizingElixir", name: "Revitalizing Elixir", description: "A specialized restorative for an exhausted Entheon. (Prototype: revives at 50% HP.)", quantity: 1, kind: "revive", amount: 0.5 },
        greaterRestore: { id: "greaterRestore", name: "Greater Restore", description: "A stronger restorative for more serious injuries. (Prototype: restores 60 HP.)", quantity: 0, kind: "heal", amount: 60 }
    },
    shop: {
        merchantId: "travelling-merchant",
        stock: {
            basicRestore: { id: "basicRestore", name: "Basic Restore", description: "A field restorative for minor injuries. (Prototype: restores 25 HP.)", price: 100 },
            greaterRestore: { id: "greaterRestore", name: "Greater Restore", description: "A stronger restorative for more serious injuries. (Prototype: restores 60 HP.)", price: 220 },
            revitalizingElixir: { id: "revitalizingElixir", name: "Revitalizing Elixir", description: "A specialized restorative for an exhausted Entheon. (Prototype: revives at 50% HP.)", price: 350 },
            capture: { id: "capture", name: "Capture Crystal", description: "Standard crystal used for Entheon resonance and capture.", price: 150 }
        }
    },
    pendingItemId: null,
    partyScreenBattleMode: false,
    partyScreenForced: false,
    activeDialogue: null,
    dialogueIndex: 0,
    currentMap: "town",
    ferryReturnMap: null,
    ferryReturnX: null,
    ferryReturnY: null,
    transitionCooldown: 0,
    encounterCooldown: 0,
    battle: null,
    trainerBattle: null,
    evolutionPromptOpen: false,
    collectedItems: {},
    entheonDirectory: { seen: {}, captured: {} }
};


// ============================================================
// SCREEN ELEMENTS
// ============================================================

const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const optionsContainer = document.getElementById("options");
const characterCreationScreen = document.getElementById("character-creation-screen");

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
const menuButton = document.getElementById("menu-button");
const gameMenu = document.getElementById("game-menu");
const menuCloseButton = document.getElementById("menu-close-button");
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
const badgeButton = document.getElementById("badge-button");
const badgeScreen = document.getElementById("badge-screen");
const badgeCloseButton = document.getElementById("badge-close-button");
const badgeList = document.getElementById("badge-list");
const badgeStatus = document.getElementById("badge-status");
const directoryButton = document.getElementById("directory-button");
const directoryScreen = document.getElementById("directory-screen");
const directoryCloseButton = document.getElementById("directory-close-button");
const directoryList = document.getElementById("directory-list");
const directoryDetail = document.getElementById("directory-detail");
const directorySummary = document.getElementById("directory-summary");
const shopScreen = document.getElementById("shop-screen");
const shopList = document.getElementById("shop-list");
const shopVale = document.getElementById("shop-vale");
const shopCloseButton = document.getElementById("shop-close-button");
const worldMapScreen = document.getElementById("world-map-screen");
const worldMapButton = document.getElementById("world-map-button");
const appearanceButton = document.getElementById("appearance-button");
const saveGameButton = document.getElementById("save-game-button");
const worldMapCloseButton = document.getElementById("world-map-close-button");
const worldMapLocation = document.getElementById("world-map-location");
const worldMapCurrentName = document.getElementById("world-map-current-name");
const worldMapCurrentRegion = document.getElementById("world-map-current-region");
const worldMapRouteName = document.getElementById("world-map-route-name");
const worldMapRouteDirection = document.getElementById("world-map-route-direction");
const worldMapConnections = document.getElementById("world-map-connections");
const worldMapMarkers = document.getElementById("world-map-markers");
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
    showCharacterCreation();
}

// ============================================================
// PLAYER ART CONFIGURATION — CURRENT SIMPLIFIED PRODUCTION SET
// ============================================================
// There is currently one approved appearance per gender. The four
// directional 256×96 sheets are the complete production assets.
// Keeping this configuration inside game.js avoids a missing external
// config file breaking character creation.
const KALEO_PLAYER_CONFIG = {
    assetRoot: "images/Player",
    worldFrame: { width: 48, height: 72, footOffset: 4 },
    male: {
        default: { hair: "blond", eyes: "amber", outfit: "default" },
        hair: [{ id: "blond", label: "Blond" }],
        eyes: [{ id: "amber", label: "Amber" }],
        outfits: [{ id: "default", label: "Academy" }]
    },
    female: {
        default: { hair: "brown", eyes: "brown", outfit: "default" },
        hair: [{ id: "brown", label: "Brown" }],
        eyes: [{ id: "brown", label: "Brown" }],
        outfits: [{ id: "default", label: "Academy" }]
    }
};

// Expose the config for any existing code that reads it from window.
window.KALEO_PLAYER_CONFIG = KALEO_PLAYER_CONFIG;

function getCharacterConfig() {
    return KALEO_PLAYER_CONFIG;
}

const playerAssetCache = new Map();
const playerPreviewTimers = new WeakMap();

// Persistent player save data. Only stable gameplay state is serialized;
// transient battle/UI state is intentionally excluded.
const KALEO_SAVE_KEY = "kaleo_world_of_entheon_save_v1";
let appearanceEditing = false;
let appearanceReturnContext = null;

function getPlayerVisualSelection() {
    const gender = gameState.gender === "girl" ? "female" : "male";
    const config = getCharacterConfig();
    const data = config[gender];
    const defaults = data.default || {};
    const choice = gameState.playerCustomization || {};
    return {
        gender,
        hair: choice.hair || defaults.hair,
        eyes: choice.eyes || defaults.eyes,
        outfit: choice.outfit || defaults.outfit
    };
}

function playerAssetKey(direction = "down") {
    const c = getPlayerVisualSelection();
    return `${c.gender}|${direction}|${c.hair}|${c.eyes}|${c.outfit}`;
}

// Production player artwork is deliberately loaded as a single, complete
// 256×96 sheet.  We do NOT fall back to old naming conventions or layered
// prototype assets: doing that can silently mix an old sprite with a new one
// (which is exactly what caused the hair/outfit bleed and wrong UP sprite).
const PLAYER_ASSET_VERSION = "20261003-sprite-single-default-v1";

function imageCandidates(paths) {
    return [...new Set(paths.filter(Boolean))];
}

function getPlayerAssetRoots() {
    const configured = String(getCharacterConfig()?.assetRoot || "images/player").replace(/\/$/, "");
    // GitHub Pages is case-sensitive.  Keep the configured path first, then
    // support the two folder-capitalisation variants used during migration.
    return imageCandidates([
        configured,
        "images/player",
        "images/Player",
        "Images/player",
        "Images/Player"
    ]);
}

function combinedPlayerCandidates(direction, c) {
    // CURRENT PRODUCTION MODE: one approved default sprite set per gender.
    // IMPORTANT: these are the ACTUAL filenames in the repository.
    //   male_academy_default_down.png
    //   male_academy_default_left.png
    //   male_academy_default_right.png
    //   male_academy_default_up.png
    // and the equivalent female_academy_default_* files.
    // Do not fall back to the old hair/eyes/outfit naming convention.
    const genderPrefix = c.gender === "female" ? "female" : "male";
    const filename = `${genderPrefix}_academy_default_${direction}`;
    return imageCandidates(
        getPlayerAssetRoots().flatMap(root => [
            `${root}/${c.gender}/${filename}.png`,
            `${root}/${c.gender}/${filename}.PNG`
        ])
    );
}

function addAssetVersion(src) {
    if (!src) return src;
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}v=${PLAYER_ASSET_VERSION}`;
}

function loadImageCandidates(paths) {
    return new Promise(resolve => {
        const candidates = [...paths];
        const tryNext = () => {
            if (!candidates.length) {
                resolve(null);
                return;
            }

            const rawSrc = candidates.shift();
            const src = addAssetVersion(rawSrc);
            const image = new Image();
            image.decoding = "async";
            image.onload = () => {
                // Production player sheets must be exactly 256×96.  Reject
                // old 128×48/other prototype files instead of displaying them.
                if (image.naturalWidth === 256 && image.naturalHeight === 96) {
                    image.dataset.kaleoAssetSource = rawSrc;
                    resolve(image);
                } else {
                    console.warn(
                        `Rejected non-production player sheet (${image.naturalWidth}×${image.naturalHeight}):`,
                        rawSrc
                    );
                    tryNext();
                }
            };
            image.onerror = () => {
                tryNext();
            };
            image.src = src;
        };
        tryNext();
    });
}

function getPlayerAsset(direction = "down") {
    const key = playerAssetKey(direction);
    if (playerAssetCache.has(key)) return playerAssetCache.get(key);

    const pending = {
        state: "loading",
        image: null,
        layers: null,
        promise: null
    };
    playerAssetCache.set(key, pending);

    const c = getPlayerVisualSelection();
    const candidates = combinedPlayerCandidates(direction, c);

    pending.promise = loadImageCandidates(candidates).then(image => {
        if (image) {
            pending.state = "ready";
            pending.image = image;
        } else {
            pending.state = "missing";
            console.error(
                "Kaleo production player sprite missing:",
                `${c.gender}/${c.gender === "female" ? "female" : "male"}_academy_default_${direction}.png`,
                "Checked roots:",
                getPlayerAssetRoots()
            );
        }
        return pending;
    });

    return pending;
}

function getSheetMetrics(image) {
    const width = image?.naturalWidth || 0;
    const height = image?.naturalHeight || 0;
    if (!width || !height) return null;

    // KALEO PRODUCTION STANDARD:
    // 256×96 PNG = four 64×96 animation frames horizontally.
    if (width === 256 && height === 96) {
        return {
            width: 64,
            height: 96,
            columns: 4,
            rows: 1,
            directionRows: { down: 0, left: 0, right: 0, up: 0 },
            production: true
        };
    }

    return null;
}

function getPlayerFrameCount(image) {
    return getSheetMetrics(image)?.columns || 4;
}

function drawPlayerSheet(image, frameIndex, x, y, width, height, direction = "down") {
    const metrics = getSheetMetrics(image);
    if (!metrics) return false;

    const sourceFrame = Math.min(metrics.columns - 1, Math.max(0, frameIndex));
    const row = metrics.directionRows?.[direction] ?? 0;

    ctx.drawImage(
        image,
        sourceFrame * metrics.width,
        row * metrics.height,
        metrics.width,
        metrics.height,
        Math.round(x),
        Math.round(y),
        Math.round(width),
        Math.round(height)
    );
    return true;
}

function makeSpritePreview(path, className = "") {
    const wrapper = document.createElement("div");
    wrapper.className = `cc-sprite-preview ${className}`.trim();

    const canvas = document.createElement("canvas");
    canvas.width = className.includes("cc-large-sprite") ? 160 : 116;
    canvas.height = className.includes("cc-large-sprite") ? 190 : 82;
    canvas.className = "cc-sprite-preview-canvas";
    canvas.setAttribute("aria-hidden", "true");
    wrapper.appendChild(canvas);

    const renderImage = image => {
        if (!image) return;
        let frame = 0;
        const draw = () => {
            const c = canvas.getContext("2d");
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.imageSmoothingEnabled = false;
            const metrics = getSheetMetrics(image);
            if (metrics) {
                const maxScale = className.includes("cc-large-sprite") ? 1.5 : 0.72;
                const scale = Math.min(
                    maxScale,
                    canvas.height / metrics.height,
                    canvas.width / metrics.width
                );
                const w = metrics.width * scale;
                const h = metrics.height * scale;
                c.drawImage(
                    image,
                    frame * metrics.width,
                    0,
                    metrics.width,
                    metrics.height,
                    (canvas.width - w) / 2,
                    canvas.height - h,
                    w,
                    h
                );
            }
        };
        draw();
        const timer = setInterval(() => {
            frame = (frame + 1) % getPlayerFrameCount(image);
            draw();
        }, 130);
        playerPreviewTimers.set(wrapper, timer);
    };

    if (Array.isArray(path)) {
        loadImageCandidates(path).then(renderImage);
    } else {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => renderImage(image);
        image.src = path;
    }
    return wrapper;
}

function playerAssetPath(direction = "down") {
    const c = getPlayerVisualSelection();
    const genderPrefix = c.gender === "female" ? "female" : "male";
    return `${getCharacterConfig().assetRoot}/${c.gender}/${genderPrefix}_academy_default_${direction}.png`;
}

function characterPreviewAsset(category, value) {
    const c = getPlayerVisualSelection();
    const genderPrefix = c.gender === "female" ? "female" : "male";
    return `${getCharacterConfig().assetRoot}/${c.gender}/${genderPrefix}_academy_default_down.png`;
}

function renderCharacterCreation() {
    if (!characterCreationScreen) return;

    const config = getCharacterConfig();
    const gender = gameState.gender === "girl" ? "female" : "male";
    const data = config[gender];
    const current = gameState.playerCustomization;

    characterCreationScreen.innerHTML = `
        <div class="cc-shell">
            <div class="cc-header">
                <div>
                    <div class="cc-kicker">KALEO · WORLD OF ENTHEON</div>
                    <h1>Character Creation</h1>
                    <p>Choose the Trainer who will accompany you through Kaleo.</p>
                </div>
                <div class="cc-header-badge"><strong>01</strong><span>APPEARANCE</span></div>
            </div>

            <div class="cc-body">
                <aside class="cc-steps">
                    <div class="cc-step-item active"><b>1</b><span>Appearance<small>Customise your look</small></span></div>
                    <div class="cc-step-item"><b>2</b><span>Name<small>Choose your name</small></span></div>
                    <div class="cc-step-item"><b>3</b><span>Begin<small>Start your adventure</small></span></div>
                </aside>

                <section class="cc-preview-panel">
                    <div class="cc-panel-title">Preview</div>
                    <div class="cc-preview-stage"><div id="cc-large-preview"></div></div>
                    <div class="cc-preview-caption">
                        <strong>${gender === "female" ? "Female" : "Male"} Trainer</strong>
                        <span>4-direction · 4-frame walking animation</span>
                    </div>
                </section>

                <section class="cc-options-panel">
                    <div class="cc-gender-toggle">
                        <button type="button" data-gender="boy" class="${gender === "male" ? "selected" : ""}">♂&nbsp; Male</button>
                        <button type="button" data-gender="girl" class="${gender === "female" ? "selected" : ""}">♀&nbsp; Female</button>
                    </div>

                    <div class="cc-option-section">
                        <div class="cc-section-heading"><span>Hair Colour</span><small>Choose your hair</small></div>
                        <div class="cc-option-grid" id="cc-hair-options"></div>
                    </div>

                    <div class="cc-option-section">
                        <div class="cc-section-heading"><span>Eye Colour</span><small>Choose your eyes</small></div>
                        <div class="cc-option-grid" id="cc-eye-options"></div>
                    </div>

                    <div class="cc-option-section">
                        <div class="cc-section-heading"><span>Outfit</span><small>Choose your style</small></div>
                        <div class="cc-option-grid" id="cc-outfit-options"></div>
                    </div>

                    <div class="cc-name-row">
                        <label for="cc-name">Character Name</label>
                        <div class="cc-name-input-wrap">
                            <input id="cc-name" maxlength="12" autocomplete="off" value="${escapeHtml(gameState.playerName)}" placeholder="Enter your name">
                            <button type="button" id="cc-random-name" title="Randomize name">✦</button>
                        </div>
                    </div>
                </section>
            </div>

            <div class="cc-footer">
                <span><i>◆</i> Your appearance will be used throughout the overworld.</span>
                <button type="button" class="cc-continue" id="cc-continue">Continue <b>›</b></button>
            </div>
        </div>
    `;

    characterCreationScreen.querySelectorAll("[data-gender]").forEach(button => {
        button.addEventListener("click", () => {
            const nextGender = button.dataset.gender;
            gameState.gender = nextGender;
            gameState.playerCustomization = nextGender === "girl"
                ? { hair: "brown", eyes: "brown", outfit: "default" }
                : { hair: "blond", eyes: "amber", outfit: "default" };
            renderCharacterCreation();
        });
    });

    const addOption = (containerId, category, item, previewPath) => {
        const container = characterCreationScreen.querySelector(containerId);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `cc-option ${current[category] === item.id ? "selected" : ""}`;
        button.appendChild(makeSpritePreview(previewPath));
        const label = document.createElement("span");
        label.textContent = item.label;
        button.appendChild(label);
        button.addEventListener("click", () => {
            gameState.playerCustomization[category] = item.id;
            renderCharacterCreation();
        });
        container.appendChild(button);
    };

    data.hair.forEach(item => {
        const previewSelection = { gender, hair: item.id, eyes: current.eyes, outfit: current.outfit };
        const path = combinedPlayerCandidates("down", previewSelection);
        addOption("#cc-hair-options", "hair", item, path);
    });

    data.eyes.forEach(item => {
        const previewSelection = { gender, hair: current.hair, eyes: item.id, outfit: current.outfit };
        const path = combinedPlayerCandidates("down", previewSelection);
        addOption("#cc-eye-options", "eyes", item, path);
    });

    data.outfits.forEach(item => {
        const previewSelection = { gender, hair: current.hair, eyes: current.eyes, outfit: item.id };
        const path = combinedPlayerCandidates("down", previewSelection);
        addOption("#cc-outfit-options", "outfit", item, path);
    });

    characterCreationScreen.querySelector("#cc-large-preview").appendChild(
        makeSpritePreview(combinedPlayerCandidates("down", getPlayerVisualSelection()), "cc-large-sprite")
    );

    const nameInput = characterCreationScreen.querySelector("#cc-name");
    nameInput.addEventListener("input", () => {
        gameState.playerName = nameInput.value.trim().slice(0, 12);
    });
    nameInput.addEventListener("keydown", event => {
        if (event.key === "Enter") confirmCharacterCreation();
    });

    characterCreationScreen.querySelector("#cc-random-name").addEventListener("click", () => {
        const names = ["Kael", "Aren", "Lio", "Mira", "Nia", "Rin", "Kaleo"];
        nameInput.value = names[Math.floor(Math.random() * names.length)];
        gameState.playerName = nameInput.value;
    });

    characterCreationScreen.querySelector("#cc-continue").addEventListener("click", confirmCharacterCreation);
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
}

function showCharacterCreation() {
    if (!characterCreationScreen) {
        chooseGender("boy");
        return;
    }

    gameState.mode = "intro";
    gameState.currentScene = "character-creation";

    if (!gameState.gender) gameState.gender = "boy";
    if (!gameState.playerCustomization) {
        gameState.playerCustomization = { hair: "blond", eyes: "amber", outfit: "default" };
    }

    introScreen.classList.add("hidden");
    characterCreationScreen.classList.remove("hidden");
    renderCharacterCreation();
}

function confirmCharacterCreation() {
    const input = document.getElementById("cc-name");
    const name = input?.value.trim() || "";

    if (!name) {
        input?.focus();
        return;
    }

    gameState.playerName = name.slice(0, 12);
    gameState.currentScene = "character-complete";

    if (appearanceEditing && appearanceReturnContext) {
        const context = appearanceReturnContext;
        appearanceEditing = false;
        appearanceReturnContext = null;
        characterCreationScreen?.classList.add("hidden");
        overworldScreen?.classList.remove("hidden");
        gameState.mode = "overworld";
        gameState.currentScene = "overworld";
        loadMap(context.mapId, context.x, context.y);
        player.direction = context.direction || "down";
        player.frame = context.frame || 0;
        closeGameMenu();
        drawGame();
        saveGame(false);
        return;
    }

    characterCreationScreen?.classList.add("hidden");
    startOverworld();
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
    markEntheonCaptured(name);

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

// KALEO HIGH-POLISH WORLD SCALE
// The world grid is intentionally larger than the original 32px prototype.
// This gives future 48px pixel-art tiles enough room for layered detail while
// keeping the existing map coordinates, collision logic and encounter data.
const TILE_SIZE = 48;
const TILE_BASE_SIZE = 32;
const TILE_ART_SCALE = TILE_SIZE / TILE_BASE_SIZE;

const TILE = {
    GRASS: ".",
    TREE: "T",
    WATER: "W",
    PATH: "G",
    WALL: "#",
    DOOR: "D",
    TALL_GRASS: "V",
    FLOOR: "F",
    SHELF: "S",
    LAB: "L",
    DISPLAY: "C",
    PLANT: "P"
};

const maps = {
    town: {
        name: "Westmere — Settlement 1",
        handBuilt: true,
        data: [
            "####################D###################",
            "#..................GGG.................#",
            "#..T..T.......T....GGG....T.......T..T.#",
            "#...............#########..............#",
            "#...............#########..............#",
            "#..#######......#########....#######...#",
            "#..#######......#########....#######...#",
            "#..#######......#########....#######...#",
            "#..#######......####D####....#######...#",
            "#..#######.........GGG.......#######...#",
            "#.....G..G.........GGG.........GG......#",
            "#..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...#",
            "#..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...#",
            "#..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG...#",
            "#........G.........GGG.........G.......#",
            "#.....G..G..WWW....GGG.........GG......#",
            "#..#######..WWWVV..GGG.VVVVV.#######...#",
            "#..#######..WWWVV..GGG.VVVVV.#######...#",
            "#..#######..WWWVV..GGG.VVVVV.#######...#",
            "#..#######..VVVVV..GGG.VVVVV.#######...#",
            "#..#######.........GGG.......#######...#",
            "#..................GGG.................#",
            "#..T...............GGG..............T..#",
            "########################################"
],
        spawn: { x: 20.5, y: 21.5 },
        exits: [
            { x: 20, y: 0, targetMap: "route_south_everhope", targetX: 14.5, targetY: 15.5, message: "You leave Settlement 1 and follow the Main Trail toward Everhope City." },
            { x: 20, y: 8, targetMap: "research_center", targetX: 12.5, targetY: 13.5, message: "You enter the Entheon Research Center." }
        ],
        encounters: [],
        npcs: [
            {
                id: "town-trainer",
                type: "trainer",
                interaction: "trainer",
                name: "Mira",
                x: 12,
                y: 11,
                color: "#d26b6b",
                lines: [
                    "You're the new Trainer everyone has been talking about, aren't you?",
                    "The road north is a good place to get some practice in.",
                    "Just remember that wild Entheon don't wait for you to be ready!"
                ],
                battle: {
                    reward: 60,
                    team: [{ species: "Brindlew", level: 3 }],
                    victory: "Nice battle! I guess the road really is your next step.",
                    defeat: "Don't worry. The road will still be there when you're ready."
                }
            },
            {
                id: "town-resident",
                type: "npc",
                interaction: "dialogue",
                name: "Old Farmer",
                x: 26,
                y: 13,
                color: "#8b7653",
                lines: [
                    "Westmere is mostly green country, but don't mistake that for being tame.",
                    "The forests north of here get much denser.",
                    "If you're heading toward Everhope, keep an eye out for the old Great Tree."
                ]
            },
            {
                id: "restoration-attendant",
                type: "restoration",
                interaction: "restoration",
                name: "Restoration Attendant",
                x: 7,
                y: 13,
                color: "#69a9a0",
                lines: ["Welcome to the local Restoration Hub.", "We can restore your Entheon whenever you need it."]
            },
            {
                id: "travelling-merchant",
                type: "merchant",
                interaction: "merchant",
                name: "Travelling Merchant",
                x: 33,
                y: 13,
                color: "#b88a52",
                lines: [
                    "Supplies before you leave? Smart thinking.",
                    "The road ahead has a habit of making Trainers spend more Capture Crystals than they expected."
                ],
                shop: { inventory: ["basicRestore", "revitalizingElixir", "capture"] }
            },
            {
                id: "town-child",
                type: "npc",
                interaction: "dialogue",
                name: "Local Child",
                x: 14,
                y: 5,
                color: "#6b9ed2",
                lines: [
                    "The giant tree on the road is older than anyone in town.",
                    "My dad says people used to use it as a meeting place long before there was a road here."
                ]
            }
        ]
    },

    route_south_everhope: {
        name: "Westmere — Main Trail to Everhope City",
        handBuilt: true,
        data: [
            "##############D###############",
            "#............GGG.............#",
            "#.T..........GGG.............#",
            "#...TTT.T...GGGG.......TVVV..#",
            "#...TGT.....GGGG.......VVVV..#",
            "#....G......GGGG...T...VVVT..#",
            "#....G......GGG........VVVV..#",
            "#....G...GGGGGG..............#",
            "#....GGGGGGGGGG..............#",
            "#........GGGGGG..............#",
            "#........GGG........VTVVV....#",
            "#.W......GGGGGGG....VVVVV.T..#",
            "#.W......GGGGGGG....VVVVV....#",
            "#.WT.....GGGGGGG....VVVVV....#",
            "#.W..........GGG.......T.....#",
            "#.W....T.....GGG.............#",
            "#............GGG.............#",
            "##############D###############"
],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "town", targetX: 20.5, targetY: 1.5, message: "You return to Settlement 1." },
            { x: 14, y: 0, targetMap: "everhope_city", targetX: 14.5, targetY: 15.5, message: "The Main Trail continues north toward Everhope City." }
        ],
        encounters: [
            { species: "Brindlew", minLevel: 2, maxLevel: 3, weight: 100 }
        ],
        npcs: [
            {
                id: "route-trainer-1",
                type: "trainer",
                interaction: "trainer",
                name: "Young Trainer Leo",
                x: 18,
                y: 9,
                color: "#c66b6b",
                lines: [
                    "Hold up! You're travelling this way too?",
                    "A quick battle makes the road a lot more interesting.",
                    "Let's see what your partner can do!"
                ],
                battle: {
                    reward: 90,
                    team: [{ species: "Brindlew", level: 3 }],
                    victory: "That was a good one! I'll keep training before I reach Everhope.",
                    defeat: "Looks like I'm the one who needs more practice."
                }
            },
            {
                id: "great-tree-ranger",
                type: "npc",
                interaction: "dialogue",
                name: "Park Ranger",
                x: 7,
                y: 7,
                color: "#5f8f62",
                lines: [
                    "This is the Great Tree clearing.",
                    "Please treat the old tree and the surrounding habitat with respect.",
                    "Westmere's wild Entheon depend on places like this remaining undisturbed."
                ]
            }
        ]
    },

    everhope_city: {
        name: "Westmere — Everhope City",
        handBuilt: true,
        data: [
            "##################D#################",
            "#................GGG...............#",
            "#................GGG...............#",
            "#...........#############..........#",
            "#..#######..#############.#######..#",
            "#..#######..#############.#######..#",
            "#..#######..#############.#######..#",
            "#..#######..#############.#######..#",
            "#..#######.......GGG......#######..#",
            "#.......G........GGG........G......#",
            "#..GGGGGGGGGGGGGGGGGGGGGGGGGGGGG...#",
            "#..GGGGGGGGGGGGGGGGGGGGGGGGGGGGG...#",
            "#..GGGGGGGGGGGGGGGGGGGGGGGGGGGGG...#",
            "#.......G........GGG........G......#",
            "#.......G....T.T.TGT.T.T....G......#",
            "#..########......GGG.....########..#",
            "#..########...T..GGG..T..########..#",
            "#..########......GGG.....########..#",
            "#..########.....WWWWW....########..#",
            "#..########......GGG.....########..#",
            "#................GGG...............#",
            "##################D#################"
],
        spawn: { x: 18.5, y: 20.5 },
        exits: [
            { x: 18, y: 21, targetMap: "route_south_everhope", targetX: 14.5, targetY: 1.5, message: "You head back toward Settlement 1." },
            { x: 18, y: 0, targetMap: "route_everhope_settlement2", targetX: 14.5, targetY: 15.5, message: "You leave Everhope City along the Main Trail toward Settlement 2." }
        ],
        encounters: [],
        npcs: [
            {
                id: "everhope-restoration",
                type: "restoration",
                interaction: "restoration",
                name: "Restoration Attendant",
                x: 7,
                y: 10,
                color: "#69a9a0",
                lines: ["Welcome to Everhope's Restoration Hub.", "Your Entheon are always welcome here."]
            },
            {
                id: "everhope-merchant",
                type: "merchant",
                interaction: "merchant",
                name: "City Merchant",
                x: 28,
                y: 10,
                color: "#b88a52",
                lines: ["Everhope has everything a travelling Trainer needs.", "Take a look before you head back onto the Main Trail."],
                shop: { inventory: ["basicRestore", "revitalizingElixir", "capture"] }
            },
            {
                id: "everhope-gym-attendant",
                type: "npc",
                interaction: "dialogue",
                name: "Gym Attendant",
                x: 18,
                y: 9,
                color: "#7a7fb0",
                lines: [
                    "Everhope Gym is home to Gym Leader Gale.",
                    "The Gym specializes in Gale affinity battling.",
                    "Gym Leader Gale is ready for your challenge."
                ]
            },
            {
                id: "everhope-resident",
                type: "npc",
                interaction: "dialogue",
                name: "Everhope Resident",
                x: 12,
                y: 12,
                color: "#6b9ed2",
                lines: [
                    "Everhope is the biggest city in Westmere.",
                    "Trainers from the smaller settlements come here for services they can't get locally.",
                    "The Main Trail north eventually leads toward the rest of the region."
                ]
            }
        ]
    },

    route_everhope_settlement2: {
        name: "Westmere — Northwesterly Trail to Settlement 2",
        handBuilt: true,
        data: [
            "#D#############################",
            "#GGG.........................T#",
            "#..GGG.......................T#",
            "#....GGG......................#",
            "#......GGG.......V...........T#",
            "#........GGG.................##",
            "#..........GGG.....TT........##",
            "#............GGG.............##",
            "#..............GGG...........##",
            "#................GGG........###",
            "#.................GGG...V...###",
            "#...................GGG.....###",
            "#.....................GGG...###",
            "#.......................GGG.###",
            "#.........................GG###",
            "#..........................G###",
            "#........................GGG###",
            "#.......................GGGG###",
            "#############################D#"
        ],
        spawn: { x: 28.5, y: 16.5 },
        exits: [
            { x: 1, y: 0, targetMap: "everhope_city", targetX: 28.5, targetY: 16.5, message: "You return toward Everhope City along the northwestern trail." },
            { x: 29, y: 18, targetMap: "westmere_settlement2", targetX: 1.5, targetY: 11.5, message: "The trail bends southeast toward Settlement 2." }
        ],
        encounters: [
            { species: "Brindlew", minLevel: 5, maxLevel: 6, weight: 35 },
            { species: "Orven", minLevel: 5, maxLevel: 7, weight: 25 },
            { species: "Meliu", minLevel: 5, maxLevel: 7, weight: 20 },
            { species: "Virel", minLevel: 6, maxLevel: 8, weight: 20 }
        ],
        npcs: [
            {
                id: "settlement2-trainer",
                type: "trainer",
                interaction: "trainer",
                name: "Hiker Rowan",
                x: 16,
                y: 9,
                color: "#8b6b4f",
                lines: [
                    "The trail gets busier once you get closer to Settlement 2.",
                    "Let's see whether you're ready for the Trainers further north."
                ],
                battle: {
                    reward: 120,
                    team: [{ species: "Orven", level: 6 }],
                    victory: "Not bad. Settlement 2 isn't far now.",
                    defeat: "The trail can wait. Take some time to prepare."
                }
            },
            {
                id: "trail-ranger-2",
                type: "npc",
                interaction: "dialogue",
                name: "Westmere Ranger",
                x: 11,
                y: 6,
                color: "#5f8f62",
                lines: [
                    "This stretch of Westmere is still mostly woodland and open country.",
                    "Stay on the trail when you can. The wild Entheon here are getting more varied."
                ]
            }
        ]
    },

    westmere_settlement2: {
        "name": "Westmere — Settlement 2",
        "handBuilt": true,
        "data": [
                "...............G...............",
                "...............G...............",
                "..#######.#####G....########...",
                ".T#######T#####G..T.########...",
                "..#######.#####G....########.T.",
                "..#######.#####G....########...",
                "..#######.#####G....########...",
                ".V...G......G..G..V....G.......",
                ".........V.....G............V..",
                ".......GGGGGGGGGGGGGGGGG.......",
                "DGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
                "......GGGGGGGGGGGGGGGGGGGG.....",
                ".....G.........G......G....T...",
                "..#######......G....######.....",
                "..#######......G....######.WWWW",
                ".T#######.T....G....######.WWWW",
                "..#######......G..T.######.WWWW",
                "..#######......G....######.WWWW",
                "..#######..V...G.V....GGGGGGGGW",
                "...............G........GGGGGGW",
                "...............G.............D."
        ],
        "spawn": {
                "x": 26.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 29,
                        "y": 20,
                        "targetMap": "route_everhope_settlement2",
                        "targetX": 28.5,
                        "targetY": 16.5,
                        "message": "You head back along the northwestern trail toward Everhope City."
                },
                {
                        "x": 0,
                        "y": 10,
                        "targetMap": "route_settlement2_settlement3",
                        "targetX": 28.5,
                        "targetY": 8.5,
                        "message": "You leave Settlement 2 by the western road toward Settlement 3."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "settlement2-restoration",
                        "type": "restoration",
                        "interaction": "restoration",
                        "name": "Restoration Attendant",
                        "x": 6,
                        "y": 15,
                        "color": "#69a9a0",
                        "lines": [
                                "Welcome to Settlement 2's Restoration Hub.",
                                "The ferry makes this a popular stopping point for travellers."
                        ]
                },
                {
                        "id": "settlement2-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Market Merchant",
                        "x": 12,
                        "y": 5,
                        "color": "#b88a52",
                        "lines": [
                                "Fresh supplies, ferry snacks and travel gear — all in one place.",
                                "Lume traders bring half their stock through this town."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "revitalizingElixir",
                                        "capture"
                                ]
                        }
                },
                {
                        "id": "settlement2-ferrymaster",
                        "type": "ferry",
                        "interaction": "ferry",
                        "name": "Lume Ferrymaster",
                        "x": 25,
                        "y": 18,
                        "color": "#4f8fb5",
                        "destinationMap": "lume_city",
                        "destinationX": 17.5,
                        "destinationY": 17.5,
                        "returnX": 25.5,
                        "returnY": 18.5,
                        "lines": [
                                "The Lume ferry departs from the southeastern pier.",
                                "Ready to cross the Central Sea?"
                        ]
                },
                {
                        "id": "settlement2-innkeeper",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Innkeeper",
                        "x": 5,
                        "y": 8,
                        "color": "#9a718c",
                        "lines": [
                                "Travellers usually stay here before catching the ferry.",
                                "The road west is quieter than the road to Everhope."
                        ]
                },
                {
                        "id": "settlement2-steward",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Town Steward",
                        "x": 17,
                        "y": 8,
                        "color": "#7a7fa8",
                        "lines": [
                                "Settlement 2 grew around the old coastal road and ferry crossing.",
                                "The square is the heart of town."
                        ]
                },
                {
                        "id": "settlement2-traveller",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Travelling Trainer",
                        "x": 20,
                        "y": 10,
                        "color": "#6b9ed2",
                        "lines": [
                                "Stock up here before choosing your next direction.",
                                "West leads toward Settlement 3; southeast takes you to Lume by ferry."
                        ]
                }
        ]
},

    route_settlement2_settlement3: {
        "name": "Westmere — Trail to Settlement 3",
        "handBuilt": true,
        "data": [
                "...............................",
                "...............................",
                "............................GGG",
                "............T..............GGGG",
                "....T.....................GVGGG",
                "....................V....G.....",
                "..........V...........GGG......",
                ".......T..........GGGGGGG......",
                "...............GGG....GGG......",
                "D..........GGGGGGG..........T.D",
                "..........G....GGG.............",
                ".......GGG............T........",
                "....GGGGGG....V.........V......",
                "...G.V.GGG.....................",
                "GGG...............T............",
                "GGG.......................T....",
                "GGG............................",
                "...............................",
                "..............................."
        ],
        "spawn": {
                "x": 28.5,
                "y": 9.5
        },
        "exits": [
                {
                        "x": 0,
                        "y": 9,
                        "targetMap": "westmere_settlement2",
                        "targetX": 1.5,
                        "targetY": 10.5,
                        "message": "You return to Settlement 2."
                },
                {
                        "x": 30,
                        "y": 9,
                        "targetMap": "westmere_settlement3",
                        "targetX": 1.5,
                        "targetY": 10.5,
                        "message": "You arrive at Settlement 3."
                }
        ],
        "encounters": [
                {
                        "species": "Brindlew",
                        "minLevel": 5,
                        "maxLevel": 6,
                        "weight": 70
                }
        ],
        "npcs": [
                {
                        "id": "route23-trainer",
                        "type": "trainer",
                        "interaction": "trainer",
                        "name": "Trail Trainer",
                        "x": 16,
                        "y": 9,
                        "color": "#8f6a55",
                        "lines": [
                                "The western roads are where trainers prove themselves.",
                                "Let us battle!"
                        ],
                        "team": [
                                {
                                        "species": "Brindlew",
                                        "level": 6
                                }
                        ],
                        "rewardVale": 180
                }
        ]
},

    westmere_settlement3: {
        "name": "Westmere — Settlement 3",
        "handBuilt": true,
        "data": [
                "...............D...............",
                "...............G...............",
                ".T.......T#####G...............",
                "..#######.#####G...T.########T.",
                "..#######.#####G.....########..",
                "..#######.#####G..V..########..",
                "..#######...G..G.....########..",
                "..#######..GGGGGGGGG.########..",
                ".....G....VGGGGGGGGGV...G......",
                "...........GGGGGGGGG...........",
                "DGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
                "...........GGGGGGGGG...........",
                ".....G...V.GGGGGGGGG.V..G......",
                "..#######..GGGGGGGGG.########..",
                "..#######......G.....########..",
                "..#######......G.....########..",
                "..#######......V.....########..",
                "..#######......G.....########..",
                "..#######......G.....########..",
                ".T........T....G....T........T.",
                "...............D..............."
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_westmere_dunridge",
                        "targetX": 28.5,
                        "targetY": 19.5,
                        "message": "You leave Westmere and follow the northeastern road toward Dunridge."
                },
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_settlement2_settlement3",
                        "targetX": 1.5,
                        "targetY": 9.5,
                        "message": "You return to Settlement 2."
                },
                {
                        "x": 0,
                        "y": 10,
                        "targetMap": "route_settlement3_greenvale",
                        "targetX": 28.5,
                        "targetY": 19.5,
                        "message": "A southwestern side road leads toward Greenvale."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "settlement3-elder",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Village Elder",
                        "x": 15,
                        "y": 10,
                        "color": "#806d58",
                        "lines": [
                                "Settlement 3 sits where three roads meet.",
                                "The northeast road follows the hills toward Dunridge."
                        ]
                },
                {
                        "id": "settlement3-ranger",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Greenvale Ranger",
                        "x": 8,
                        "y": 10,
                        "color": "#5f9360",
                        "lines": [
                                "The southwestern trail eventually crosses into Greenvale.",
                                "Watch the tall grass along the lower road."
                        ]
                },
                {
                        "id": "settlement3-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Roadside Merchant",
                        "x": 24,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Three roads, one shop. Convenient, isn't it?"
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "capture"
                                ]
                        }
                },
                {
                        "id": "settlement3-trainer",
                        "type": "trainer",
                        "interaction": "trainer",
                        "name": "Crossroads Trainer",
                        "x": 15,
                        "y": 15,
                        "color": "#6b7ea8",
                        "lines": [
                                "Every direction from here has a different challenge."
                        ],
                        "team": [
                                {
                                        "species": "Brindlew",
                                        "level": 7
                                }
                        ],
                        "rewardVale": 220
                }
        ]
},

    route_settlement3_greenvale: {
        "name": "Westmere → Greenvale — Southern Trail",
        "handBuilt": true,
        "data": [
                "############################D##",
                "#.........................GGG.#",
                "#........................GGG..#",
                "#....T..................GGG...#",
                "#................T.....GGG....#",
                "#.....................GGG.....#",
                "#....................GGG......#",
                "#..................GGG..T.....#",
                "#.................GGG.........#",
                "#................GGG..........#",
                "#...............GGG...........#",
                "#.......T......GGG............#",
                "#.............GGG.............#",
                "#............GGG..............#",
                "#..........GGG.....T..........#",
                "#.........GGG.................#",
                "#........GGG..................#",
                "#...T...GGG..............T....#",
                "#......GGG....................#",
                "#.....GGG.....................#",
                "#D#############################"
        ],
        "spawn": {
                "x": 27.5,
                "y": 1.5
        },
        "exits": [
                {
                        "x": 28,
                        "y": 0,
                        "targetMap": "westmere_settlement3",
                        "targetX": 1.5,
                        "targetY": 10.5,
                        "message": "You return to Settlement 3."
                },
                {
                        "x": 1,
                        "y": 20,
                        "targetMap": "greenvale_settlement4",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You arrive in Greenvale."
                }
        ],
        "encounters": []
},

    greenvale_settlement4: {
        "name": "Greenvale — Settlement 4",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.T...........GG..............#",
                "#..#######..T.GG.....#######..#",
                "#..#######....GG..T..#######..#",
                "#..#######....GG.....#######..#",
                "#..#######....GG.....#######..#",
                "#.............GG..............#",
                "#.............GG............T.#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "DGGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#..#######....GG.....#######..#",
                "#..#######....GG.....#######..#",
                "#..#######....GG.....#######..#",
                "#..#######....GG.....#######..#",
                "#..#######....GG.....#######..#",
                "#.T...........GG............T.#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_settlement3_greenvale",
                        "targetX": 28.5,
                        "targetY": 19.5,
                        "message": "You return north toward Settlement 3."
                },
                {
                        "x": 0,
                        "y": 10,
                        "targetMap": "route_4_harveston",
                        "targetX": 28.5,
                        "targetY": 10.5,
                        "message": "The southern road leads deeper into Greenvale."
                },
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_4_harveston",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "The road continues toward Harveston."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "s4-rest",
                        "type": "restoration",
                        "interaction": "restoration",
                        "name": "Restoration Attendant",
                        "x": 6,
                        "y": 10,
                        "color": "#69a9a0",
                        "lines": [
                                "Welcome to Settlement 4.",
                                "Greenvale roads are quieter than Westmere, but the wilds are closer here."
                        ]
                },
                {
                        "id": "s4-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Greenvale Trader",
                        "x": 24,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Farmers and travellers both stop here for supplies."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "capture"
                                ]
                        }
                },
                {
                        "id": "s4-ranger",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Greenvale Ranger",
                        "x": 15,
                        "y": 8,
                        "color": "#5f9360",
                        "lines": [
                                "The Great Windmill lies farther south.",
                                "Keep following the green road and you will find Harveston."
                        ]
                }
        ]
},

    route_westmere_dunridge: {
        "name": "Westmere → Dunridge — Northeastern Trail",
        "handBuilt": true,
        "data": [
                ".............................D.",
                "...............................",
                "..........................GGG..",
                ".........................G.....",
                "..........T.............G.V....",
                "..T...............V..T.G.......",
                "......................G........",
                "........V............G......T..",
                "..................GGG..........",
                ".................G.............",
                "......T.....V...G..............",
                "...............G...............",
                "............GGG.........T......",
                "...........G...................",
                "....V.....G......T.............",
                ".........G.....................",
                ".....GGGG.............V........",
                "....G........T.................",
                "...G...........................",
                "..G............................",
                ".D............................."
        ],
        "spawn": {
                "x": 28.5,
                "y": 2.5
        },
        "exits": [
                {
                        "x": 29,
                        "y": 0,
                        "targetMap": "dunridge_settlement2",
                        "targetX": 1.5,
                        "targetY": 19.5,
                        "message": "You arrive at a Dunridge settlement."
                },
                {
                        "x": 1,
                        "y": 20,
                        "targetMap": "westmere_settlement3",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward Westmere."
                }
        ],
        "encounters": [
                {
                        "species": "Brindlew",
                        "minLevel": 6,
                        "maxLevel": 8,
                        "weight": 60
                }
        ],
        "npcs": [
                {
                        "id": "dunridge-traveller",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Dunridge Traveller",
                        "x": 16,
                        "y": 10,
                        "color": "#7a6b5c",
                        "lines": [
                                "The hills ahead mark the edge of Dunridge.",
                                "The road becomes rougher from here."
                        ]
                }
        ]
},

    dunridge_settlement2: {
        "name": "Dunridge — Settlement 9",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.########..T.GG.....########.#",
                "#.########....GG..T..########.#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.########..T.GG...T.########.#",
                "#.########....GG.....########.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_dunridge_settlement2_stonehaven",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "The northern Dunridge road continues."
                },
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_westmere_dunridge",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward the southern Dunridge road."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "dunridge_settlement2-farmer",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Dunridge Farmer",
                        "x": 10,
                        "y": 10,
                        "color": "#8a7655",
                        "lines": [
                                "Dunridge is hill country and old farmland.",
                                "Stonehaven is the region's major crossroads."
                        ]
                },
                {
                        "id": "dunridge_settlement2-trader",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Dunridge Trader",
                        "x": 25,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Supplies for the mountain roads."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "capture"
                                ]
                        }
                }
        ]
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
        "name": "Dunridge — Settlement 10",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.########..T.GG.....########.#",
                "#.########....GG..T..########.#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.########..T.GG...T.########.#",
                "#.########....GG.....########.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_dunridge_settlement1_stonehaven",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "The northern Dunridge road continues."
                },
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_dunridge_settlement2_stonehaven",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward the southern Dunridge road."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "dunridge_settlement1-farmer",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Dunridge Farmer",
                        "x": 10,
                        "y": 10,
                        "color": "#8a7655",
                        "lines": [
                                "Dunridge is hill country and old farmland.",
                                "Stonehaven is the region's major crossroads."
                        ]
                },
                {
                        "id": "dunridge_settlement1-trader",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Dunridge Trader",
                        "x": 25,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Supplies for the mountain roads."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "capture"
                                ]
                        }
                }
        ]
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
        "name": "Dunridge — Stonehaven",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.########.T..GG.....########.#",
                "#.########....GG...T.########.#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "DGGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.########....GG.....########.#",
                "#.########.T..GG....T########.#",
                "#.########....GG.....########.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_dunridge_settlement1_stonehaven",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward the Dunridge settlements."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_stonehaven_highreach",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "The northeastern road climbs toward Highreach."
                },
                {
                        "x": 0,
                        "y": 10,
                        "targetMap": "route_stonehaven_seawick",
                        "targetX": 28.5,
                        "targetY": 10.5,
                        "message": "The western coastal road leads toward Seawick."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "stone-rest",
                        "type": "restoration",
                        "interaction": "restoration",
                        "name": "Stonehaven Restorer",
                        "x": 6,
                        "y": 10,
                        "color": "#69a9a0",
                        "lines": [
                                "Welcome to Stonehaven. Rest up before choosing your road."
                        ]
                },
                {
                        "id": "stone-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Stonehaven Merchant",
                        "x": 24,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Stonehaven sits between the coast, Dunridge and Highreach."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "revitalizingElixir",
                                        "capture"
                                ]
                        }
                },
                {
                        "id": "stone-ranger",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Road Warden",
                        "x": 15,
                        "y": 7,
                        "color": "#5f9360",
                        "lines": [
                                "Three roads leave Stonehaven. West to Seawick, northeast to Highreach, and south into Dunridge."
                        ]
                },
                {
                        "id": "stone-resident",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Stonehaven Resident",
                        "x": 15,
                        "y": 13,
                        "color": "#6b9ed2",
                        "lines": [
                                "Stonehaven is where travellers decide which part of the northern world they want to see next."
                        ]
                }
        ]
},

    route_stonehaven_seawick: {
        name: "Stonehaven → Mullhaven — Coastal Trail",
        data: [
            "##############################",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#....TT......................#",
            "#....TT......................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#....................TT......#",
            "#....................TT......#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 28.5, y: 15.5 },
        exits: [
            { x: 28, y: 16, targetMap: "stonehaven", targetX: 28.5, targetY: 7.5, message: "You return to Stonehaven along the coastal trail." },
            { x: 1, y: 0, targetMap: "seawick_settlement11", targetX: 1.5, targetY: 15.5, message: "You arrive at Mullhaven in Seawick." }
        ],
        encounters: []
    },

    seawick_settlement11: {
        name: "Seawick — Mullhaven",
        data: [
            "##############################",
            "#............................#",
            "#........VVVV................#",
            "#........VVVV................#",
            "#............................#",
            "#....TT......................#",
            "#....TT......................#",
            "D............................D",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#............................#",
            "#....................TT......#",
            "#....................TT......#",
            "#............................#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 1.5, y: 7.5 },
        exits: [
            { x: 0, y: 7, targetMap: "route_stonehaven_seawick", targetX: 1.5, targetY: 7.5, message: "You return toward Stonehaven." },
            { x: 29, y: 7, targetMap: "route_11_12", targetX: 1.5, targetY: 1.5, message: "The coastal road continues toward Settlement 12." }
        ],
        encounters: []
    },

    route_stonehaven_highreach: {
        name: "Dunridge → Highreach — Mountain Trail",
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
            { x: 14, y: 16, targetMap: "stonehaven", targetX: 14.5, targetY: 1.5, message: "You return to Stonehaven." },
            { x: 14, y: 0, targetMap: "highreach_settlement1", targetX: 14.5, targetY: 15.5, message: "You cross into Highreach." }
        ],
        encounters: []
    },

    highreach_settlement1: {
        name: "Highreach — Settlement 1",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#............................#",
            "#......TT....................#",
            "#......TT....................#",
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
            { x: 14, y: 16, targetMap: "route_stonehaven_highreach", targetX: 14.5, targetY: 1.5, message: "You return toward Stonehaven." },
            { x: 14, y: 0, targetMap: "route_highreach_settlement1_2", targetX: 14.5, targetY: 15.5, message: "The trail continues deeper into Highreach." }
        ],
        encounters: []
    },

    route_highreach_settlement1_2: {
        name: "Highreach — Mountain Trail",
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
            { x: 14, y: 16, targetMap: "highreach_settlement1", targetX: 14.5, targetY: 1.5, message: "You return to the previous Highreach settlement." },
            { x: 14, y: 0, targetMap: "highreach_settlement2", targetX: 14.5, targetY: 15.5, message: "You arrive at another Highreach settlement." }
        ],
        encounters: []
    },

    highreach_settlement2: {
        name: "Highreach — Settlement 15",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#............................#",
            "#............................#",
            "#........TT..................D",
            "#........TT..................#",
            "#............................#",
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
            { x: 14, y: 16, targetMap: "route_highreach_settlement1_2", targetX: 14.5, targetY: 1.5, message: "You return toward Settlement 14." },
            { x: 14, y: 0, targetMap: "route_highreach_15_16", targetX: 14.5, targetY: 15.5, message: "The trail continues toward Settlement 16." },
            { x: 29, y: 7, targetMap: "route_15_hot_springs", targetX: 1.5, targetY: 8.5, message: "A side trail winds toward the Highreach hot springs." }
        ],
        encounters: []
    },

    route_highreach_15_16: {
        name: "Highreach — Trail to Settlement 16",
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
            { x: 14, y: 16, targetMap: "highreach_settlement2", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 15." },
            { x: 14, y: 0, targetMap: "highreach_settlement3", targetX: 14.5, targetY: 15.5, message: "You arrive at Settlement 16." }
        ],
        encounters: []
    },

    highreach_settlement3: {
        name: "Highreach — Settlement 16",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#..........GGGG..............#",
            "#..........GGGG..............#",
            "#............................#",
            "#...........GG...............#",
            "#...........GG...............D",
            "#...........GG...............#",
            "#...........GG...............#",
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
            { x: 14, y: 16, targetMap: "route_highreach_15_16", targetX: 14.5, targetY: 1.5, message: "You return toward Settlement 15." },
            { x: 14, y: 0, targetMap: "route_highreach_16_17", targetX: 14.5, targetY: 15.5, message: "The northern trail leads toward Settlement 17." },
            { x: 29, y: 7, targetMap: "route_highreach_16_thermalis", targetX: 1.5, targetY: 8.5, message: "The eastern trail leads toward Thermalis." }
        ],
        encounters: []
    },

    route_highreach_16_thermalis: {
        name: "Highreach — Eastern Trail to Thermalis",
        data: [
            "##############################",
            "#............................#",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#............................#",
            "D........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#############################D"
        ],
        spawn: { x: 1.5, y: 8.5 },
        exits: [
            { x: 0, y: 7, targetMap: "highreach_settlement3", targetX: 28.5, targetY: 7.5, message: "You return to Settlement 16." },
            { x: 29, y: 16, targetMap: "thermalis_city", targetX: 14.5, targetY: 15.5, message: "You arrive in Thermalis." }
        ],
        encounters: []
    },

    route_highreach_16_17: {
        name: "Highreach → Northvale — Trail to Settlement 17",
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
            { x: 14, y: 16, targetMap: "highreach_settlement3", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 16." },
            { x: 14, y: 0, targetMap: "northvale_settlement17", targetX: 14.5, targetY: 15.5, message: "You cross into Northvale and reach Settlement 17." }
        ],
        encounters: []
    },

    northvale_settlement17: {
        name: "Northvale — Settlement 17",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#............................#",
            "#............................#",
            "#...............TT...........#",
            "#...............TT...........#",
            "#............................#",
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
            { x: 14, y: 16, targetMap: "route_highreach_16_17", targetX: 14.5, targetY: 1.5, message: "You return toward Highreach." },
            { x: 14, y: 0, targetMap: "route_17_18", targetX: 14.5, targetY: 15.5, message: "The trail continues toward Settlement 18." }
        ],
        encounters: []
    },

    route_17_18: {
        name: "Northvale — Trail to Settlement 18",
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
            { x: 14, y: 16, targetMap: "northvale_settlement17", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 17." },
            { x: 14, y: 0, targetMap: "northvale_settlement18", targetX: 14.5, targetY: 15.5, message: "You arrive at Settlement 18." }
        ],
        encounters: []
    },

    northvale_settlement18: {
        name: "Northvale — Settlement 18",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
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
            { x: 14, y: 16, targetMap: "route_17_18", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 17." },
            { x: 14, y: 0, targetMap: "route_18_19", targetX: 14.5, targetY: 15.5, message: "The trail continues toward Settlement 19." }
        ],
        encounters: [],
        npcs: [
            {
                id: "lume-ferry-settlement18",
                type: "ferry",
                interaction: "ferry",
                name: "Lume Ferrymaster",
                x: 22,
                y: 8,
                color: "#4f8fb5",
                destinationMap: "lume_city",
                destinationX: 14.5,
                destinationY: 15.5,
                returnX: 14.5,
                returnY: 8.5,
                lines: ["The ferry to Lume is ready to depart."]
            }
        ]
    },

    route_11_12: {
        name: "Seawick — Coastal Trail to Settlement 12",
        data: [
            "##############################",
            "D............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#....TT......................#",
            "#....TT......................#",
            "#..............GGGG..........D",
            "#..............GGGG..........#",
            "#............................#",
            "#....................TT......#",
            "#....................TT......#",
            "#............................#",
            "#...........GGGG.............#",
            "#...........GGGG.............#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 1.5, y: 1.5 },
        exits: [
            { x: 0, y: 1, targetMap: "seawick_settlement11", targetX: 28.5, targetY: 7.5, message: "You return to Settlement 11." },
            { x: 29, y: 7, targetMap: "seawick_settlement12", targetX: 1.5, targetY: 7.5, message: "You arrive at Settlement 12." }
        ],
        encounters: []
    },

    seawick_settlement12: {
        name: "Seawick — Settlement 12",
        data: [
            "##############################",
            "#............................#",
            "#........VVVV................#",
            "#........VVVV................#",
            "#............................#",
            "#....TT......................#",
            "#....TT......................#",
            "D..............GGGG..........D",
            "#..............GGGG..........#",
            "#............................#",
            "#....................TT......#",
            "#....................TT......#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 1.5, y: 7.5 },
        exits: [
            { x: 0, y: 7, targetMap: "route_11_12", targetX: 28.5, targetY: 7.5, message: "You return toward Settlement 11." },
            { x: 29, y: 7, targetMap: "route_12_gullhaven", targetX: 1.5, targetY: 7.5, message: "The road continues toward Gullhaven." }
        ],
        encounters: []
    },

    route_12_gullhaven: {
        name: "Seawick — Trail to Gullhaven",
        data: [
            "##############################",
            "D............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................D",
            "#....TT......................#",
            "#....TT......................#",
            "#............................#",
            "#....................VVVV....#",
            "#....................VVVV....#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 1.5, y: 1.5 },
        exits: [
            { x: 0, y: 1, targetMap: "seawick_settlement12", targetX: 28.5, targetY: 7.5, message: "You return to Settlement 12." },
            { x: 29, y: 7, targetMap: "gullhaven_city", targetX: 14.5, targetY: 15.5, message: "You arrive at Gullhaven." }
        ],
        encounters: []
    },

    gullhaven_city: {
        name: "Gullhaven",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "route_12_gullhaven", targetX: 14.5, targetY: 1.5, message: "You return toward Settlement 12." }
        ],
        encounters: [],
        npcs: []
    },

    route_18_19: {
        name: "Northvale — Trail to Settlement 19",
        data: [
            "##############################",
            "D............................#",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#................GGGG........#",
            "#................GGGG........D",
            "#............................#",
            "#....TT......................#",
            "#....TT......................#",
            "#............................#",
            "#..............VVVV..........#",
            "#..............VVVV..........#",
            "#............................#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 1.5, y: 1.5 },
        exits: [
            { x: 0, y: 1, targetMap: "northvale_settlement18", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 18." },
            { x: 29, y: 7, targetMap: "northvale_settlement19", targetX: 1.5, targetY: 7.5, message: "You arrive at Settlement 19." }
        ],
        encounters: []
    },

    northvale_settlement19: {
        name: "Northvale — Settlement 19",
        data: [
            "##############D###############",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#............................#",
            "D.............GGGG...........D",
            "#.............GGGG...........#",
            "#............................#",
            "#............................#",
            "#....TT......................#",
            "#....TT......................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 1.5, y: 6.5 },
        exits: [
            { x: 14, y: 0, targetMap: "route_19_winterhold", targetX: 14.5, targetY: 15.5, message: "The northern trail climbs toward Winterhold in Isen." },
            { x: 29, y: 6, targetMap: "route_19_northreach", targetX: 1.5, targetY: 7.5, message: "The road leads toward Northreach." }
        ],
        encounters: []
    },

    route_19_northreach: {
        name: "Northvale — Trail to Northreach",
        data: [
            "##############################",
            "#............................#",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#............................#",
            "D..............GGGG..........D",
            "#..............GGGG..........#",
            "#............................#",
            "#............................#",
            "#....................TT......#",
            "#....................TT......#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 28.5, y: 7.5 },
        exits: [
            { x: 0, y: 7, targetMap: "northvale_settlement19", targetX: 28.5, targetY: 6.5, message: "You return to Settlement 19." },
            { x: 29, y: 7, targetMap: "northreach_city", targetX: 14.5, targetY: 15.5, message: "You arrive at Northreach." }
        ],
        encounters: []
    },

    route_19_winterhold: {
        name: "Isen — Trail to Winterhold",
        data: [
            "##############D###############",
            "#............................#",
            "#........TTTT................#",
            "#........TTTT................#",
            "#............................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#....VVVV....................#",
            "#....VVVV....................#",
            "#............................#",
            "#....................TTTT....#",
            "#....................TTTT....#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "northvale_settlement19", targetX: 14.5, targetY: 1.5, message: "You return to Settlement 19." },
            { x: 14, y: 0, targetMap: "winterhold_city", targetX: 14.5, targetY: 15.5, message: "You arrive in Winterhold." }
        ],
        encounters: []
    },

    northreach_city: {
        name: "Northreach",
        data: [
            "##############D###############",
            "#............................#",
            "#............................#",
            "#........GGGG................#",
            "#........GGGG................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "route_19_northreach", targetX: 1.5, targetY: 7.5, message: "You return toward Settlement 19." }
        ],
        encounters: [],
        npcs: []
    },

    winterhold_city: {
        name: "Winterhold",
        data: [
            "##############D###############",
            "#............................#",
            "#........TTTT................#",
            "#........TTTT................#",
            "#............................#",
            "#............................#",
            "#..............GGGG..........#",
            "#..............GGGG..........#",
            "#............................#",
            "#....VVVV....................#",
            "#....VVVV....................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############D###############"
        ],
        spawn: { x: 14.5, y: 15.5 },
        exits: [
            { x: 14, y: 16, targetMap: "route_19_winterhold", targetX: 14.5, targetY: 1.5, message: "You return toward Settlement 19." }
        ],
        encounters: [],
        npcs: []
    },

    lume_city: {
        "name": "Lume — Port City",
        "handBuilt": true,
        "data": [
                "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
                "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
                "WWWWW.........................WWWWW",
                "WWWWW........########.........WWWWW",
                "WWW..#######.########..#######..WWW",
                "WWWT.#######.########..#######T.WWW",
                "WWW..#######.########..#######..WWW",
                "WWW..#######.########..#######..WWW",
                "WWW..#######....GG.....#######..WWW",
                "WWW.....G....GGGGGGGGG....G.....WWW",
                "WWW.........VGGGGGGGGG.V........WWW",
                "WWW..GGGGGGGGGGGGGGGGGGGGGGGGG..WWW",
                "WWW.......V..GGGGGGGGG.G.V......WWW",
                "WWW.....G......G.G...######WWWWWWWW",
                "WWW..######.#######..######WWWWWWWW",
                "WWW..######G#######GG######WWWWWWWW",
                "WWW..######.#######..######WWWWWWWW",
                "WWWT.######.#######..######WWWWTWWW",
                "WWW..######.#######.G.GGGGGGGWWWWWW",
                "WWWWW.................#######WWWWWW",
                "WWWWW.......T......T..#######.WWWWW",
                "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
                "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
        ],
        "spawn": {
                "x": 17.5,
                "y": 17.5
        },
        "exits": [],
        "encounters": [],
        "npcs": [
                {
                        "id": "lume-ferry-return",
                        "type": "ferry_return",
                        "interaction": "ferry_return",
                        "name": "Lume Ferrymaster",
                        "x": 22,
                        "y": 18,
                        "color": "#4f8fb5",
                        "lines": [
                                "Ferries depart regularly for Kaleo’s coastal ports.",
                                "I can arrange your return crossing to the port you came from."
                        ]
                },
                {
                        "id": "lume-portmaster",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Harbourmaster",
                        "x": 7,
                        "y": 11,
                        "color": "#6f7d91",
                        "lines": [
                                "Welcome to Lume, the great port of the Central Sea.",
                                "Ships and ferries from across Kaleo pass through these docks."
                        ]
                },
                {
                        "id": "lume-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Harbour Merchant",
                        "x": 24,
                        "y": 11,
                        "color": "#b88a52",
                        "lines": [
                                "Goods from every region eventually find their way to Lume.",
                                "If you need supplies, this is the place."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "revitalizingElixir",
                                        "capture"
                                ]
                        }
                },
                {
                        "id": "lume-innkeeper",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Innkeeper",
                        "x": 8,
                        "y": 10,
                        "color": "#9a718c",
                        "lines": [
                                "Travellers from every region share stories here.",
                                "You can reach Lume from several ports around Kaleo."
                        ]
                },
                {
                        "id": "lume-sailor",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Sailor",
                        "x": 27,
                        "y": 17,
                        "color": "#6b9ed2",
                        "lines": [
                                "The Central Sea connects more places than most people realize.",
                                "Keep an eye on the weather before a long crossing."
                        ]
                },
                {
                        "id": "lume-citizen",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Lume Resident",
                        "x": 17,
                        "y": 10,
                        "color": "#7a7fa8",
                        "lines": [
                                "Lume never really sleeps.",
                                "There is always another ferry arriving."
                        ]
                }
        ]
},

    route_15_hot_springs: {
        name: "Highreach — Hot Springs Trail",
        data: [
            "##############################",
            "#............................#",
            "#............................#",
            "#........TT..................#",
            "#........TT..................#",
            "#............................#",
            "#..............GGGG..........#",
            "D..............GGGG..........#",
            "#............................#",
            "#...........WWWW.............#",
            "#...........WWWW.............#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############################"
        ],
        spawn: { x: 1.5, y: 8.5 },
        exits: [
            { x: 0, y: 7, targetMap: "highreach_settlement2", targetX: 28.5, targetY: 7.5, message: "You return to Settlement 15." }
        ],
        encounters: []
    },

    thermalis_city: {
        name: "Thermalis",
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
            { x: 14, y: 16, targetMap: "route_highreach_16_thermalis", targetX: 14.5, targetY: 1.5, message: "You return into Highreach." }
        ],
        encounters: [],
        npcs: []
    },

    route_4_harveston: {
        "name": "Greenvale — Road to Harveston",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.....T.......GGG.......T.....#",
                "#.............GGG.............#",
                "#.............GGG....VV.......#",
                "#..T..........GGG....VV.......#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGGGGGGGG.......#",
                "#.............GGGGGGGGG.......#",
                "#.............GGG.............#",
                "#.............GGG.....T.......#",
                "#.............GGG.............#",
                "#.....T.......GGG........T....#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 19.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "greenvale_settlement4",
                        "targetX": 15.5,
                        "targetY": 18.5,
                        "message": "You return to Settlement 4."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "harveston_city",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "Harveston lies ahead."
                }
        ],
        "encounters": [
                {
                        "species": "Brindlew",
                        "minLevel": 6,
                        "maxLevel": 8,
                        "weight": 70
                },
                {
                        "species": "Nimblet",
                        "minLevel": 6,
                        "maxLevel": 8,
                        "weight": 30
                }
        ]
},

    harveston_city: {
        "name": "Greenvale — Harveston",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######..T..GG......#######.#",
                "#.#######.....GG...T..#######.#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.#######..T..GG....T.#######.#",
                "#.#######.....GG......#######.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_4_harveston",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward Settlement 4."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_harveston_5",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "The southern road continues toward Settlement 5."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "harv-rest",
                        "type": "restoration",
                        "interaction": "restoration",
                        "name": "Harveston Restorer",
                        "x": 5,
                        "y": 10,
                        "color": "#69a9a0",
                        "lines": [
                                "Harveston is Greenvale's farming heart."
                        ]
                },
                {
                        "id": "harv-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Harvest Merchant",
                        "x": 25,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Fresh produce, supplies and capture crystals."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "revitalizingElixir",
                                        "capture"
                                ]
                        }
                },
                {
                        "id": "harv-ranger",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Windmill Keeper",
                        "x": 15,
                        "y": 7,
                        "color": "#7b9b63",
                        "lines": [
                                "The Great Windmill is the pride of Greenvale.",
                                "The southern road follows the old farm route."
                        ]
                },
                {
                        "id": "harv-gym",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Gym Attendant",
                        "x": 15,
                        "y": 12,
                        "color": "#7a7fb0",
                        "lines": [
                                "Harveston will eventually host Greenvale's Gym challenge."
                        ]
                }
        ]
},

    route_harveston_5: {
        "name": "Greenvale — Farm Road to Settlement 5",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.....VV......GGG.............#",
                "#.....VV......GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#.....VV....GGG...............#",
                "#.....VV....GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 19.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "harveston_city",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward Harveston."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "greenvale_settlement5",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "You reach Settlement 5."
                }
        ],
        "encounters": [
                {
                        "species": "Brindlew",
                        "minLevel": 8,
                        "maxLevel": 10,
                        "weight": 60
                },
                {
                        "species": "Pipiri",
                        "minLevel": 8,
                        "maxLevel": 10,
                        "weight": 40
                }
        ]
},

    route_5_6: {
        "name": "Greenvale — Southern Road to Settlement 6",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.....VV......GGG.............#",
                "#.....VV......GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#.....VV....GGG...............#",
                "#.....VV....GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "#...........GGG...............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 19.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "greenvale_settlement5",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward Settlement 5."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "greenvale_settlement6",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "You reach Settlement 6."
                }
        ],
        "encounters": [
                {
                        "species": "Brindlew",
                        "minLevel": 8,
                        "maxLevel": 10,
                        "weight": 60
                },
                {
                        "species": "Pipiri",
                        "minLevel": 8,
                        "maxLevel": 10,
                        "weight": 40
                }
        ]
},

    greenvale_settlement5: {
        "name": "Greenvale — Settlement 5",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######.....GG......#######.#",
                "#.#######..T..GG...T..#######.#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.#######..T..GG...T..#######.#",
                "#.#######.....GG......#######.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_harveston_5",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return along the road."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_5_6",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "The road continues south."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "greenvale_settlement5-resident",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Greenvale Resident",
                        "x": 15,
                        "y": 8,
                        "color": "#6b9ed2",
                        "lines": [
                                "Life here follows the farms, roads and seasons.",
                                "The Great Windmill is never far from travellers' minds."
                        ]
                },
                {
                        "id": "greenvale_settlement5-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Local Trader",
                        "x": 25,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Supplies for the long road."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "capture"
                                ]
                        }
                }
        ]
},

    greenvale_settlement6: {
        "name": "Greenvale — Settlement 6",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######.....GG......#######.#",
                "#.#######..T..GG...T..#######.#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.#######..T..GG...T..#######.#",
                "#.#######.....GG......#######.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_5_6",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return along the road."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "route_6_7",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "The road continues south."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "greenvale_settlement6-resident",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Greenvale Resident",
                        "x": 15,
                        "y": 8,
                        "color": "#6b9ed2",
                        "lines": [
                                "Life here follows the farms, roads and seasons.",
                                "The Great Windmill is never far from travellers' minds."
                        ]
                },
                {
                        "id": "greenvale_settlement6-merchant",
                        "type": "merchant",
                        "interaction": "merchant",
                        "name": "Local Trader",
                        "x": 25,
                        "y": 10,
                        "color": "#b88a52",
                        "lines": [
                                "Supplies for the long road."
                        ],
                        "shop": {
                                "inventory": [
                                        "basicRestore",
                                        "capture"
                                ]
                        }
                }
        ]
},

    greenvale_settlement7: {
        "name": "Greenvale — Settlement 7",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######.....GG......#######.#",
                "#.#######..T..GG...T..#######.#",
                "#.#######.....GG......#######.#",
                "#.#######.....GG......#######.#",
                "#.............GG..............#",
                "#.............GG..............#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGG#",
                "#GGGGGGGGGGGGGGGGGGGGGGGGGGGGGD",
                "#.............GG..............#",
                "#.............GG..............#",
                "#.#######.....GG..............#",
                "#.#######.....GG..............#",
                "#.#######.....GG..............#",
                "#.#######..T..GG..............#",
                "#.#######.....GG..............#",
                "#.............GG..............#",
                "#.............GG..............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 18.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "route_6_7",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward Settlement 6."
                }
        ],
        "encounters": [],
        "npcs": [
                {
                        "id": "s7-ferry",
                        "type": "ferry",
                        "interaction": "ferry",
                        "name": "Lume Ferrymaster",
                        "x": 25,
                        "y": 10,
                        "color": "#4f8fb5",
                        "destinationMap": "lume_city",
                        "destinationX": 7.5,
                        "destinationY": 18.5,
                        "returnX": 25.5,
                        "returnY": 10.5,
                        "lines": [
                                "The ferry crosses the Central Sea to Lume.",
                                "This is Greenvale's southern port."
                        ]
                },
                {
                        "id": "s7-res",
                        "type": "npc",
                        "interaction": "dialogue",
                        "name": "Dock Resident",
                        "x": 15,
                        "y": 8,
                        "color": "#6b9ed2",
                        "lines": [
                                "The sea makes this little settlement busier than it looks."
                        ]
                }
        ]
},

    route_6_7: {
        "name": "Greenvale — Road to Southern Port",
        "handBuilt": true,
        "data": [
                "###############D###############",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "#.............GGG.............#",
                "###############D###############"
        ],
        "spawn": {
                "x": 15.5,
                "y": 19.5
        },
        "exits": [
                {
                        "x": 15,
                        "y": 20,
                        "targetMap": "greenvale_settlement6",
                        "targetX": 15.5,
                        "targetY": 1.5,
                        "message": "You return toward Settlement 6."
                },
                {
                        "x": 15,
                        "y": 0,
                        "targetMap": "greenvale_settlement7",
                        "targetX": 15.5,
                        "targetY": 19.5,
                        "message": "You arrive at Greenvale's southern port settlement."
                }
        ],
        "encounters": [
                {
                        "species": "Brindlew",
                        "minLevel": 10,
                        "maxLevel": 12,
                        "weight": 70
                },
                {
                        "species": "Pipiri",
                        "minLevel": 10,
                        "maxLevel": 12,
                        "weight": 30
                }
        ]
},

    research_center: {
        name: "Entheon Research Center",
        handBuilt: true,
        data: [
            "########################",
            "#FFFFFFFFFFFFFFFFFFFFFF#",
            "#FSSSSFFFFCCCCFFFFSSSSF#",
            "#FSSSSFFFFCCCCFFFFSSSSF#",
            "#FFFFF....LLLL....FFFFF#",
            "#FFFFF....LLLL....FFFFF#",
            "#FFFFF..CC....CC..FFFFF#",
            "#FFFFF.................#",
            "#FFFF....LLLLLLLL....FF#",
            "#FFFF....LFFFFFFL....FF#",
            "#FSSS....LFFFFFFL....SF#",
            "#FSSS................SF#",
            "#F....P...CC....CC...PF#",
            "#F.....................#",
            "#F....SSSS....SSSS.....#",
            "#F.....................#",
            "#F.........D...........#",
            "########################"
        ],
        spawn: { x: 11.5, y: 15.5 },
        exits: [
            { x: 10, y: 16, targetMap: "town", targetX: 14.5, targetY: 7.5, message: "You step back outside into the southern Westmere settlement." }
        ],
        npcs: [
            { id: "researcher", type: "researcher", interaction: "professor", name: "Researcher", x: 5, y: 7, color: "#8b6bbd", lines: [
                "Welcome to the Entheon Research Center.",
                "Today is an important day. You are ready to begin your journey through Kaleo.",
                "I have three young Entheon here who are ready to meet a new trainer.",
                "When you are ready, take a look at them and choose the companion you connect with."
            ]},
            { id: "starter-nimblet", type: "starter", species: "Nimblet", name: "Nimblet", x: 10, y: 7, color: "#d3a65f", lines: ["Nimblet watches you curiously.", "It seems comfortable around you."] },
            { id: "starter-pipiri", type: "starter", species: "Pipiri", name: "Pipiri", x: 12, y: 7, color: "#78a9d8", lines: ["Pipiri looks up at you.", "It gives a small, energetic chirp."] },
            { id: "starter-morrowe", type: "starter", species: "Morrowe", name: "Morrowe", x: 14, y: 7, color: "#6e5b82", lines: ["Morrowe studies you quietly.", "There is something calm and watchful about it."] },
            { id: "assistant", type: "npc", interaction: "dialogue", name: "Research Assistant", x: 18, y: 7, color: "#5d9f9b", lines: [
                "Most of our work involves observing Entheon in their natural habitats.",
                "The more trainers explore, the more we learn.",
                "Perhaps your journey will teach us something new."
            ]}
        ]
    }
};


// ============================================================
// FULL-WORLD CONTENT PASS — REMAINING LOCATIONS
// These maps complete the currently missing playable nodes in the
// authoritative world graph. The route graph remains the source of truth;
// these are the physical environments layered on top of it.
// ============================================================
(function buildRemainingWorldMaps() {
    const W = 31, H = 21;
    const DIR = {
        north: { x: 15, y: 0 }, south: { x: 15, y: H - 1 },
        west: { x: 0, y: 10 }, east: { x: W - 1, y: 10 },
        northwest: { x: 1, y: 0 }, northeast: { x: W - 2, y: 0 },
        southwest: { x: 1, y: H - 1 }, southeast: { x: W - 2, y: H - 1 }
    };
    const inward = {
        north: { x: 15, y: 2 }, south: { x: 15, y: H - 3 },
        west: { x: 2, y: 10 }, east: { x: W - 3, y: 10 },
        northwest: { x: 3, y: 2 }, northeast: { x: W - 4, y: 2 },
        southwest: { x: 3, y: H - 3 }, southeast: { x: W - 4, y: H - 3 }
    };
    function blank(fill='G') {
        return Array.from({length:H},()=>Array(W).fill(fill));
    }
    function border(a) {
        for(let x=0;x<W;x++){a[0][x]='#';a[H-1][x]='#';}
        for(let y=0;y<H;y++){a[y][0]='#';a[y][W-1]='#';}
    }
    function carve(a,x,y,r=1,ch='.') {
        for(let yy=y-r;yy<=y+r;yy++) for(let xx=x-r;xx<=x+r;xx++)
            if(xx>=1&&xx<W-1&&yy>=1&&yy<H-1) a[yy][xx]=ch;
    }
    function building(a,x,y,w,h) {
        for(let yy=y;yy<y+h;yy++) for(let xx=x;xx<x+w;xx++)
            if(xx>=1&&xx<W-1&&yy>=1&&yy<H-1) a[yy][xx]='#';
        // front entrance/opening
        const ex=Math.floor(x+w/2);
        if(y+h<H-1) a[y+h][ex]='.';
    }
    function path(a, points, width=2) {
        for(let i=0;i<points.length-1;i++) {
            let [x,y]=points[i], [tx,ty]=points[i+1];
            const steps=Math.max(Math.abs(tx-x),Math.abs(ty-y));
            for(let n=0;n<=steps;n++) {
                const t=steps? n/steps:0, px=Math.round(x+(tx-x)*t), py=Math.round(y+(ty-y)*t);
                carve(a,px,py,width,'.');
            }
        }
    }
    function addExit(a, dir){ const p=DIR[dir]; a[p.y][p.x]='D'; carve(a,inward[dir].x,inward[dir].y,1,'.'); }
    function town(id,name,region,dirs,theme,extraNpcs=[]) {
        const a=blank(theme==='coast'?'G':'G'); border(a);
        // Town-first layout: roads are carved before buildings.
        path(a, [[15,2],[15,10],[15,18]], 2);
        path(a, [[3,10],[15,10],[27,10]], 2);
        path(a, [[7,4],[7,10]],1); path(a, [[23,4],[23,10]],1);
        path(a, [[7,10],[7,17]],1); path(a, [[23,10],[23,17]],1);
        building(a,3,3,7,4); building(a,21,3,7,4);
        building(a,3,13,7,4); building(a,21,13,7,4);
        // central civic building
        building(a,12,6,7,4);
        // water/harbour strip for coastal towns
        if(theme==='coast') {
            for(let y=15;y<19;y++) for(let x=24;x<30;x++) a[y][x]='W';
            for(let x=23;x<29;x++) a[14][x]='.';
        }
        // greenery in spare corners
        for(const [x,y] of [[2,2],[10,2],[20,2],[29,2],[2,18],[10,18],[20,18],[29,18],[11,12],[19,12]]) a[y][x]='G';
        dirs.forEach(d=>addExit(a,d));
        return {
            name, handBuilt:true, data:a.map(r=>r.join('')),
            spawn:{x:15.5,y:17.5},
            exits: dirs.map(d=>({x:DIR[d].x,y:DIR[d].y,targetMap:null,direction:d,message:''})),
            npcs:[
                {id:id+'-resident',type:'npc',interaction:'dialogue',name:'Local Resident',x:8,y:11,color:'#8b7653',lines:[
                    `Welcome to ${name}.`,
                    `The roads here connect this part of ${region} to the wider world.`,
                    `There is always another trail worth exploring.`
                ]},
                {id:id+'-merchant',type:'merchant',interaction:'merchant',name:'Local Merchant',x:22,y:11,color:'#b88a52',lines:['Need supplies before heading out? We have the basics.'],shop:{inventory:['basicRestore','revitalizingElixir','capture']}},
                {id:id+'-restoration',type:'restoration',interaction:'restoration',name:'Restoration Attendant',x:15,y:5,color:'#69a9a0',lines:['We can restore your Entheon before you continue your journey.']},
                ...extraNpcs
            ],
            encounters:[{species:'Brindlew',minLevel:10,maxLevel:14,weight:70},{species:'Virel',minLevel:10,maxLevel:14,weight:30}]
        };
    }
    function route(id,name,fromMap,toMap,dir,rev,theme='forest') {
        const a=blank('G'); border(a);
        // Build a broad, continuous trail before adding decorative terrain.
        const p1=DIR[rev], p2=DIR[dir], i1=inward[rev], i2=inward[dir];
        path(a, [[p1.x,p1.y],[i1.x,i1.y],[15,10],[i2.x,i2.y],[p2.x,p2.y]], 2);
        // Side terrain patches
        const tall = theme==='snow'?'G':'V';
        for(let y=3;y<H-3;y+=4) for(let x=3;x<W-3;x+=7) {
            if(a[y][x]==='G') { a[y][x]=tall; if(x+1<W-1&&a[y][x+1]==='G') a[y][x+1]=tall; }
        }
        if(theme==='coast') for(let y=2;y<7;y++) for(let x=24;x<29;x++) if(a[y][x]==='G') a[y][x]='W';
        if(theme==='mountain') for(const [x,y] of [[4,4],[7,5],[24,4],[26,6],[4,16],[25,16]]) if(a[y][x]==='G') a[y][x]='#';
        addExit(a,dir); addExit(a,rev);
        return {name,handBuilt:true,data:a.map(r=>r.join('')),spawn:{x:15.5,y:10.5},exits:[
            {x:DIR[rev].x,y:DIR[rev].y,targetMap:fromMap,targetX:15.5,targetY:10.5,message:`You return toward the previous location.`},
            {x:DIR[dir].x,y:DIR[dir].y,targetMap:toMap,targetX:15.5,targetY:10.5,message:`You continue along the trail toward the next location.`}
        ],encounters:[{species:'Brindlew',minLevel:12,maxLevel:16,weight:60},{species:'Virel',minLevel:12,maxLevel:16,weight:40}],npcs:[
            {id:id+'-trainer',type:'trainer',interaction:'trainer',name:'Trail Trainer',x:15,y:7,color:'#d26b6b',lines:['This route is a good place to test your team.'],battle:{reward:180,team:[{species:'Brindlew',level:13}],victory:'Well fought! Keep exploring.',defeat:'The road goes both ways. Try again when you are ready.'}},
            {id:id+'-ranger',type:'npc',interaction:'dialogue',name:'Ranger',x:9,y:12,color:'#5d9f9b',lines:['Stay on the trail when you can, and watch the grass for wild Entheon.']}
        ]};
    }
    function wire(map, list){ map.exits.forEach((e,i)=>{ const target=list[i]; if(target){e.targetMap=target.map;e.targetX=target.x??15.5;e.targetY=target.y??10.5;e.message=target.message||e.message;} }); }

    // Remaining route maps, in world-graph order.
    maps.route_gullhaven_13 = route('route_gullhaven_13','Southern Seawick Trail','gullhaven_city','seawick_settlement13','south','north','coast');
    maps.route_northreach_20 = route('route_northreach_20','Northreach to Settlement 20','northreach_city','hawthorne_settlement20','southeast','northwest','forest');
    maps.route_20_lakecrest = route('route_20_lakecrest','Lake Road to Lakecrest City','hawthorne_settlement20','lakecrest_city','southwest','northeast','forest');
    maps.route_lakecrest_21 = route('route_lakecrest_21','Southern Lakecrest Road','lakecrest_city','hawthorne_settlement21','south','north','forest');
    maps.route_21_22 = route('route_21_22','Northwest Branch to Settlement 22','hawthorne_settlement21','hawthorne_settlement22','northwest','southeast','forest');
    maps.route_21_23 = route('route_21_23','Southern Hawthorne Trail','hawthorne_settlement21','hawthorne_settlement23','south','north','forest');
    maps.route_lakecrest_26 = route('route_lakecrest_26','Eastmere Road','lakecrest_city','eastmere_settlement26','northeast','southwest','forest');
    maps.route_26_fairhaven = route('route_26_fairhaven','Fairhaven Approach','eastmere_settlement26','fairhaven_city','southeast','northwest','coast');
    maps.route_fairhaven_25 = route('route_fairhaven_25','Southern Fairhaven Road','fairhaven_city','eastmere_settlement25','south','north','coast');
    maps.route_fairhaven_24 = route('route_fairhaven_24','Southwest Coastal Road','fairhaven_city','eastmere_settlement24','southwest','northeast','coast');
    maps.route_24_23 = route('route_24_23','Lake-to-Coast Side Route','eastmere_settlement24','hawthorne_settlement23','northwest','southeast','forest');

    // Remaining settlements and cities.
    maps.seawick_settlement13 = town('seawick_settlement13','Settlement 13','Seawick',['north'],'coast',[
        {id:'s13-fisher',type:'npc',interaction:'dialogue',name:'Fisher',x:25,y:16,color:'#587c9c',lines:['The southern waters get rougher, but there is always something interesting out there.']}
    ]);
    maps.hawthorne_settlement20 = town('hawthorne_settlement20','Settlement 20','Hawthorne',['northwest','southwest'],'forest');
    maps.lakecrest_city = town('lakecrest_city','Lakecrest City','Hawthorne',['northeast','south'],'forest',[
        {id:'lakecrest-gym-guide',type:'npc',interaction:'dialogue',name:'Gym Attendant',x:25,y:6,color:'#8b6bbd',lines:['The Lakecrest Gym specializes in Volt-aligned Entheon. The challenge is ahead when you are ready.']}
    ]);
    maps.hawthorne_settlement21 = town('hawthorne_settlement21','Settlement 21','Hawthorne',['north','northwest','south'],'forest');
    maps.hawthorne_settlement22 = town('hawthorne_settlement22','Settlement 22','Hawthorne',['southeast'],'coast',[
        {id:'s22-port',type:'npc',interaction:'ferry',name:'Portmaster',x:25,y:14,color:'#587c9c',lines:['The ferry to Lume is ready when you are.']}
    ]);
    maps.hawthorne_settlement23 = town('hawthorne_settlement23','Settlement 23','Hawthorne',['north','southeast'],'forest');
    maps.eastmere_settlement26 = town('eastmere_settlement26','Settlement 26','Eastmere',['southwest','southeast'],'forest');
    maps.fairhaven_city = town('fairhaven_city','Fairhaven','Eastmere',['northwest','south','southwest'],'coast',[
        {id:'fairhaven-gym-guide',type:'npc',interaction:'dialogue',name:'Gym Attendant',x:25,y:6,color:'#8b6bbd',lines:['Fairhaven Gym is known for its Mystic-aligned trials.']}
    ]);
    maps.eastmere_settlement25 = town('eastmere_settlement25','Settlement 25','Eastmere',['north'],'forest');
    maps.eastmere_settlement24 = town('eastmere_settlement24','Settlement 24','Eastmere',['northeast','northwest'],'coast',[
        {id:'s24-port',type:'npc',interaction:'ferry',name:'Portmaster',x:25,y:14,color:'#587c9c',lines:['Lume is only a ferry ride away.']}
    ]);

    // Wire every new route to its actual endpoint map.
    wire(maps.route_gullhaven_13,[{map:'gullhaven_city',x:15.5,y:17.5},{map:'seawick_settlement13',x:15.5,y:17.5}]);
    wire(maps.route_northreach_20,[{map:'northreach_city'},{map:'hawthorne_settlement20'}]);
    wire(maps.route_20_lakecrest,[{map:'hawthorne_settlement20'},{map:'lakecrest_city'}]);
    wire(maps.route_lakecrest_21,[{map:'lakecrest_city'},{map:'hawthorne_settlement21'}]);
    wire(maps.route_21_22,[{map:'hawthorne_settlement21'},{map:'hawthorne_settlement22'}]);
    wire(maps.route_21_23,[{map:'hawthorne_settlement21'},{map:'hawthorne_settlement23'}]);
    wire(maps.route_lakecrest_26,[{map:'lakecrest_city'},{map:'eastmere_settlement26'}]);
    wire(maps.route_26_fairhaven,[{map:'eastmere_settlement26'},{map:'fairhaven_city'}]);
    wire(maps.route_fairhaven_25,[{map:'fairhaven_city'},{map:'eastmere_settlement25'}]);
    wire(maps.route_fairhaven_24,[{map:'fairhaven_city'},{map:'eastmere_settlement24'}]);
    wire(maps.route_24_23,[{map:'eastmere_settlement24'},{map:'hawthorne_settlement23'}]);

    // Correct settlement/city exit targets. Directional positions are kept
    // in the same compass direction as the authoritative route graph.
    wire(maps.seawick_settlement13,[{map:'route_gullhaven_13',x:15.5,y:2.5}]);
    wire(maps.hawthorne_settlement20,[{map:'route_northreach_20',x:27.5,y:2.5},{map:'route_20_lakecrest',x:3.5,y:18.5}]);
    wire(maps.lakecrest_city,[{map:'route_lakecrest_26',x:3.5,y:18.5},{map:'route_lakecrest_21',x:15.5,y:2.5}]);
    wire(maps.hawthorne_settlement21,[{map:'route_lakecrest_21',x:15.5,y:18.5},{map:'route_21_22',x:27.5,y:2.5},{map:'route_21_23',x:15.5,y:2.5}]);
    wire(maps.hawthorne_settlement22,[{map:'route_21_22',x:3.5,y:18.5}]);
    wire(maps.hawthorne_settlement23,[{map:'route_21_23',x:15.5,y:18.5},{map:'route_24_23',x:27.5,y:2.5}]);
    wire(maps.eastmere_settlement26,[{map:'route_lakecrest_26',x:27.5,y:2.5},{map:'route_26_fairhaven',x:3.5,y:18.5}]);
    wire(maps.fairhaven_city,[{map:'route_26_fairhaven',x:27.5,y:2.5},{map:'route_fairhaven_25',x:15.5,y:2.5},{map:'route_fairhaven_24',x:3.5,y:18.5}]);
    wire(maps.eastmere_settlement25,[{map:'route_fairhaven_25',x:15.5,y:18.5}]);
    wire(maps.eastmere_settlement24,[{map:'route_fairhaven_24',x:27.5,y:2.5},{map:'route_24_23',x:3.5,y:2.5}]);

    // Ensure newly built maps are discoverable through the existing map lookup.
    window.KALEO_REMAINING_WORLD_BUILT = true;
})();

// ============================================================
// COMPLETE LOCATION <-> ROUTE WIRING
// ============================================================
// Every endpoint in the authoritative route graph must expose a physical
// overland exit. Some older city/settlement maps only had their original
// return route, which made the world appear to stop there (notably
// Northreach). This pass derives the missing exits directly from the world
// graph, so a future route cannot silently exist without a way to enter it.
(function ensureAllWorldRouteExits() {
    if (!window.KALEO_WORLD?.routes) return;

    function dimensions(map) {
        return { w: map.data?.[0]?.length || 31, h: map.data?.length || 21 };
    }
    function pointForDirection(direction, w, h) {
        if (direction === 'north') return {x:Math.floor(w/2),y:0};
        if (direction === 'south') return {x:Math.floor(w/2),y:h-1};
        if (direction === 'west') return {x:0,y:Math.floor(h/2)};
        if (direction === 'east') return {x:w-1,y:Math.floor(h/2)};
        if (direction === 'northwest') return {x:1,y:0};
        if (direction === 'northeast') return {x:w-2,y:0};
        if (direction === 'southwest') return {x:1,y:h-1};
        if (direction === 'southeast') return {x:w-2,y:h-1};
        return {x:Math.floor(w/2),y:0};
    }
    function safeInside(direction,w,h) {
        if(direction==='north') return {x:Math.floor(w/2)+0.5,y:2.5};
        if(direction==='south') return {x:Math.floor(w/2)+0.5,y:h-3.5};
        if(direction==='west') return {x:2.5,y:Math.floor(h/2)+0.5};
        if(direction==='east') return {x:w-3.5,y:Math.floor(h/2)+0.5};
        if(direction==='northwest') return {x:3.5,y:2.5};
        if(direction==='northeast') return {x:w-4.5,y:2.5};
        if(direction==='southwest') return {x:3.5,y:h-4.5};
        if(direction==='southeast') return {x:w-4.5,y:h-4.5};
        return {x:Math.floor(w/2)+0.5,y:2.5};
    }
    function carveToEdge(map,p) {
        const rows=map.data.map(r=>r.split(''));
        const {w,h}=dimensions(map);
        const candidates=[];
        const add=(x,y)=>{if(x>=1&&x<w-1&&y>=1&&y<h-1)candidates.push([x,y]);};
        add(Math.round(p.x),Math.round(p.y));
        for(let r=1;r<=5;r++) for(let oy=-r;oy<=r;oy++) for(let ox=-r;ox<=r;ox++) add(Math.round(p.x)+ox,Math.round(p.y)+oy);
        for(const [x,y] of candidates){
            if(!['#','W','T'].includes(rows[y]?.[x])){
                rows[y][x]='.';
                // connect to the nearest boundary door with a simple L-shaped corridor
                let cx=x,cy=y;
                const tx=p.x<2?1:p.x>w-3?w-2:Math.round(p.x);
                const ty=p.y<2?1:p.y>h-3?h-2:Math.round(p.y);
                const steps=Math.max(Math.abs(tx-cx),Math.abs(ty-cy));
                for(let i=0;i<=steps;i++){
                    const t=steps?i/steps:0, xx=Math.round(cx+(tx-cx)*t), yy=Math.round(cy+(ty-cy)*t);
                    if(rows[yy]?.[xx]!==undefined && rows[yy][xx]!=='W') rows[yy][xx]='.';
                }
                break;
            }
        }
        map.data=rows.map(r=>r.join(''));
    }

    window.KALEO_WORLD.routes.forEach(route => {
        const endpoints=[
            {location:route.from,direction:route.direction,targetX:route.mapId ? safeInside(route.reverseDirection, (maps[route.mapId]?.data?.[0]?.length||31), (maps[route.mapId]?.data?.length||21)).x : 15.5,targetY:route.mapId ? safeInside(route.reverseDirection, (maps[route.mapId]?.data?.[0]?.length||31), (maps[route.mapId]?.data?.length||21)).y : 10.5},
            {location:route.to,direction:route.reverseDirection,targetX:route.mapId ? safeInside(route.direction, (maps[route.mapId]?.data?.[0]?.length||31), (maps[route.mapId]?.data?.length||21)).x : 15.5,targetY:route.mapId ? safeInside(route.direction, (maps[route.mapId]?.data?.[0]?.length||31), (maps[route.mapId]?.data?.length||21)).y : 10.5}
        ];
        endpoints.forEach(ep=>{
            const loc=window.KALEO_WORLD.getLocation(ep.location);
            const map=loc?.mapId ? maps[loc.mapId] : null;
            if(!map || !route.mapId) return;
            const {w,h}=dimensions(map);
            const pos=pointForDirection(ep.direction,w,h);
            map.exits=Array.isArray(map.exits)?map.exits:[];
            const existing=map.exits.find(e=>e.targetMap===route.mapId);
            if(existing){
                existing.x=pos.x; existing.y=pos.y; existing.direction=ep.direction;
                existing.targetX=ep.targetX; existing.targetY=ep.targetY;
            } else {
                map.exits.push({x:pos.x,y:pos.y,targetMap:route.mapId,targetX:ep.targetX,targetY:ep.targetY,direction:ep.direction,message:`You follow the route toward ${loc?.name ? (ep.location===route.from ? window.KALEO_WORLD.getLocation(route.to)?.name : window.KALEO_WORLD.getLocation(route.from)?.name) : 'the next area'}.`});
            }
            const rows=map.data.map(r=>r.split(''));
            rows[pos.y][pos.x]='D';
            map.data=rows.map(r=>r.join(''));
            carveToEdge(map,safeInside(ep.direction,w,h));
        });
    });
})();

// ============================================================
// DIRECTIONAL WORLD ROUTE LAYOUT
// ============================================================
// The world map is authoritative for the direction in which a route leaves
// a location.  Placeholder maps use the same directional metadata now, so
// later visual/world-building work does not have to move route entrances.
//
// Directions are expressed from the current map toward the destination:
//   north, northeast, east, southeast, south, southwest, west, northwest
//
// For diagonal routes, the exit is placed near the corresponding corner.
// The target spawn is placed at the opposite side of the destination map.

const DIRECTIONAL_ROUTE_LAYOUT = {
    north:      { x: 0.5, y: 0 },
    northeast:  { x: 1,   y: 0 },
    east:       { x: 1,   y: 0.5 },
    southeast:  { x: 1,   y: 1 },
    south:      { x: 0.5, y: 1 },
    southwest:  { x: 0,   y: 1 },
    west:       { x: 0,   y: 0.5 },
    northwest:  { x: 0,   y: 0 }
};

function oppositeDirection(direction) {
    return {
        north: "south",
        northeast: "southwest",
        east: "west",
        southeast: "northwest",
        south: "north",
        southwest: "northeast",
        west: "east",
        northwest: "southeast"
    }[direction] || null;
}

// Return a player spawn point safely inside the map, rather than directly on
// or immediately beside the doorway. This prevents an arrival from being
// interpreted as another exit and sending the player straight back.
function directionalSpawnPoint(direction, width, height) {
    const inset = 2.5;
    const centerX = (width - 1) / 2 + 0.5;
    const centerY = (height - 1) / 2 + 0.5;

    switch (direction) {
        case "north": return { x: centerX, y: inset };
        case "northeast": return { x: width - inset, y: inset };
        case "east": return { x: width - inset, y: centerY };
        case "southeast": return { x: width - inset, y: height - inset };
        case "south": return { x: centerX, y: height - inset };
        case "southwest": return { x: inset, y: height - inset };
        case "west": return { x: inset, y: centerY };
        case "northwest": return { x: inset, y: inset };
        default: return null;
    }
}

function directionalPoint(direction, width, height) {
    const spec = DIRECTIONAL_ROUTE_LAYOUT[direction];
    if (!spec) return null;

    // Cardinal exits sit in the middle of their boundary. Diagonal exits
    // sit near the corresponding corner, but NEVER on the literal corner
    // tile. A corner door is unreachable on these maps because the two
    // perpendicular boundary tiles beside it are walls. Keeping one tile
    // of horizontal/vertical clearance makes every directional exit
    // physically reachable while preserving its intended compass direction.
    if (direction === "north") return { x: Math.floor(width / 2), y: 0 };
    if (direction === "south") return { x: Math.floor(width / 2), y: height - 1 };
    if (direction === "west") return { x: 0, y: Math.floor(height / 2) };
    if (direction === "east") return { x: width - 1, y: Math.floor(height / 2) };

    const edgeInset = 1;

    if (direction === "northwest") return { x: edgeInset, y: 0 };
    if (direction === "northeast") return { x: width - 1 - edgeInset, y: 0 };
    if (direction === "southwest") return { x: edgeInset, y: height - 1 };
    if (direction === "southeast") return { x: width - 1 - edgeInset, y: height - 1 };

    return null;
}

function mapIdForLocation(locationId) {
    return window.KALEO_WORLD?.getLocation(locationId)?.mapId || null;
}

function routeForMapId(mapId) {
    return window.KALEO_WORLD?.routes?.find(route => route.mapId === mapId) || null;
}

function directionalExitInfo(mapId, exit) {
    const routes = window.KALEO_WORLD?.routes || [];

    // First handle a playable route map. A route map has one authoritative
    // graph entry, and its exits lead back to the two endpoint locations.
    const route = routeForMapId(mapId);
    if (route) {
        const fromMap = mapIdForLocation(route.from);
        const toMap = mapIdForLocation(route.to);

        if (exit.targetMap === fromMap) {
            return { direction: route.reverseDirection };
        }
        if (exit.targetMap === toMap) {
            return { direction: route.direction };
        }
        return null;
    }

    // Location maps can have several outgoing routes. The old implementation
    // only looked up a route by *route-map id*, which meant location exits
    // silently kept whatever coordinates happened to be in the placeholder
    // map. That is why a Settlement 2 branch could still appear at the top
    // of the map instead of leaving west/east according to the world map.
    const location = window.KALEO_WORLD?.locations?.find(loc => loc.mapId === mapId);
    if (!location) return null;

    const matchingRoute = routes.find(candidate => {
        if (candidate.from === location.id) {
            return exit.targetMap === candidate.mapId;
        }
        if (candidate.to === location.id) {
            return exit.targetMap === candidate.mapId;
        }
        return false;
    });

    if (!matchingRoute) return null;

    return {
        direction: matchingRoute.from === location.id
            ? matchingRoute.direction
            : matchingRoute.reverseDirection
    };
}


function ensureExitApproach(map, exit) {
    // Directional exits are not just visual markers: the player must have a
    // walkable approach to every door. This matters especially for diagonal
    // route exits, where a door near a corner can otherwise end up behind a
    // wall/void section of an irregular map.
    const width = map.data[0].length;
    const height = map.data.length;
    const direction = exit.direction;
    if (!direction) return;

    const inward = {
        north: [0, 1],
        northeast: [-1, 1],
        east: [-1, 0],
        southeast: [-1, -1],
        south: [0, -1],
        southwest: [1, -1],
        west: [1, 0],
        northwest: [1, 1]
    }[direction];

    if (!inward) return;

    const rows = map.data.map(row => row.split(""));
    let x = exit.x;
    let y = exit.y;

    const isWalkable = (tx, ty) => {
        if (tx < 0 || tx >= width || ty < 0 || ty >= height) return false;
        const tile = rows[ty][tx];
        return tile !== TILE.WALL && tile !== TILE.VOID && tile !== TILE.TREE && tile !== TILE.WATER && tile !== TILE.SHELF && tile !== TILE.LAB && tile !== TILE.DISPLAY;
    };

    // Carve only until we hit existing walkable terrain. This preserves the
    // hand-built terrain while guaranteeing a continuous route to the door.
    for (let i = 0; i < Math.max(width, height); i++) {
        const nx = x + inward[0];
        const ny = y + inward[1];
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) break;

        if (isWalkable(nx, ny)) break;

        rows[ny][nx] = TILE.PATH;
        x = nx;
        y = ny;
    }

    map.data = rows.map(row => row.join(""));
}

function applyDirectionalRouteLayout() {
    Object.entries(maps).forEach(([mapId, map]) => {
        const exits = map.exits || [];
        const width = map.data[0].length;
        const height = map.data.length;

        exits.forEach(exit => {
            const info = directionalExitInfo(mapId, exit);
            if (!info?.direction) return;

            exit.direction = info.direction;
            const point = directionalPoint(info.direction, width, height);
            if (!point) return;

            exit.x = point.x;
            exit.y = point.y;

            // Ensure the directional doorway is physically reachable from
            // the interior, including diagonal exits on irregular maps.
            ensureExitApproach(map, exit);

            // Put the player's arrival point on the matching opposite edge
            // when this exit targets another route/location map. This keeps
            // placeholder routes directional before the final maps exist.
            if (exit.targetMap && maps[exit.targetMap]) {
                const targetWidth = maps[exit.targetMap].data[0].length;
                const targetHeight = maps[exit.targetMap].data.length;
                const entryDirection = oppositeDirection(info.direction);
                const targetPoint = directionalPoint(entryDirection, targetWidth, targetHeight);

                if (targetPoint) {
                    const spawn = directionalSpawnPoint(entryDirection, targetWidth, targetHeight);
                    if (spawn) {
                        exit.targetX = spawn.x;
                        exit.targetY = spawn.y;
                    }
                }
            }
        });

        // Rebuild the visible doorway tiles from the authoritative exit
        // positions. This is deliberately done after map declarations so
        // placeholder geometry cannot drift away from the route graph.
        const rows = map.data.map(row => row.split(""));

        // Clear only boundary doorway tiles. Interior building doors are not
        // route exits and must remain untouched.
        for (let y = 0; y < rows.length; y++) {
            for (let x = 0; x < rows[y].length; x++) {
                if (x === 0 || x === rows[y].length - 1 || y === 0 || y === rows.length - 1) {
                    if (rows[y][x] === TILE.DOOR) rows[y][x] = TILE.WALL;
                }
            }
        }

        exits.forEach(exit => {
            if (exit.x < 0 || exit.y < 0 || exit.y >= rows.length || exit.x >= rows[exit.y].length) return;
            rows[exit.y][exit.x] = TILE.DOOR;
        });
        map.data = rows.map(row => row.join(""));
    });
}

applyDirectionalRouteLayout();

// ============================================================
// NATURAL WORLD MAP GEOMETRY
// ============================================================
// The prototype used rectangular rooms with a wall around every edge.
// That was useful while validating connectivity, but it made overland
// routes and settlements feel like boxes. The route graph remains the
// authority for connectivity; this layer only gives each playable map an
// irregular physical footprint and a believable path network.

const TILE_VOID = " ";
TILE.VOID = TILE_VOID;

function stableNoise(x, y, seed = 1) {
    const n = Math.sin((x * 127.1 + y * 311.7 + seed * 74.3)) * 43758.5453;
    return n - Math.floor(n);
}

function mapTheme(mapId, mapName) {
    const text = `${mapId} ${mapName}`.toLowerCase();
    if (text.includes("seawick") || text.includes("gullhaven") || text.includes("lume")) return "coast";
    if (text.includes("highreach") || text.includes("thermalis") || text.includes("winterhold")) return "mountain";
    if (text.includes("northvale") || text.includes("northreach")) return "north";
    if (text.includes("dunridge")) return "hill";
    if (text.includes("greenvale")) return "forest";
    if (text.includes("eastmere") || text.includes("lakecrest") || text.includes("hawthorne")) return "lake";
    return "grassland";
}

function stepToward(x, y, tx, ty) {
    return {
        x: x + Math.sign(tx - x),
        y: y + Math.sign(ty - y)
    };
}

function carveCorridor(grid, x, y, tx, ty, width = 2) {
    let cx = x;
    let cy = y;
    const maxSteps = grid.length * grid[0].length * 2;
    for (let i = 0; i < maxSteps; i++) {
        for (let oy = -width + 1; oy <= width - 1; oy++) {
            for (let ox = -width + 1; ox <= width - 1; ox++) {
                const gx = cx + ox;
                const gy = cy + oy;
                if (gy >= 0 && gy < grid.length && gx >= 0 && gx < grid[0].length) {
                    grid[gy][gx] = TILE.PATH;
                }
            }
        }
        if (cx === tx && cy === ty) break;
        const next = stepToward(cx, cy, tx, ty);
        // Add a slight bend so routes don't look like perfectly straight
        // hallways. The deterministic pattern keeps the result repeatable.
        if (next.x !== cx && next.y !== cy && ((cx + cy) % 5 === 0)) {
            cy += Math.sign(ty - cy);
        } else if ((cx + cy) % 7 === 0 && next.x !== cx) {
            cy += Math.sign(ty - cy);
        } else {
            cx = next.x;
            cy = next.y;
        }
    }
}

function naturalFootprint(width, height, kind, seed) {
    const mask = Array.from({ length: height }, () => Array(width).fill(false));
    for (let y = 0; y < height; y++) {
        const vertical = y / Math.max(1, height - 1);
        const wave = Math.sin((y + seed) * 0.65) * 1.6;
        let left = 1.5 + wave;
        let right = width - 2.5 - Math.cos((y + seed) * 0.47) * 1.4;

        if (kind === "route") {
            left += 1.5 * Math.sin(vertical * Math.PI);
            right -= 1.0 * Math.sin(vertical * Math.PI);
        } else {
            left += (y < 3 ? 1.5 : 0);
            right -= (y > height - 4 ? 1.5 : 0);
        }

        for (let x = 0; x < width; x++) {
            let inside = x >= left && x <= right;
            if (kind !== "route") {
                const topNotch = y < 2 && (x < 4 || x > width - 5);
                const bottomNotch = y > height - 3 && (x < 2 || x > width - 4);
                inside = inside && !topNotch && !bottomNotch;
            }
            mask[y][x] = inside;
        }
    }
    return mask;
}

function ensureAllExitCorridors(map) {
    if (!map?.data?.length) return;

    const height = map.data.length;
    const width = Math.max(...map.data.map(row => row.length));
    const exits = map.exits || [];
    if (!exits.length) return;

    const grid = map.data.map(row => row.padEnd(width, TILE_VOID).split(""));
    const isBlocked = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return true;
        return [TILE.WALL, TILE.VOID, TILE.TREE, TILE.WATER].includes(grid[y][x]);
    };

    // Carve from every boundary door toward the map's central road hub.
    // This runs after terrain/buildings are generated, so later procedural
    // decoration can never strand a doorway behind an inaccessible patch.
    const hub = { x: Math.floor(width / 2), y: Math.floor(height / 2) };

    exits.forEach(exit => {
        const ex = Math.max(0, Math.min(width - 1, Math.round(exit.x)));
        const ey = Math.max(0, Math.min(height - 1, Math.round(exit.y)));
        let cx = ex;
        let cy = ey;

        for (let i = 0; i < width * height; i++) {
            grid[cy][cx] = TILE.PATH;
            if (cx === hub.x && cy === hub.y) break;

            // Prefer moving toward the hub on the axis that is furthest away.
            const dx = hub.x - cx;
            const dy = hub.y - cy;
            if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) cx += Math.sign(dx);
            else if (dy !== 0) cy += Math.sign(dy);
            else break;

            // Keep a one-tile trail width.
            if (grid[cy]?.[cx] !== undefined) grid[cy][cx] = TILE.PATH;
        }
    });

    // Reapply the actual doors after carving.
    exits.forEach(exit => {
        const x = Math.round(exit.x);
        const y = Math.round(exit.y);
        if (grid[y]?.[x] !== undefined) grid[y][x] = TILE.DOOR;
    });

    map.data = grid.map(row => row.join(""));
}

function buildNaturalMap(mapId, map) {
    if (!map?.data?.length) return;
    if (mapId === "research_center" || map.handBuilt) return;

    const height = map.data.length;
    const width = Math.max(...map.data.map(row => row.length));
    const theme = mapTheme(mapId, map.name);
    const isRoute = mapId.startsWith("route_");
    const isCity = /city/i.test(map.name) || mapId === "town" || mapId.startsWith("westmere_settlement") || mapId.startsWith("greenvale_settlement") || mapId.startsWith("dunridge_settlement") || mapId.startsWith("highreach_settlement") || mapId.startsWith("northvale_settlement") || mapId.startsWith("seawick_settlement");
    const seed = mapId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const mask = naturalFootprint(width, height, isRoute ? "route" : "settlement", seed % 19);
    const grid = Array.from({ length: height }, () => Array(width).fill(TILE_VOID));

    // Turn the irregular footprint into walkable ground.
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (mask[y][x]) grid[y][x] = TILE.GRASS;
        }
    }

    // Keep existing interior landmarks where the new footprint still contains
    // them. This preserves the Research Center footprint in the starting town
    // while allowing the outer landscape to become organic. Boundary walls and
    // route doors are rebuilt by this geometry layer.
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < Math.min(width, map.data[y].length); x++) {
            const old = map.data[y][x];
            const boundary = x === 0 || y === 0 || x === width - 1 || y === height - 1;
            if (old === TILE.TREE || old === TILE.WATER || old === TILE.TALL_GRASS) {
                if (mask[y][x]) grid[y][x] = old;
            } else if (!boundary && (old === TILE.WALL || old === TILE.DOOR)) {
                grid[y][x] = old;
            }
        }
    }

    const exits = map.exits || [];
    const interiorX = Math.floor(width / 2);
    const interiorY = Math.floor(height / 2);

    // Every exit gets a proper path that enters the map. For settlements this
    // creates a road network; for routes it creates a trail between endpoints.
    const hubs = [];
    exits.forEach(exit => {
        const ex = Math.max(0, Math.min(width - 1, Math.round(exit.x)));
        const ey = Math.max(0, Math.min(height - 1, Math.round(exit.y)));
        const targetX = isRoute && exits.length === 2
            ? Math.round((ex + (exits.find(e => e !== exit)?.x ?? interiorX)) / 2)
            : interiorX;
        const targetY = isRoute && exits.length === 2
            ? Math.round((ey + (exits.find(e => e !== exit)?.y ?? interiorY)) / 2)
            : interiorY;
        grid[ey][ex] = TILE.PATH;
        carveCorridor(grid, ex, ey, targetX, targetY, isRoute ? 1 : 2);
        hubs.push({ x: targetX, y: targetY });
    });

    // Connect route endpoints through the middle so a route is a continuous
    // landscape rather than two disconnected strips.
    if (isRoute && exits.length >= 2) {
        const a = exits[0], b = exits[1];
        carveCorridor(grid, Math.round(a.x), Math.round(a.y), Math.round(b.x), Math.round(b.y), 1);
    }

    // Add regional terrain away from the road. This is intentionally light:
    // detailed settlement architecture and landmarks can be authored later.
    const terrainDensity = isRoute ? 0.08 : 0.13;
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (grid[y][x] !== TILE.GRASS) continue;
            if (stableNoise(x, y, seed) > terrainDensity) continue;

            const nearPath = [
                [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
            ].some(([nx, ny]) => grid[ny]?.[nx] === TILE.PATH);
            if (nearPath) continue;

            if (theme === "coast" && (x < 4 || y > height - 5) && stableNoise(x + 3, y + 7, seed) > 0.35) {
                grid[y][x] = TILE.WATER;
            } else if (theme === "mountain" && stableNoise(x, y, seed + 4) > 0.58) {
                grid[y][x] = TILE.WALL;
            } else if (theme === "north" && stableNoise(x, y, seed + 8) > 0.60) {
                grid[y][x] = TILE.TREE;
            } else if (theme === "forest" || theme === "grassland") {
                grid[y][x] = stableNoise(x, y, seed + 12) > 0.45 ? TILE.TREE : TILE.TALL_GRASS;
            } else if (theme === "hill" || theme === "lake") {
                grid[y][x] = stableNoise(x, y, seed + 16) > 0.55 ? TILE.TREE : TILE.TALL_GRASS;
            }
        }
    }

    // Settlements get a few compact building footprints rather than one
    // giant empty rectangle. Do not place them on roads, exits or NPCs.
    if (!isRoute && isCity) {
        const reserved = new Set();
        exits.forEach(e => reserved.add(`${Math.round(e.x)},${Math.round(e.y)}`));
        (map.npcs || []).forEach(n => reserved.add(`${Math.round(n.x)},${Math.round(n.y)}`));

        const buildingSeeds = [
            [5, 4, 5, 3],
            [width - 10, 4, 5, 3],
            [5, height - 7, 6, 3],
            [width - 11, height - 7, 6, 3]
        ];
        buildingSeeds.forEach(([bx, by, bw, bh], index) => {
            for (let y = by; y < by + bh; y++) {
                for (let x = bx; x < bx + bw; x++) {
                    if (!mask[y]?.[x]) continue;
                    if (reserved.has(`${x},${y}`)) continue;
                    grid[y][x] = TILE.WALL;
                }
            }
            const doorX = bx + Math.floor(bw / 2);
            const doorY = index < 2 ? by + bh : by - 1;
            if (mask[doorY]?.[doorX]) grid[doorY][doorX] = TILE.DOOR;
        });
    }

    // Re-apply boundary exit tiles last. The automatic route system expects
    // these exact coordinates to remain the transition points.
    exits.forEach(exit => {
        const x = Math.round(exit.x);
        const y = Math.round(exit.y);
        if (grid[y]?.[x] !== undefined) grid[y][x] = TILE.DOOR;
    });

    map.data = grid.map(row => row.join(""));
}


// ============================================================
// FULL-WORLD CONTENT PASS
// Build any remaining graph locations/routes that do not yet have a
// hand-authored map. These are deliberately content-rich themed maps,
// not blank placeholders, and they inherit their exits from the
// authoritative world graph so the physical world follows the map.
// ============================================================
function slugMapId(id) { return String(id).replace(/[^a-zA-Z0-9_-]/g, "_"); }
function regionTheme(region) {
    return {
        westmere:"forest", greenvale:"grassland", dunridge:"hill", seawick:"coast",
        highreach:"mountain", northvale:"north", isen:"frost", hawthorne:"lake", eastmere:"coast", lume:"coast"
    }[region] || "grassland";
}
function directionPoint(dir, w=31, h=21, inset=2) {
    const cx=Math.floor(w/2), cy=Math.floor(h/2);
    return {
        north:{x:cx,y:0,ix:cx,iy:3}, south:{x:cx,y:h-1,ix:cx,iy:h-4},
        east:{x:w-1,y:cy,ix:w-4,iy:cy}, west:{x:0,y:cy,ix:3,iy:cy},
        northeast:{x:w-1-inset,y:inset,ix:w-5,iy:3}, northwest:{x:inset,y:inset,ix:4,iy:3},
        southeast:{x:w-1-inset,y:h-1-inset,ix:w-5,iy:h-4}, southwest:{x:inset,y:h-1-inset,ix:4,iy:h-4}
    }[dir] || {x:cx,y:0,ix:cx,iy:3};
}
function oppositeDir(dir){ return {north:"south",south:"north",east:"west",west:"east",northeast:"southwest",northwest:"southeast",southeast:"northwest",southwest:"northeast"}[dir] || "south"; }
function autoMapIdForLocation(loc){ return loc.mapId || `${loc.region}_${slugMapId(loc.id.replace(/^.*?-/,'settlement_'))}`; }
function autoMapIdForRoute(route){ return route.mapId || `route_${slugMapId(route.id)}`; }
function ensureFullWorldMapIds(){
    KALEO_WORLD.locations.forEach(loc=>{ if(!loc.mapId) loc.mapId=autoMapIdForLocation(loc); });
    KALEO_WORLD.routes.forEach(route=>{ if(!route.mapId) route.mapId=autoMapIdForRoute(route); });
}
function themedBase(theme,w=31,h=21){
    const rows=Array.from({length:h},()=>Array(w).fill(TILE.GRASS));
    for(let x=0;x<w;x++){rows[0][x]=TILE.TREE; rows[h-1][x]=TILE.TREE;}
    for(let y=0;y<h;y++){rows[y][0]=TILE.TREE; rows[y][w-1]=TILE.TREE;}
    return rows;
}
function addBuilding(grid,x,y,w=5,h=3){
    for(let yy=y;yy<y+h;yy++) for(let xx=x;xx<x+w;xx++) if(grid[yy]?.[xx]!==undefined) grid[yy][xx]=TILE.WALL;
    const dx=x+Math.floor(w/2); if(grid[y+h]?.[dx]!==undefined) grid[y+h][dx]=TILE.DOOR;
}
function createAutoWorldMap(mapId,name,region,exits,kind){
    const w=31,h=21, theme=regionTheme(region), grid=themedBase(theme,w,h);
    // Broad central public space and themed terrain.
    const seed=mapId.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
    for(let y=1;y<h-1;y++) for(let x=1;x<w-1;x++){
        const n=(x*37+y*53+seed*11)%101;
        if(theme==='coast' && (x<4 || x>w-5) && n>62) grid[y][x]=TILE.WATER;
        else if(theme==='mountain' && n>91) grid[y][x]=TILE.WALL;
        else if((theme==='forest'||theme==='north'||theme==='frost') && n>84) grid[y][x]=TILE.TREE;
        else if((theme==='forest'||theme==='grassland'||theme==='hill') && n>88) grid[y][x]=TILE.TALL_GRASS;
        else if(theme==='lake' && n>90) grid[y][x]=TILE.WATER;
    }
    // Roads/trails are carved first and remain walkable.
    exits.forEach(e=>{ const p=directionPoint(e.direction,w,h); e.x=p.x;e.y=p.y;e.innerX=p.ix;e.innerY=p.iy; carveCorridor(grid,p.x,p.y,p.ix,p.iy,2); });
    if(exits.length>1){
        const hub={x:Math.floor(w/2),y:Math.floor(h/2)};
        exits.forEach(e=>carveCorridor(grid,e.innerX,e.innerY,hub.x,hub.y,2));
    }
    // Settlement/city architecture sits around the roads.
    if(kind==='location'){
        addBuilding(grid,4,3,5,3); addBuilding(grid,22,3,5,3); addBuilding(grid,4,14,5,3); addBuilding(grid,22,14,5,3);
        for(let x=11;x<20;x++) for(let y=9;y<12;y++) if(grid[y][x]===TILE.GRASS) grid[y][x]=TILE.PATH;
    }
    exits.forEach(e=>{grid[e.y][e.x]=TILE.DOOR;});
    const data=grid.map(r=>r.join(''));
    const npcs=[];
    if(kind==='location'){
        npcs.push({id:`${mapId}-resident`,type:'npc',interaction:'dialogue',name:'Local Resident',x:Math.floor(w/2)-4,y:Math.floor(h/2),color:'#8b7653',lines:[`Welcome to ${name}.`, `The roads here connect to ${exits.length} direction${exits.length===1?'':'s'}.`]});
        if(name.includes('City') || ['Harveston','Gullhaven','Thermalis','Northreach','Lakecrest City','Fairhaven','Winterhold'].includes(name)){
            npcs.push({id:`${mapId}-shop`,type:'merchant',interaction:'merchant',name:'Local Merchant',x:24,y:10,color:'#b88a52',lines:['Need supplies for the road?'],shop:{inventory:['basicRestore','capture']}});
            npcs.push({id:`${mapId}-restore`,type:'restoration',interaction:'restoration',name:'Restoration Attendant',x:7,y:10,color:'#69a9a0',lines:['Your Entheon are welcome here.']});
        }
    } else {
        npcs.push({id:`${mapId}-ranger`,type:'npc',interaction:'dialogue',name:'Route Ranger',x:Math.floor(w/2),y:Math.floor(h/2)-3,color:'#6b8f5b',lines:['Keep to the trail and watch the tall grass.']});
    }
    return {name,theme,handBuilt:false,data,spawn:{x:Math.floor(w/2)+.5,y:Math.floor(h/2)+.5},exits:exits.map(e=>({x:e.x,y:e.y,targetMap:e.targetMap,targetX:e.targetX,targetY:e.targetY,message:e.message})),encounters:kind==='route'?[{species:region==='seawick'?'Brindlew':'Orrin',minLevel:6,maxLevel:12,weight:100}]:[],npcs};
}
function createFullWorldMaps(){
    ensureFullWorldMapIds();
    // Locations: every overland connection becomes a physical exit.
    KALEO_WORLD.locations.forEach(loc=>{
        const mapId=loc.mapId; if(maps[mapId]) return;
        const connected=KALEO_WORLD.routes.filter(r=>r.from===loc.id || r.to===loc.id).map(r=>{
            const from= r.from===loc.id, dir=from?r.direction:r.reverseDirection, other=from?r.to:r.from;
            const target=KALEO_WORLD.getLocation(other); const p=directionPoint(dir);
            return {direction:dir,x:p.x,y:p.y,targetMap:target.mapId,targetX:directionPoint(oppositeDir(dir)).ix+.5,targetY:directionPoint(oppositeDir(dir)).iy+.5,message:`You follow the ${r.kind==='secondary-trail'?'side trail':'route'} toward ${target.name}.`};
        });
        maps[mapId]=createAutoWorldMap(mapId,loc.name,loc.region,connected,'location');
    });
    // Routes: two exits, one back and one forward.
    KALEO_WORLD.routes.forEach(r=>{
        const mapId=r.mapId; if(maps[mapId]) return;
        const a=KALEO_WORLD.getLocation(r.from), b=KALEO_WORLD.getLocation(r.to);
        const p1=directionPoint(r.direction), p2=directionPoint(r.reverseDirection);
        maps[mapId]=createAutoWorldMap(mapId,`${a.name} — Route to ${b.name}`,a.region,[
            {direction:r.direction,x:p1.x,y:p1.y,targetMap:b.mapId,targetX:p2.ix+.5,targetY:p2.iy+.5,message:`You continue toward ${b.name}.`},
            {direction:r.reverseDirection,x:p2.x,y:p2.y,targetMap:a.mapId,targetX:p1.ix+.5,targetY:p1.iy+.5,message:`You head back toward ${a.name}.`}
        ],'route');
    });
}
createFullWorldMaps();

Object.entries(maps).forEach(([mapId, map]) => buildNaturalMap(mapId, map));
Object.values(maps).forEach(map => ensureAllExitCorridors(map));

// Final world-graph normalization pass.
// Natural terrain generation can rebuild the physical map after the first
// directional pass. Re-apply the authoritative route directions afterwards
// so every route keeps the correct compass exits AND arrival side.
// This is especially important for diagonal routes such as
// Stonehaven ↔ Mullhaven, which must use northwest/southeast entrances
// rather than the old east/west placeholder doors.
applyDirectionalRouteLayout();
Object.values(maps).forEach(map => ensureAllExitCorridors(map));

// ============================================================
// ROUTE REVAMP — ADVENTURE-SIZED OVERLAND ROUTES
// ============================================================
// Routes are intentionally larger than settlements, but not simply giant
// rectangles. Each route gets a distinct regional environment, a readable
// main trail, optional detours, encounter pockets and breathing room around
// landmarks/trainers. Connectivity remains driven by the authoritative
// route graph above.
function routeRevampTheme(map) {
    const text = `${map.name} ${map.id || ""}`.toLowerCase();
    if (text.includes("seawick") || text.includes("gullhaven") || text.includes("coast") || text.includes("mullhaven")) return "coast";
    if (text.includes("highreach") || text.includes("thermalis") || text.includes("hot spring")) return "mountain";
    if (text.includes("winterhold") || text.includes("isen")) return "snow";
    if (text.includes("northvale") || text.includes("northreach")) return "north";
    if (text.includes("dunridge") || text.includes("stonehaven")) return "hill";
    if (text.includes("greenvale") || text.includes("harveston")) return "farmforest";
    if (text.includes("hawthorne") || text.includes("lakecrest")) return "lake";
    if (text.includes("eastmere") || text.includes("fairhaven")) return "east";
    return "westmere";
}

function routeRevampSize(map, theme) {
    const text = `${map.name} ${map.id || ""}`.toLowerCase();
    let w = 44, h = 30;
    if (text.includes("stonehaven") || text.includes("lakecrest") || text.includes("thermalis") || text.includes("winterhold")) { w = 50; h = 34; }
    if (text.includes("seawick") || text.includes("gullhaven") || text.includes("mullhaven")) { w = 48; h = 32; }
    if (text.includes("hot spring")) { w = 42; h = 30; }
    if (theme === "snow") { w = 46; h = 34; }
    return { w, h };
}

function routeRevampPoint(direction, w, h, index=0, count=1) {
    const spread = count > 1 ? Math.round((index + 1) * ((direction.includes('north') || direction.includes('south')) ? (w-6)/(count+1) : (h-6)/(count+1))) : Math.floor(((direction.includes('north') || direction.includes('south')) ? w : h) / 2);
    if (direction === 'north') return {x: Math.max(2, Math.min(w-3, spread)), y:0};
    if (direction === 'south') return {x: Math.max(2, Math.min(w-3, spread)), y:h-1};
    if (direction === 'east') return {x:w-1, y:Math.max(2, Math.min(h-3, spread))};
    if (direction === 'west') return {x:0, y:Math.max(2, Math.min(h-3, spread))};
    if (direction === 'northeast') return {x:w-2, y:1};
    if (direction === 'northwest') return {x:1, y:1};
    if (direction === 'southeast') return {x:w-2, y:h-2};
    if (direction === 'southwest') return {x:1, y:h-2};
    return {x:Math.floor(w/2),y:0};
}

function revampCarve(grid, x, y, tx, ty, width=1) {
    let cx=x, cy=y;
    const max=grid.length*grid[0].length*2;
    for(let i=0;i<max;i++){
        for(let oy=-width;oy<=width;oy++) for(let ox=-width;ox<=width;ox++){
            const gx=cx+ox, gy=cy+oy;
            if(grid[gy]?.[gx] !== undefined) grid[gy][gx]=TILE.PATH;
        }
        if(cx===tx && cy===ty) break;
        const dx=Math.sign(tx-cx), dy=Math.sign(ty-cy);
        // Deterministic bends make the trail meander without becoming confusing.
        if(i%9===0 && dy!==0) cy+=dy;
        else if(i%7===0 && dx!==0) cx+=dx;
        else if(Math.abs(tx-cx)>=Math.abs(ty-cy) && dx) cx+=dx;
        else if(dy) cy+=dy;
        else if(dx) cx+=dx;
    }
}

function revampRouteMap(mapId, map) {
    if(!map || !mapId.startsWith('route_') || !map.exits?.length) return;
    const theme=routeRevampTheme(map), {w,h}=routeRevampSize(map,theme);
    const seed=Array.from(mapId).reduce((a,c)=>a+c.charCodeAt(0),17);
    const grid=Array.from({length:h},()=>Array(w).fill(TILE.GRASS));

    // Organic outer margins: the route remains open but has irregular edges.
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
        const edge=x<2||y<2||x>w-3||y>h-3;
        const notch=(x<4&&y<4)|| (x>w-5&&y>h-5) || (x<3&&y>h-5);
        if(edge && notch) grid[y][x]=TILE.VOID;
        else if(edge) grid[y][x]=TILE.WALL;
    }

    // Region-specific base terrain.
    for(let y=2;y<h-2;y++) for(let x=2;x<w-2;x++){
        const n=stableNoise(x,y,seed);
        if(theme==='coast' && (y>h-7 || x<5) && n>0.62) grid[y][x]=TILE.WATER;
        else if(theme==='mountain' && n>0.77) grid[y][x]=TILE.WALL;
        else if(theme==='snow' && n>0.84) grid[y][x]=TILE.WALL;
        else if((theme==='farmforest'||theme==='westmere'||theme==='north') && n>0.76) grid[y][x]=TILE.TREE;
        else if((theme==='lake'||theme==='east') && n>0.79) grid[y][x]=TILE.TREE;
    }

    const exits=map.exits.map((e,i)=>{
        const dir=e.direction || 'north';
        const p=routeRevampPoint(dir,w,h,i,map.exits.length);
        return {...e,x:p.x,y:p.y};
    });

    // Main trail follows the actual geographic exit directions.
    const hub={x:Math.floor(w/2),y:Math.floor(h/2)};
    exits.forEach(e=>revampCarve(grid,e.x,e.y,hub.x,hub.y,1));
    if(exits.length===2) {
        // Add a second, gently offset trail segment to create visual variety.
        const a=exits[0], b=exits[1];
        const offset={x:Math.floor(w/2)+(seed%7)-3,y:Math.floor(h/2)+((seed>>2)%7)-3};
        revampCarve(grid,a.x,a.y,offset.x,offset.y,1);
        revampCarve(grid,offset.x,offset.y,b.x,b.y,1);
    }

    // Create side trails/detours away from the main path.
    const detours = theme==='mountain'||theme==='snow' ? 4 : 3;
    for(let i=0;i<detours;i++){
        const sx=5+((seed+i*17)%(w-10)), sy=5+((seed*3+i*11)%(h-10));
        const tx=Math.max(3,Math.min(w-4,sx+(i%2?7:-7))), ty=Math.max(3,Math.min(h-4,sy+(i%3?4:-5)));
        if(grid[sy]?.[sx]===TILE.GRASS) revampCarve(grid,sx,sy,tx,ty,0);
    }

    // Encounter pockets: several separated grass patches rather than one carpet.
    const grassPatches=theme==='coast'?4:5;
    for(let i=0;i<grassPatches;i++){
        const px=5+((seed+i*23)%(w-10)), py=4+((seed*2+i*13)%(h-8));
        const rw=3+(i%3), rh=2+(i%2);
        for(let yy=py;yy<py+rh;yy++) for(let xx=px;xx<px+rw;xx++){
            if(grid[yy]?.[xx]===TILE.GRASS && stableNoise(xx,yy,seed+i)>0.18) grid[yy][xx]=TILE.TALL_GRASS;
        }
    }

    // Re-seed a few regional landmarks into the route.
    const landmarkText=`${map.name}`.toLowerCase();
    if(landmarkText.includes('great tree')){
        const cx=Math.floor(w*0.68), cy=Math.floor(h*0.42);
        grid[cy][cx]=TILE.TREE; grid[cy-1][cx]=TILE.TREE; grid[cy][cx-1]=TILE.TREE; grid[cy][cx+1]=TILE.TREE;
    }
    if(theme==='coast'){
        for(let x=7;x<w-7;x+=4) if(grid[h-6]?.[x]===TILE.GRASS) grid[h-6][x]=TILE.WATER;
    }

    // Scale existing NPCs into the new route rather than losing their battles/dialogue.
    const oldW=map.data?.[0]?.length||30, oldH=map.data?.length||18;
    const npcs=(map.npcs||[]).map((npc,i)=>{
        let x=Math.round((npc.x/Math.max(1,oldW-1))*(w-5))+2;
        let y=Math.round((npc.y/Math.max(1,oldH-1))*(h-5))+2;
        x=Math.max(2,Math.min(w-3,x)); y=Math.max(2,Math.min(h-3,y));
        // Keep route NPCs off water/walls/trees; walk to nearest path/grass.
        if([TILE.WALL,TILE.WATER,TILE.TREE,TILE.VOID].includes(grid[y]?.[x])){
            outer: for(let r=1;r<8;r++) for(let oy=-r;oy<=r;oy++) for(let ox=-r;ox<=r;ox++){
                const nx=x+ox,ny=y+oy;
                if(![TILE.WALL,TILE.WATER,TILE.TREE,TILE.VOID].includes(grid[ny]?.[nx])){x=nx;y=ny;break outer;}
            }
        }
        return {...npc,x,y};
    });

    // Route content pass: every substantial route gets a trainer and a contextual
    // guide/ranger.  The aim is that travelling itself provides progression, not
    // just a visual corridor between settlements.
    const levelBase = theme==='snow' ? 12 : theme==='mountain' ? 9 : theme==='coast' ? 8 : 5;
    const trainerSpecies = theme==='snow' ? 'Morrowe' : theme==='mountain' ? 'Orrin' : theme==='coast' ? 'Pipiri' : 'Brindlew';
    const trainerName = theme==='snow' ? 'Northern Scout' : theme==='mountain' ? 'Cliffside Trainer' : theme==='coast' ? 'Coastal Trainer' : 'Trail Trainer';
    if(!npcs.some(n=>n.interaction==='trainer')){
        let tx=Math.floor(w*0.60), ty=Math.floor(h*0.52);
        if([TILE.WALL,TILE.WATER,TILE.TREE,TILE.VOID].includes(grid[ty]?.[tx])){
            outer: for(let r=1;r<8;r++) for(let oy=-r;oy<=r;oy++) for(let ox=-r;ox<=r;ox++){
                const nx=tx+ox,ny=ty+oy;
                if(![TILE.WALL,TILE.WATER,TILE.TREE,TILE.VOID].includes(grid[ny]?.[nx])){tx=nx;ty=ny;break outer;}
            }
        }
        npcs.push({id:`${mapId}-trainer`,type:'trainer',interaction:'trainer',name:trainerName,x:tx,y:ty,color:'#c66b6b',lines:[
            theme==='coast'?'A coastal route is a good place to test whether your team can handle different terrain.':
            theme==='mountain'?'The climb is only half the challenge. Let us see how your Entheon handle a battle.':
            theme==='snow'?'Cold weather rewards preparation. Show me what you brought for the northern roads.':
            'You have come this far. Let us see what your team can do on the road.'
        ],battle:{reward:100+levelBase*8,team:[{species:trainerSpecies,level:levelBase}],victory:'Good battle. The road ahead will keep getting tougher.',defeat:'Take a breather and prepare before you continue.'}});
    }
    if(!npcs.some(n=>n.id===`${mapId}-ranger`)){
        let rx=Math.floor(w*0.36), ry=Math.floor(h*0.66);
        if([TILE.WALL,TILE.WATER,TILE.TREE,TILE.VOID].includes(grid[ry]?.[rx])){
            outer: for(let r=1;r<8;r++) for(let oy=-r;oy<=r;oy++) for(let ox=-r;ox<=r;ox++){
                const nx=rx+ox,ny=ry+oy;
                if(![TILE.WALL,TILE.WATER,TILE.TREE,TILE.VOID].includes(grid[ny]?.[nx])){rx=nx;ry=ny;break outer;}
            }
        }
        npcs.push({id:`${mapId}-ranger`,type:'npc',interaction:'dialogue',name:theme==='coast'?'Coastal Ranger':theme==='mountain'?'Trail Guide':theme==='snow'?'Winter Ranger':'Route Ranger',x:rx,y:ry,color:'#6b8f5b',lines:[
            theme==='coast'?'The sea changes the weather quickly out here. Keep an eye on the shoreline and the trail.':
            theme==='mountain'?'Watch your footing. The safest path is rarely the straightest one.':
            theme==='snow'?'Snow can hide old paths and loose ground. Stay alert.':
            'There are more little paths through this area than most travellers notice.'
        ]});
    }

    // Real field pickups: routes now contain physical rewards rather than
    // a decorative "Trail Find" NPC. They persist once collected.
    const pickupSpecs = [
        { itemId: theme === 'snow' || theme === 'east' || theme === 'lake' ? 'greaterRestore' : 'basicRestore',
          label: 'Field Supply', icon: '✦', color: '#d5b35f', fx: 0.78, fy: 0.30 },
        { itemId: 'capture', label: 'Capture Crystal', icon: '◇', color: '#8fc7df', fx: 0.24, fy: 0.72 }
    ];
    pickupSpecs.forEach((spec, index) => {
        const pickupId = `${mapId}-pickup-${index}`;
        if (gameState.collectedItems[pickupId]) return;
        let ix = Math.floor(w * spec.fx), iy = Math.floor(h * spec.fy);
        const blocked = tile => [TILE.WALL,TILE.WATER,TILE.TREE,TILE.VOID,TILE.DOOR].includes(tile);
        if (blocked(grid[iy]?.[ix])) {
            outer: for(let r=1;r<10;r++) for(let oy=-r;oy<=r;oy++) for(let ox=-r;ox<=r;ox++) {
                const nx=ix+ox, ny=iy+oy;
                if (grid[ny]?.[nx] !== undefined && !blocked(grid[ny][nx]) && !npcs.some(n=>Math.hypot(n.x-nx,n.y-ny)<2)) { ix=nx; iy=ny; break outer; }
            }
        }
        npcs.push({ id: pickupId, type:'item', interaction:'item', name:spec.label, itemId:spec.itemId, x:ix, y:iy, color:spec.color, icon:spec.icon, lines:[] });
    });

    exits.forEach(e=>{grid[e.y][e.x]=TILE.DOOR;});
    map.data=grid.map(r=>r.join(''));
    map.exits=exits;
    map.npcs=npcs;
    // Regional encounter progression. Only species with battle data in the
    // current prototype are used, so every encounter is immediately playable.
    if(!map.encounters?.length){
        const pools={
            westmere:[['Orrin',5,7,35],['Brindlew',5,8,35],['Pipiri',6,8,15],['Morrowe',5,7,15]],
            greenvale:[['Brindlew',7,10,40],['Orrin',7,9,25],['Pipiri',8,10,20],['Morrowe',8,10,15]],
            dunridge:[['Orrin',8,11,45],['Brindlew',9,11,25],['Morrowe',9,12,20],['Pipiri',8,10,10]],
            seawick:[['Pipiri',9,12,45],['Orrin',9,11,20],['Brindlew',10,12,20],['Morrowe',10,12,15]],
            highreach:[['Orrin',10,13,35],['Morrowe',11,14,30],['Brindlew',10,13,20],['Pipiri',11,13,15]],
            northvale:[['Morrowe',12,15,40],['Orrin',12,14,25],['Pipiri',13,15,20],['Brindlew',12,14,15]],
            isen:[['Morrowe',14,17,50],['Pipiri',14,16,25],['Orrin',14,16,15],['Brindlew',15,17,10]],
            hawthorne:[['Pipiri',15,18,40],['Brindlew',15,18,25],['Orrin',15,17,20],['Morrowe',16,18,15]],
            eastmere:[['Morrowe',17,20,35],['Pipiri',17,20,30],['Brindlew',18,20,20],['Orrin',17,19,15]]
        };
        const region=Object.keys(pools).find(r=>map.name.toLowerCase().includes(r)) || 'westmere';
        map.encounters=pools[region].map(([species,minLevel,maxLevel,weight])=>({species,minLevel,maxLevel,weight}));
    }
}

Object.entries(maps).forEach(([mapId,map])=>revampRouteMap(mapId,map));

// Route trainers scale their team size with the world progression. This is
// intentionally a prototype progression layer; canonical Gym rosters remain
// controlled separately by the Gym core data.
(function scaleRouteTrainerTeams(){
    const pools={
        westmere:['Brindlew','Orrin','Pipiri'],
        greenvale:['Brindlew','Orrin','Pipiri'],
        dunridge:['Orrin','Brindlew','Morrowe'],
        seawick:['Pipiri','Orrin','Brindlew'],
        highreach:['Orrin','Morrowe','Brindlew'],
        northvale:['Morrowe','Orrin','Pipiri'],
        isen:['Morrowe','Pipiri','Orrin'],
        hawthorne:['Pipiri','Brindlew','Morrowe'],
        eastmere:['Morrowe','Pipiri','Brindlew']
    };
    Object.entries(maps).forEach(([mapId,map])=>{
        if(!mapId.startsWith('route_')) return;
        const trainers=(map.npcs||[]).filter(n=>n.interaction==='trainer' && n.battle);
        if(!trainers.length) return;
        const text=`${map.name} ${mapId}`.toLowerCase();
        const region=Object.keys(pools).find(r=>text.includes(r)) || 'westmere';
        const pool=pools[region];
        const existing=trainers[0].battle.team||[];
        const base=existing[0]?.level || 8;
        const desired=['highreach','northvale','isen','hawthorne','eastmere'].includes(region)?3:2;
        while(existing.length<desired){
            const species=pool[existing.length % pool.length];
            existing.push({species,level:base+existing.length+1});
        }
        trainers.forEach(t=>{ t.battle.team=existing.map(e=>({...e})); });
    });
})();

// Re-run the final exit normalization after route dimensions have changed.
applyDirectionalRouteLayout();
Object.values(maps).forEach(map=>ensureAllExitCorridors(map));

// ============================================================
// GYM LEADERS / BADGES
// ============================================================
const gymLeaders = [
    {
        gymNumber: 1, map:'everhope_city', id:'everhope', name:'Rowan Vale', badgeId:'gale-badge', badgeName:'Gale Crest', x:19, y:9, color:'#7b9ed8',
        format: '3v3', activeCount: 3, reward: 900,
        roster:['Nymbril','Rookane','Avenn','Sovel','Caelune','Quiblet'], levels:[10,11,12,13,14,16],
        lines:['Welcome to Everhope Gym.','You cannot control the wind. You can only learn how to move with it.','Show me how well you adapt when your plan stops working.']
    },
    {
        gymNumber: 2, map:'gullhaven_city', id:'gullhaven', name:'Maya Corwin', badgeId:'tide-badge', badgeName:'Tide Crest', x:15, y:10, color:'#4f8fa8',
        format: '3v3', activeCount: 3, reward: 1500,
        roster:['Vessa','Koroa','Selka','Veysha','Mirel','Pirello'], levels:[14,15,16,17,18,20],
        lines:['The sea never stays still.','Read the water, adapt to the current, and know when to change direction.','Let us see how you and your Entheon handle the flow.']
    },
    {
        gymNumber: 3, map:'thermalis_city', id:'thermalis', name:'Darius Voss', badgeId:'thermalis-badge', badgeName:'Thermalis Crest', x:15, y:10, color:'#b5654a',
        format: '3v3', activeCount: 3, reward: 1900,
        roster:['Dovik','Arko','Braska','Brindrel','Tarnelle','Quivane'], levels:[20,21,22,23,24,26],
        lines:['Heat reveals what something is made of. Pressure reveals what it can become.','Stay calm when the pressure rises.','Let us see what your team is made of.']
    },
    {
        gymNumber: 4, map:'harveston_city', id:'harveston', name:'Elara Greenfield', badgeId:'verdant-badge', badgeName:'Verdant Crest', x:15, y:11, color:'#6b9b58',
        format: '4v4', activeCount: 4, reward: 2300,
        roster:['Meliu','Orven','Mirel','Rilsa','Brindrel','Virenne'], levels:[24,25,26,27,28,30],
        lines:['You cannot force something to grow. You can only give it what it needs.','Every Entheon develops differently.','Show me that you understand your partners rather than simply commanding them.']
    },
    {
        gymNumber: 5, map:'lakecrest_city', id:'lakecrest', name:'Lena Hartwell', badgeId:'lakecrest-badge', badgeName:'Lakecrest Crest', x:15, y:9, color:'#c59b3e',
        format: '4v4', activeCount: 4, reward: 2700,
        roster:['Tivvi','Keln','Avenn','Rookane','Veyro','Dragon Stage 2'], levels:[28,29,30,31,32,34],
        lines:['Understand the system. Then break the pattern.','Watch carefully. Once you think you understand my strategy, I will change it.','Let us see whether you can adapt to the pattern breaking.']
    },
    {
        gymNumber: 6, map:'northreach_city', id:'northreach', name:'Magnus Veyr', badgeId:'northreach-badge', badgeName:'Northreach Crest', x:15, y:10, color:'#71879a',
        format: '6v6', activeCount: 6, reward: 3200,
        roster:['Keln','Talvi','Pellune','Rookane','Fennovar','Ruun'], levels:[34,35,36,37,38,40],
        lines:['Steel is forged by what it survives. Frost hardens those it faces.','Prepare yourself, conserve your strength, and keep thinking when conditions change.','This is a full six-Entheon assessment. Show me you can endure it.']
    },
    {
        gymNumber: 7, map:'fairhaven_city', id:'fairhaven', name:'Celeste Laurent', badgeId:'fairhaven-badge', badgeName:'Fairhaven Crest', x:15, y:9, color:'#8669a8',
        format: '6v6', activeCount: 6, reward: 3800,
        roster:['Veysha','Thessane','Elvarin','Lumaryn','Yori','Uveryn'], levels:[40,41,42,43,44,46],
        lines:['The moment you believe you understand what you see, you have already given me an advantage.','Do not mistake confidence for certainty.','Let us see what you do when the battle refuses to mean what you expect.']
    }
];

// The core design establishes a six-Entheon roster for every Gym Leader, while
// the official Gym format determines how many are actually deployed:
// Gyms 1–3 = 3v3, Gyms 4–5 = 4v4, Gyms 6–7 = 6v6.
// The prototype uses the established roster in order for now; later challenger-
// aware selection can choose a different subset without changing the rosters.
function getGymBattleTeam(gym) {
    const count = gym.activeCount || gym.roster.length;
    return gym.roster.slice(0, count).map((species, i) => ({
        species,
        level: gym.levels[i] || gym.levels[gym.levels.length - 1] || 1
    }));
}

const entheonDirectorySpecies = [{"id": 1, "name": "Nimblet", "affinity": "Wild", "rarity": "Common"}, {"id": 2, "name": "Nymbril", "affinity": "Wild / Gale", "rarity": "Common"}, {"id": 3, "name": "Nymbrake", "affinity": "Wild / Gale", "rarity": "Uncommon"}, {"id": 4, "name": "Pipiri", "affinity": "Tide", "rarity": "Common"}, {"id": 5, "name": "Pirello", "affinity": "Tide / Frost", "rarity": "Common"}, {"id": 6, "name": "Piravelle", "affinity": "Tide / Frost", "rarity": "Uncommon"}, {"id": 7, "name": "Morrowe", "affinity": "Umbral", "rarity": "Common"}, {"id": 8, "name": "Morvane", "affinity": "Umbral / Mystic", "rarity": "Uncommon"}, {"id": 9, "name": "Morvayne", "affinity": "Umbral / Mystic", "rarity": "Rare"}, {"id": 10, "name": "Kivvi", "affinity": "Radiant", "rarity": "Common"}, {"id": 11, "name": "Kivara", "affinity": "Radiant / Frost", "rarity": "Common"}, {"id": 12, "name": "Kivarune", "affinity": "Radiant / Frost", "rarity": "Uncommon"}, {"id": 13, "name": "Brindlew", "affinity": "Verdant", "rarity": "Common"}, {"id": 14, "name": "Brindrel", "affinity": "Verdant / Stone", "rarity": "Common"}, {"id": 15, "name": "Brinderv", "affinity": "Verdant / Stone", "rarity": "Uncommon"}, {"id": 16, "name": "Sovel", "affinity": "Gale", "rarity": "Common"}, {"id": 17, "name": "Sovelle", "affinity": "Gale / Radiant", "rarity": "Common"}, {"id": 18, "name": "Sovaryn", "affinity": "Gale / Radiant", "rarity": "Uncommon"}, {"id": 19, "name": "Tarnit", "affinity": "Stone", "rarity": "Common"}, {"id": 20, "name": "Tarnelle", "affinity": "Stone / Metal", "rarity": "Common"}, {"id": 21, "name": "Tarnovar", "affinity": "Stone / Metal", "rarity": "Uncommon"}, {"id": 22, "name": "Quiblet", "affinity": "Flame", "rarity": "Common"}, {"id": 23, "name": "Quivane", "affinity": "Flame / Volt", "rarity": "Common"}, {"id": 24, "name": "Quivaryn", "affinity": "Flame / Volt", "rarity": "Uncommon"}, {"id": 25, "name": "Elnu", "affinity": "Mystic", "rarity": "Common"}, {"id": 26, "name": "Elvara", "affinity": "Mystic / Radiant", "rarity": "Common"}, {"id": 27, "name": "Elvarin", "affinity": "Mystic / Radiant", "rarity": "Rare"}, {"id": 28, "name": "Drakyn", "affinity": "Dragon", "rarity": "Rare"}, {"id": 29, "name": "Voltaryn", "affinity": "Dragon / Volt", "rarity": "Extremely Rare"}, {"id": 30, "name": "Drakoryn", "affinity": "Dragon / Volt", "rarity": "Extremely Rare"}, {"id": 31, "name": "Vessa", "affinity": "Tide", "rarity": "Common"}, {"id": 32, "name": "Vessari", "affinity": "Tide / Dragon", "rarity": "Rare"}, {"id": 33, "name": "Rookit", "affinity": "Metal", "rarity": "Common"}, {"id": 34, "name": "Rookane", "affinity": "Metal / Gale", "rarity": "Uncommon"}, {"id": 35, "name": "Meliu", "affinity": "Verdant", "rarity": "Common"}, {"id": 36, "name": "Meliora", "affinity": "Verdant / Radiant", "rarity": "Rare"}, {"id": 37, "name": "Dovik", "affinity": "Stone", "rarity": "Common"}, {"id": 38, "name": "Dovaryn", "affinity": "Stone / Umbral", "rarity": "Uncommon"}, {"id": 39, "name": "Pellin", "affinity": "Frost", "rarity": "Common"}, {"id": 40, "name": "Pellune", "affinity": "Frost / Mystic", "rarity": "Uncommon"}, {"id": 41, "name": "Arko", "affinity": "Flame", "rarity": "Common"}, {"id": 42, "name": "Arkelle", "affinity": "Flame / Metal", "rarity": "Uncommon"}, {"id": 43, "name": "Sairi", "affinity": "Gale", "rarity": "Common"}, {"id": 44, "name": "Sairune", "affinity": "Gale / Mystic", "rarity": "Uncommon"}, {"id": 45, "name": "Braska", "affinity": "Flame / Stone", "rarity": "Common"}, {"id": 46, "name": "Braskel", "affinity": "Flame / Stone", "rarity": "Rare"}, {"id": 47, "name": "Orrin", "affinity": "Wild", "rarity": "Common"}, {"id": 48, "name": "Orravel", "affinity": "Wild / Umbral", "rarity": "Uncommon"}, {"id": 49, "name": "Tivvi", "affinity": "Volt", "rarity": "Common"}, {"id": 50, "name": "Tivarra", "affinity": "Volt / Radiant", "rarity": "Rare"}, {"id": 51, "name": "Cairnix", "affinity": "Stone", "rarity": "Common"}, {"id": 52, "name": "Cairneth", "affinity": "Stone / Mystic", "rarity": "Rare"}, {"id": 53, "name": "Lumae", "affinity": "Radiant", "rarity": "Common"}, {"id": 54, "name": "Lumaryn", "affinity": "Radiant / Mystic", "rarity": "Rare"}, {"id": 55, "name": "Virel", "affinity": "Verdant", "rarity": "Common"}, {"id": 56, "name": "Virenne", "affinity": "Verdant / Gale", "rarity": "Uncommon"}, {"id": 57, "name": "Koroa", "affinity": "Tide", "rarity": "Common"}, {"id": 58, "name": "Korovan", "affinity": "Tide / Stone", "rarity": "Uncommon"}, {"id": 59, "name": "Esvin", "affinity": "Umbral", "rarity": "Common"}, {"id": 60, "name": "Esvar", "affinity": "Umbral / Metal", "rarity": "Rare"}, {"id": 61, "name": "Marnel", "affinity": "Tide / Wild", "rarity": "Common"}, {"id": 62, "name": "Marnyx", "affinity": "Tide / Wild", "rarity": "Rare"}, {"id": 63, "name": "Yori", "affinity": "Dragon", "rarity": "Rare"}, {"id": 64, "name": "Yorvale", "affinity": "Dragon / Radiant", "rarity": "Extremely Rare"}, {"id": 65, "name": "Thessa", "affinity": "Mystic", "rarity": "Common"}, {"id": 66, "name": "Thessane", "affinity": "Mystic / Frost", "rarity": "Rare"}, {"id": 67, "name": "Orli", "affinity": "Wild", "rarity": "Common"}, {"id": 68, "name": "Orlith", "affinity": "Wild / Metal", "rarity": "Uncommon"}, {"id": 69, "name": "Fenni", "affinity": "Frost", "rarity": "Common"}, {"id": 70, "name": "Fennovar", "affinity": "Frost / Stone", "rarity": "Rare"}, {"id": 71, "name": "Caelo", "affinity": "Gale", "rarity": "Common"}, {"id": 72, "name": "Caelune", "affinity": "Gale / Tide", "rarity": "Uncommon"}, {"id": 73, "name": "Rilsa", "affinity": "Verdant / Tide", "rarity": "Common"}, {"id": 74, "name": "Rilsaryn", "affinity": "Verdant / Tide", "rarity": "Rare"}, {"id": 75, "name": "Uvera", "affinity": "Mystic", "rarity": "Common"}, {"id": 76, "name": "Uveryn", "affinity": "Mystic / Dragon", "rarity": "Extremely Rare"}, {"id": 77, "name": "Veyli", "affinity": "Wild", "rarity": "Common"}, {"id": 78, "name": "Veylith", "affinity": "Flame", "rarity": "Uncommon"}, {"id": 79, "name": "Veyrune", "affinity": "Tide", "rarity": "Uncommon"}, {"id": 80, "name": "Veyvara", "affinity": "Mystic", "rarity": "Rare"}, {"id": 81, "name": "Mavren", "affinity": "Umbral / Wild", "rarity": "Uncommon"}, {"id": 82, "name": "Ossari", "affinity": "Stone", "rarity": "Common"}, {"id": 83, "name": "Keln", "affinity": "Metal", "rarity": "Common"}, {"id": 84, "name": "Veyro", "affinity": "Gale / Volt", "rarity": "Uncommon"}, {"id": 85, "name": "Sindra", "affinity": "Flame / Umbral", "rarity": "Rare"}, {"id": 86, "name": "Pavren", "affinity": "Wild", "rarity": "Common"}, {"id": 87, "name": "Ilyra", "affinity": "Radiant", "rarity": "Common"}, {"id": 88, "name": "Ruun", "affinity": "Frost / Umbral", "rarity": "Rare"}, {"id": 89, "name": "Talvi", "affinity": "Frost", "rarity": "Common"}, {"id": 90, "name": "Mirel", "affinity": "Tide / Verdant", "rarity": "Common"}, {"id": 91, "name": "Korri", "affinity": "Metal / Wild", "rarity": "Uncommon"}, {"id": 92, "name": "Avenn", "affinity": "Gale", "rarity": "Common"}, {"id": 93, "name": "Selka", "affinity": "Tide", "rarity": "Common"}, {"id": 94, "name": "Norrik", "affinity": "Stone / Metal", "rarity": "Uncommon"}, {"id": 95, "name": "Veysha", "affinity": "Mystic / Umbral", "rarity": "Rare"}, {"id": 96, "name": "Orven", "affinity": "Verdant", "rarity": "Common"}, {"id": 97, "name": "Auralith", "affinity": "Radiant / Mystic", "rarity": "Legendary"}, {"id": 98, "name": "Vaelora", "affinity": "Radiant / Volt", "rarity": "Legendary"}, {"id": 99, "name": "Nethryss", "affinity": "Umbral / Dragon", "rarity": "Legendary"}, {"id": 100, "name": "Orrytheon", "affinity": "Mystic / Metal", "rarity": "Legendary"}, {"id": 101, "name": "Morveth", "affinity": "Umbral / Mystic", "rarity": "Uncommon"}];

function ensureDirectoryState() {
    if (!gameState.entheonDirectory) gameState.entheonDirectory = { seen: {}, captured: {} };
    gameState.entheonDirectory.seen ||= {};
    gameState.entheonDirectory.captured ||= {};
}
function syncDirectoryFromParty() {
    ensureDirectoryState();
    (gameState.party || []).forEach(member => {
        if (!member?.species) return;
        gameState.entheonDirectory.seen[member.species] = true;
        gameState.entheonDirectory.captured[member.species] = true;
    });
}
function markEntheonSeen(name) {
    if (!name) return;
    ensureDirectoryState();
    gameState.entheonDirectory.seen[name] = true;
}
function markEntheonCaptured(name) {
    if (!name) return;
    ensureDirectoryState();
    gameState.entheonDirectory.seen[name] = true;
    gameState.entheonDirectory.captured[name] = true;
}
function directoryPortrait(species, discovered) {
    const initials = species.name.slice(0,2).toUpperCase();
    if (!discovered) return '<div class="directory-portrait unknown"><span>?</span></div>';
    const affinity = species.affinity.split('/')[0].trim();
    return `<div class="directory-portrait" data-affinity="${affinity}"><div class="directory-silhouette">${initials}</div><div class="directory-portrait-label">ENTHEON</div></div>`;
}
function renderDirectoryDetail(species) {
    if (!directoryDetail || !species) return;
    ensureDirectoryState();
    const seen = !!gameState.entheonDirectory.seen[species.name];
    const captured = !!gameState.entheonDirectory.captured[species.name];
    if (!seen) { directoryDetail.innerHTML = `${directoryPortrait(species,false)}<div class="directory-detail-copy"><div class="directory-number">#${String(species.id).padStart(3,'0')}</div><h3>Unknown Entheon</h3><p>This Entheon has not yet been encountered.</p></div>`; return; }
    const owned = gameState.party.find(c => c.name === species.name);
    directoryDetail.innerHTML = `${directoryPortrait(species,true)}<div class="directory-detail-copy"><div class="directory-number">#${String(species.id).padStart(3,'0')}</div><h3>${species.name}</h3><div class="directory-tags"><span>${species.affinity}</span><span>${species.rarity}</span><span>${captured ? 'Captured' : 'Seen'}</span></div><p>${captured ? 'Registered as captured in your Entheon Directory.' : 'You have encountered this Entheon, but have not captured one yet.'}</p>${owned ? `<p class="directory-owned">Current party specimen: Lv. ${owned.level}</p>` : ''}</div>`;
}
function renderDirectory() {
    if (!directoryList) return;
    ensureDirectoryState();
    syncDirectoryFromParty();
    const seenCount = Object.values(gameState.entheonDirectory.seen).filter(Boolean).length;
    const capturedCount = Object.values(gameState.entheonDirectory.captured).filter(Boolean).length;
    if (directorySummary) directorySummary.textContent = `Seen: ${seenCount}/${entheonDirectorySpecies.length} · Captured: ${capturedCount}/${entheonDirectorySpecies.length}`;
    directoryList.innerHTML = entheonDirectorySpecies.map(species => {
        const seen = !!gameState.entheonDirectory.seen[species.name];
        const captured = !!gameState.entheonDirectory.captured[species.name];
        return `<button type="button" class="directory-entry ${seen ? 'seen' : ''} ${captured ? 'captured' : ''}" data-species="${species.name}"><span class="directory-entry-number">${String(species.id).padStart(3,'0')}</span><span class="directory-entry-portrait">${directoryPortrait(species,seen)}</span><span class="directory-entry-name">${seen ? species.name : '?????'}</span><span class="directory-entry-status">${captured ? '✓' : seen ? '◐' : '—'}</span></button>`;
    }).join('');
    directoryList.querySelectorAll('.directory-entry').forEach(btn => btn.addEventListener('click',()=>renderDirectoryDetail(entheonDirectorySpecies.find(x=>x.name===btn.dataset.species))));
    renderDirectoryDetail(entheonDirectorySpecies.find(x=>gameState.entheonDirectory.seen[x.name]) || entheonDirectorySpecies[0]);
}

function renderBadges() {
    if (!badgeList) return;
    const earned = gameState.badges || [];
    badgeList.innerHTML = gymLeaders.map(gym => {
        const isEarned = earned.includes(gym.badgeId);
        const initial = gym.badgeName.replace(/\s+Badge$/i, "").charAt(0);
        return `<div class="badge-card${isEarned ? " earned" : ""}" style="--badge-color:${gym.color}">
            <div class="badge-crest" title="${isEarned ? gym.badgeName : "Unawarded"}">${isEarned ? initial : "?"}</div>
            <div class="badge-info">
                <strong>${gym.badgeName}</strong>
                <span>${maps[gym.map]?.name || gym.map}</span>
                <div class="badge-status-label">${isEarned ? "EARNED" : "NOT YET EARNED"}</div>
            </div>
        </div>`;
    }).join("");
    if (badgeStatus) badgeStatus.textContent = `Crests: ${earned.length}/${gymLeaders.length}`;
}

for (const gym of gymLeaders) {
    const map = maps[gym.map];
    if (!map) continue;
    map.npcs = Array.isArray(map.npcs) ? map.npcs : [];
    if (map.npcs.some(n => n.id === `gym-leader-${gym.id}`)) continue;
    map.npcs.push({id:`gym-leader-${gym.id}`,type:'gym',interaction:'gym',name:gym.name,x:gym.x,y:gym.y,color:gym.color,badgeId:gym.badgeId,badgeName:gym.badgeName,lines:gym.lines,battle:{reward:gym.reward,format:gym.format,team:getGymBattleTeam(gym),victory:`You have earned the ${gym.badgeName}!`,defeat:'Train, recover, and return when you are ready.'}});
}


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
    speed: 4,
    direction: "down",
    frame: 0,
    frameClock: 0,
    moving: false
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
// WORLD MAP
// ============================================================

const DIRECTION_LABELS = {
    north: "North",
    northeast: "Northeast",
    east: "East",
    southeast: "Southeast",
    south: "South",
    southwest: "Southwest",
    west: "West",
    northwest: "Northwest"
};

const OPPOSITE_DIRECTIONS = {
    north: "south",
    northeast: "southwest",
    east: "west",
    southeast: "northwest",
    south: "north",
    southwest: "northeast",
    west: "east",
    northwest: "southeast"
};

function getWorldLocationForMap(mapId) {
    return window.KALEO_WORLD?.locations?.find(location => location.mapId === mapId) || null;
}

function getWorldRouteForMap(mapId) {
    return window.KALEO_WORLD?.routes?.find(route => route.mapId === mapId) || null;
}

function getWorldLocationLabel(locationId) {
    return window.KALEO_WORLD?.getLocation(locationId)?.name || locationId;
}

function getRegionLabel(locationId) {
    const location = window.KALEO_WORLD?.getLocation(locationId);
    if (!location) return "";
    return window.KALEO_WORLD?.regions?.find(region => region.id === location.region)?.name || location.region || "";
}

function getCurrentWorldContext() {
    const location = getWorldLocationForMap(gameState.currentMap);
    const route = getWorldRouteForMap(gameState.currentMap);

    if (location) {
        return {
            kind: "location",
            location,
            route: null,
            region: getRegionLabel(location.id),
            name: location.name
        };
    }

    if (route) {
        const from = window.KALEO_WORLD?.getLocation(route.from);
        const to = window.KALEO_WORLD?.getLocation(route.to);
        const region = from?.region === to?.region
            ? getRegionLabel(route.from)
            : `${getRegionLabel(route.from)} / ${getRegionLabel(route.to)}`;
        return {
            kind: "route",
            location: null,
            route,
            region,
            name: `${from?.name || route.from} → ${to?.name || route.to}`
        };
    }

    return {
        kind: "unknown",
        location: null,
        route: null,
        region: "",
        name: currentMap?.name || gameState.currentMap
    };
}

function getConnectionsForLocation(locationId) {
    const connections = [];
    const routes = window.KALEO_WORLD?.routes?.filter(route => route.from === locationId || route.to === locationId) || [];

    routes.forEach(route => {
        const isFrom = route.from === locationId;
        const destinationId = isFrom ? route.to : route.from;
        connections.push({
            kind: "route",
            name: getWorldLocationLabel(destinationId),
            direction: isFrom ? route.direction : route.reverseDirection,
            trail: route.kind === "secondary-trail" ? "Side route" : "Main route"
        });
    });

    const ferries = window.KALEO_WORLD?.ferryRoutes?.filter(route => route.from === locationId || route.to === locationId) || [];
    ferries.forEach(route => {
        const isFrom = route.from === locationId;
        const destinationId = isFrom ? route.to : route.from;
        connections.push({
            kind: "ferry",
            name: getWorldLocationLabel(destinationId),
            direction: isFrom ? route.direction : OPPOSITE_DIRECTIONS[route.direction] || route.direction,
            trail: "Ferry"
        });
    });

    return connections;
}

function renderWorldMapMarkers(context) {
    if (!worldMapMarkers) return;
    worldMapMarkers.innerHTML = "";

    const points = window.KALEO_WORLD?.mapPoints || {};
    const addMarker = (locationId, className, label) => {
        const point = points[locationId];
        if (!point) return;
        const marker = document.createElement("div");
        marker.className = `world-map-marker ${className}`.trim();
        marker.style.left = `${point.x}%`;
        marker.style.top = `${point.y}%`;
        if (label) {
            const labelEl = document.createElement("div");
            labelEl.className = "world-map-marker-label";
            labelEl.textContent = label;
            marker.appendChild(labelEl);
        }
        worldMapMarkers.appendChild(marker);
    };

    if (context.kind === "location" && context.location) {
        addMarker(context.location.id, "current", context.location.name);
    }

    if (context.kind === "route" && context.route) {
        addMarker(context.route.from, "current", getWorldLocationLabel(context.route.from));
        addMarker(context.route.to, "route-endpoint", getWorldLocationLabel(context.route.to));
    }
}

function openWorldMap() {
    if (!worldMapScreen || gameState.mode !== "overworld") return;

    const context = getCurrentWorldContext();
    if (worldMapLocation) worldMapLocation.textContent = `${context.name}${context.region ? ` · ${context.region}` : ""}`;
    if (worldMapCurrentName) worldMapCurrentName.textContent = context.name;
    if (worldMapCurrentRegion) worldMapCurrentRegion.textContent = context.region || "World of Kaleo";

    if (context.kind === "route" && context.route) {
        const from = getWorldLocationLabel(context.route.from);
        const to = getWorldLocationLabel(context.route.to);
        worldMapRouteName.textContent = `${from} → ${to}`;
        worldMapRouteDirection.textContent = `${DIRECTION_LABELS[context.route.direction] || context.route.direction} from ${from} · ${context.route.kind === "secondary-trail" ? "Side route" : "Main route"}`;
    } else {
        worldMapRouteName.textContent = "You are in a settlement or city.";
        worldMapRouteDirection.textContent = "The connected paths below follow the established world-map directions.";
    }

    if (worldMapConnections) {
        let locationId = context.location?.id || null;
        if (!locationId && context.route) {
            locationId = null;
        }

        if (locationId) {
            const connections = getConnectionsForLocation(locationId);
            worldMapConnections.innerHTML = connections.length
                ? connections.map(connection => `
                    <div class="world-map-connection ${connection.kind === "ferry" ? "ferry" : ""}">
                        <strong>${connection.name}</strong>
                        <span>${connection.trail} · ${DIRECTION_LABELS[connection.direction] || connection.direction}</span>
                    </div>`).join("")
                : '<div class="world-map-connection"><strong>No mapped connections yet</strong><span>This location has not been fully connected in the current prototype.</span></div>';
        } else if (context.route) {
            const from = getWorldLocationLabel(context.route.from);
            const to = getWorldLocationLabel(context.route.to);
            worldMapConnections.innerHTML = `
                <div class="world-map-connection"><strong>${from}</strong><span>Return: ${DIRECTION_LABELS[context.route.reverseDirection] || context.route.reverseDirection}</span></div>
                <div class="world-map-connection"><strong>${to}</strong><span>Continue: ${DIRECTION_LABELS[context.route.direction] || context.route.direction}</span></div>`;
        } else {
            worldMapConnections.innerHTML = '<div class="world-map-connection"><strong>Map position unavailable</strong><span>This temporary area is not yet registered in the world graph.</span></div>';
        }
    }

    renderWorldMapMarkers(context);
    worldMapScreen.classList.remove("hidden");
}

function closeWorldMap() {
    if (worldMapScreen) worldMapScreen.classList.add("hidden");
}

// ============================================================
// SAVE / LOAD
// ============================================================

function getSaveSnapshot() {
    return {
        version: 1,
        savedAt: new Date().toISOString(),
        gameState: {
            playerName: gameState.playerName,
            gender: gameState.gender,
            playerCustomization: { ...gameState.playerCustomization },
            starter: gameState.starter,
            starterAvailable: gameState.starterAvailable,
            starterData: gameState.starterData,
            party: gameState.party,
            activePartyIndex: gameState.activePartyIndex,
            selectedPartyIndex: gameState.selectedPartyIndex,
            captureDevices: gameState.captureDevices,
            vale: gameState.vale,
            badges: gameState.badges,
            crystals: gameState.crystals,
            items: gameState.items,
            collectedItems: gameState.collectedItems,
            entheonDirectory: gameState.entheonDirectory,
            currentMap: gameState.currentMap,
            ferryReturnMap: gameState.ferryReturnMap,
            ferryReturnX: gameState.ferryReturnX,
            ferryReturnY: gameState.ferryReturnY
        },
        player: {
            x: player.x,
            y: player.y,
            direction: player.direction,
            frame: player.frame
        }
    };
}

function hasSavedGame() {
    try {
        return Boolean(localStorage.getItem(KALEO_SAVE_KEY));
    } catch (error) {
        console.warn("Kaleo save check unavailable:", error);
        return false;
    }
}

function saveGame(showMessage = true) {
    if (gameState.mode !== "overworld") return false;

    try {
        localStorage.setItem(KALEO_SAVE_KEY, JSON.stringify(getSaveSnapshot()));
        if (showMessage) {
            closeGameMenu();
            showWorldMessage("Game saved. Your progress is safe.");
        }
        return true;
    } catch (error) {
        console.error("Unable to save Kaleo:", error);
        if (showMessage) showWorldMessage("The game could not be saved in this browser.");
        return false;
    }
}

function clearSavedGame() {
    try {
        localStorage.removeItem(KALEO_SAVE_KEY);
    } catch (error) {
        console.warn("Unable to clear Kaleo save:", error);
    }
}

function loadSavedGame() {
    let raw;
    try {
        raw = localStorage.getItem(KALEO_SAVE_KEY);
    } catch (error) {
        console.warn("Kaleo save unavailable:", error);
        return false;
    }

    if (!raw) return false;

    try {
        const snapshot = JSON.parse(raw);
        if (!snapshot || snapshot.version !== 1 || !snapshot.gameState || !snapshot.player) return false;

        const saved = snapshot.gameState;
        gameState.playerName = saved.playerName || "";
        gameState.gender = saved.gender || "boy";
        gameState.playerCustomization = {
            hair: saved.playerCustomization?.hair || (gameState.gender === "girl" ? "brown" : "blond"),
            eyes: saved.playerCustomization?.eyes || (gameState.gender === "girl" ? "brown" : "amber"),
            outfit: saved.playerCustomization?.outfit || "default"
        };
        gameState.starter = saved.starter || null;
        gameState.starterAvailable = Boolean(saved.starterAvailable);
        gameState.starterData = saved.starterData || null;
        gameState.party = Array.isArray(saved.party) ? saved.party : [];
        gameState.activePartyIndex = Number.isInteger(saved.activePartyIndex) ? saved.activePartyIndex : 0;
        gameState.selectedPartyIndex = Number.isInteger(saved.selectedPartyIndex) ? saved.selectedPartyIndex : 0;
        gameState.captureDevices = Number.isFinite(saved.captureDevices) ? saved.captureDevices : 5;
        gameState.vale = Number.isFinite(saved.vale) ? saved.vale : 1500;
        gameState.badges = Array.isArray(saved.badges) ? saved.badges : [];
        gameState.crystals = saved.crystals || gameState.crystals;
        gameState.items = saved.items || gameState.items;
        gameState.collectedItems = saved.collectedItems || {};
        gameState.entheonDirectory = saved.entheonDirectory || { seen: {}, captured: {} };
        gameState.ferryReturnMap = saved.ferryReturnMap || null;
        gameState.ferryReturnX = saved.ferryReturnX ?? null;
        gameState.ferryReturnY = saved.ferryReturnY ?? null;
        gameState.battle = null;
        gameState.trainerBattle = null;
        gameState.activeDialogue = null;
        gameState.dialogueIndex = 0;
        gameState.evolutionPromptOpen = false;
        gameState.mode = "overworld";
        gameState.currentScene = "overworld";

        Object.values(maps).forEach(map => {
            (map.npcs || []).forEach(npc => {
                if (npc.type === "starter") npc.chosen = Boolean(gameState.starter);
            });
        });

        const mapId = maps[saved.currentMap] ? saved.currentMap : "town";
        loadMap(mapId, snapshot.player.x, snapshot.player.y);
        player.direction = snapshot.player.direction || "down";
        player.frame = Number.isInteger(snapshot.player.frame) ? snapshot.player.frame : 0;
        player.moving = false;

        introScreen.classList.add("hidden");
        characterCreationScreen?.classList.add("hidden");
        overworldScreen.classList.remove("hidden");
        gameMenu?.classList.add("hidden");
        renderBadges();
        renderParty();
        drawGame();
        showWorldMessage(`Welcome back, ${gameState.playerName || "Trainer"}.`);

        cancelAnimationFrame(animationFrame);
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(gameLoop);
        return true;
    } catch (error) {
        console.error("Unable to load Kaleo save:", error);
        return false;
    }
}

function openAppearanceEditor() {
    if (gameState.mode !== "overworld") return;

    appearanceEditing = true;
    appearanceReturnContext = {
        mapId: gameState.currentMap,
        x: player.x,
        y: player.y,
        direction: player.direction,
        frame: player.frame
    };

    closeGameMenu();
    overworldScreen.classList.add("hidden");
    characterCreationScreen.classList.remove("hidden");
    gameState.mode = "appearance";
    gameState.currentScene = "appearance";
    renderCharacterCreation();
}

// ============================================================
// OVERWORLD MENU
// ============================================================

function openGameMenu() {
    if (gameState.mode !== "overworld" || !gameMenu) return;
    gameMenu.classList.remove("hidden");
    Object.keys(keys || {}).forEach(key => { keys[key] = false; });
}

function closeGameMenu() {
    if (gameMenu) gameMenu.classList.add("hidden");
}

if (menuButton) {
    menuButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        if (gameMenu?.classList.contains("hidden")) openGameMenu();
        else closeGameMenu();
    });
}

if (menuCloseButton) {
    menuCloseButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        closeGameMenu();
    });
}

if (saveGameButton) {
    saveGameButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        saveGame(true);
    });
}

if (appearanceButton) {
    appearanceButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openAppearanceEditor();
    });
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

    if (key === "m" && gameState.mode === "overworld") {
        event.preventDefault();
        if (worldMapScreen?.classList.contains("hidden")) openWorldMap();
        else closeWorldMap();
        return;
    }

    if (key === "escape" && gameState.mode === "overworld") {
        if (gameMenu && !gameMenu.classList.contains("hidden")) {
            event.preventDefault();
            closeGameMenu();
            return;
        }
        if (worldMapScreen && !worldMapScreen.classList.contains("hidden")) {
            event.preventDefault();
            closeWorldMap();
            return;
        }
    }

    if (gameState.mode === "overworld" && gameMenu && !gameMenu.classList.contains("hidden")) {
        if (!["tab", "shift", "control", "alt"].includes(key)) event.preventDefault();
        return;
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
    closeGameMenu();
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
    // Search outward instead of only checking a handful of offsets.
    // Irregular route footprints can legitimately have a void/terrain patch
    // near a directional entrance, so the arrival point should be the nearest
    // genuinely walkable tile rather than a hard-coded fallback.
    const candidates = [];
    const maxRadius = 8;

    for (let radius = 0; radius <= maxRadius; radius++) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
                candidates.push([x + dx, y + dy]);
            }
        }
    }

    for (const [cx, cy] of candidates) {
        if (canMoveTo(cx, cy)) {
            return { x: cx, y: cy };
        }
    }

    // Last resort: use the requested location. This should only happen if a
    // future map is completely enclosed, which should be caught during map
    // testing rather than during normal travel.
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
    gameState.transitionCooldown = 300;

    areaStatus.textContent = currentMap.name;
    renderBadges();

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

    // Check an already-positioned player as well. Boundary doors can place the
    // player directly on the doorway tile, so transitions must not depend on
    // another movement event occurring.
    if (gameState.transitionCooldown <= 0) {
        checkAutomaticTransitions();
        if (gameState.transitionCooldown > 0) return;
    }

    if (dx === 0 && dy === 0) {
        player.moving = false;
        player.frame = 0;
        player.frameClock = 0;
        return;
    }

    player.moving = true;
    if (Math.abs(dx) >= Math.abs(dy)) {
        player.direction = dx < 0 ? "left" : "right";
    } else {
        player.direction = dy < 0 ? "up" : "down";
    }

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

    // Four-frame production walk cycle.  Use an accumulator rather than
    // resetting the clock so animation speed stays stable across frame-rate
    // fluctuations.  The same frame index is used by the selected 256×96
    // sheet, so movement and animation remain synchronised.
    player.frameClock += delta * 16.67;
    const WALK_FRAME_MS = 110;
    while (player.frameClock >= WALK_FRAME_MS) {
        player.frame = (player.frame + 1) % 4;
        player.frameClock -= WALK_FRAME_MS;
    }

    // Boundary exits need to be reachable at the edge of the map.
    // Ordinary walls stay inset, but an exit on a boundary extends the
    // playable clamp all the way to the centre of that doorway tile.
    const exits = currentMap.exits || [];
    const mapWidth = getMapWidth();
    const mapHeight = getMapHeight();
    const hasWestExit = exits.some(exit => exit.x === 0);
    const hasEastExit = exits.some(exit => exit.x === mapWidth - 1);
    const hasNorthExit = exits.some(exit => exit.y === 0);
    const hasSouthExit = exits.some(exit => exit.y === mapHeight - 1);

    const minX = hasWestExit ? 0.5 : 0.55;
    const maxX = hasEastExit ? mapWidth - 0.5 : mapWidth - 1.55;
    const minY = hasNorthExit ? 0.5 : 0.55;
    const maxY = hasSouthExit ? mapHeight - 0.5 : mapHeight - 0.55;

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
               tile !== TILE.VOID &&
               tile !== TILE.TREE &&
               tile !== TILE.WATER &&
               tile !== TILE.SHELF &&
               tile !== TILE.LAB &&
               tile !== TILE.DISPLAY;
    });

    if (!terrainClear) {
        return false;
    }

    return !getNpcs().some(npc => {
        if (npc.interaction === 'item' || npc.type === 'item') return false;
        const distance = Math.hypot(x - npc.x, y - npc.y);
        return distance < 0.65;
    });
}

function getTile(x, y) {
    if (y < 0 || y >= currentMap.data.length || x < 0) {
        return TILE.WALL;
    }

    const row = currentMap.data[y] || "";
    if (x >= row.length) return TILE.WALL;

    const tile = row[x];
    return tile === TILE_VOID ? TILE.VOID : tile;
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
            markEntheonCaptured(member.species);
            syncDirectoryFromParty();
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

    const beforeLevel = member.level;
    const beforeStats = { ...member.stats };
    const beforeMoveNames = new Set((member.moves || []).map(move => move.name));

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

    const learnedMoves = (member.moves || []).filter(move => !beforeMoveNames.has(move.name));
    const statGains = {
        hp: Math.max(0, (member.stats?.hp || 0) - (beforeStats.hp || 0)),
        attack: Math.max(0, (member.stats?.attack || 0) - (beforeStats.attack || 0)),
        defense: Math.max(0, (member.stats?.defense || 0) - (beforeStats.defense || 0)),
        specialAttack: Math.max(0, (member.stats?.specialAttack || 0) - (beforeStats.specialAttack || 0)),
        specialDefense: Math.max(0, (member.stats?.specialDefense || 0) - (beforeStats.specialDefense || 0)),
        speed: Math.max(0, (member.stats?.speed || 0) - (beforeStats.speed || 0))
    };

    if (levels.length > 0) {
        markEvolutionEligibility(member);
    }

    member.xpToNext = xpRequiredForLevel(member.level);
    return {
        gained: amount,
        levels,
        beforeLevel,
        learnedMoves,
        statGains
    };
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
        closeGameMenu();
        openInventory(false);
    });
}

if (worldMapButton) {
    worldMapButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeGameMenu();
        openWorldMap();
    });
}

if (worldMapCloseButton) {
    worldMapCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeWorldMap();
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

if (badgeButton) {
    badgeButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeGameMenu();
        renderBadges();
        badgeScreen?.classList.remove("hidden");
        overworldScreen?.classList.add("hidden");
    });
}

if (badgeCloseButton) {
    badgeCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        badgeScreen?.classList.add("hidden");
        overworldScreen?.classList.remove("hidden");
        drawGame();
    });
}

if (directoryButton) {
    directoryButton.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); closeGameMenu(); renderDirectory(); directoryScreen?.classList.remove("hidden"); overworldScreen?.classList.add("hidden"); });
}
if (directoryCloseButton) {
    directoryCloseButton.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); directoryScreen?.classList.add("hidden"); overworldScreen?.classList.remove("hidden"); drawGame(); });
}

if (partyButton) {
    partyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeGameMenu();
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

    partyPanel.classList.add("hidden");
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
    markEntheonSeen(wildSpecies);
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

function ensureGymSpeciesBattleData(species, level) {
    if (speciesBattleData[species]) return speciesBattleData[species];

    // Some canonical Gym rosters contain species whose detailed numeric battle
    // data has not yet been entered into the prototype. Do not silently remove
    // those Entheon from a Gym team. Give them temporary, deterministic
    // prototype battle data so the canonical roster and official battle format
    // remain intact until their full species data is implemented.
    const name = String(species || 'Entheon');
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    const levelValue = Math.max(1, Number(level) || 1);
    const spread = n => 34 + ((hash >>> n) % 18);
    const hp = 30 + ((hash >>> 3) % 12);
    speciesBattleData[species] = {
        level: levelValue,
        baseStats: {
            hp,
            attack: spread(0),
            defense: spread(5),
            specialAttack: spread(10),
            specialDefense: spread(15),
            speed: spread(20)
        },
        moves: [
            { level: 1, name: 'Tackle', category: 'Physical', power: 40, accuracy: 100, effect: '—' },
            { level: 1, name: 'Focus', category: 'Status', power: 0, accuracy: 100, effect: 'Raises Attack and accuracy' },
            { level: 7, name: 'Guard Break', category: 'Physical', power: 50, accuracy: 95, effect: '—' },
            { level: 13, name: 'Signature Pulse', category: 'Special', power: 55, accuracy: 100, effect: '—' }
        ]
    };
    return speciesBattleData[species];
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

    // Only start a battle when every team member has battle data. A missing
    // species must never leave the game in a half-switched battle/overworld
    // state. This also makes future Trainer teams safer while species data is
    // still being authored.
    const playableTeam = team.map(entry => {
        ensureGymSpeciesBattleData(entry.species, entry.level);
        return entry;
    });
    if (!playableTeam.length) {
        console.error("Trainer has no battle team:", npc.name, team);
        showWorldMessage(`${npc.name} is not ready for a battle yet.`);
        return;
    }

    markEntheonSeen(playableTeam[0].species);
    const first = createCreature(playableTeam[0].species, playableTeam[0].level);
    if (!first) {
        console.error("Could not create trainer's first creature:", playableTeam[0]);
        showWorldMessage("This Trainer battle is not ready yet.");
        return;
    }
    gameState.trainerBattle = {
        npc,
        team: playableTeam,
        index: 0,
        reward: Number(npc.battle.reward || 0),
        format: npc.battle.format || `${playableTeam.length}v${playableTeam.length}`,
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
    renderBattle(`${npc.name} challenges you! ${npc.name} sent out ${first.species}! (${gameState.trainerBattle.format})`);
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
    markEntheonSeen(nextData.species);
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
            const moveText = result.learnedMoves.length
                ? ` Learned: ${result.learnedMoves.map(move => move.name).join(", ")}.`
                : "";
            gameState.vale += trainerBattle.reward;
            if (trainerBattle.npc.interaction === "gym" && trainerBattle.npc.badgeId && !gameState.badges.includes(trainerBattle.npc.badgeId)) {
                gameState.badges.push(trainerBattle.npc.badgeId);
                renderBadges();
            }
            gameState.trainerBattle = null;
            gameState.battle = null;
            gameState.mode = "overworld";
            battleScreen.classList.add("hidden");
            overworldScreen.classList.remove("hidden");
            gameState.encounterCooldown = 1200;
            renderParty();
            const badgeText = trainerBattle.npc.interaction === "gym" && trainerBattle.npc.badgeName ? ` You earned the ${trainerBattle.npc.badgeName}!` : "";
            showWorldMessage(`${trainerBattle.npc.name} was defeated! You received ${trainerBattle.reward} Vale and ${xpGain} XP.${levelText}${moveText}${badgeText}`);
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
            markEntheonCaptured(wildName);
            const captured = createCreature(
                currentBattle.wild.name,
                wildLevel,
                currentBattle.wild.hp
            );

            gameState.party.push(captured);
            syncDirectoryFromParty();
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
                    const moveText = result.learnedMoves.length
                        ? ` Learned: ${result.learnedMoves.map(move => move.name).join(", ")}.`
                        : "";
                    message = `${activeMember.species} gained ${xpGain} XP and reached Level ${result.levels.join(", ")}!${moveText}`;
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
    // The Research Center researcher is a special, unambiguous interaction.
    // Do not allow any stale/incorrect interaction metadata to route this NPC
    // through ferry logic. The researcher must always open the starter intro.
    if (currentMap === maps.research_center && npc.id === "researcher") {
        openNpcDialogue(npc);
        return;
    }

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
            openNpcDialogue(npc);
            return;

        case "ferry":
            useLumeFerry(npc);
            return;

        case "ferry_return":
            returnFromLumeFerry();
            return;

        case "item":
            collectFieldItem(npc);
            return;

        case "merchant":
        case "trainer":
        default:
            openNpcDialogue(npc);
            return;
    }
}

function collectFieldItem(npc) {
    if (!npc?.itemId || gameState.collectedItems[npc.id]) return;

    if (npc.itemId === 'capture') {
        const crystals = getCrystalInventory();
        if (!crystals.capture) crystals.capture = { id:'capture', name:'Capture Crystal', grade:'Capture', quantity:0 };
        crystals.capture.quantity += 1;
        gameState.captureDevices = getTotalCrystalCount();
        gameState.collectedItems[npc.id] = true;
        showWorldMessage('You found a Capture Crystal.');
    } else {
        const def = gameState.shop?.stock?.[npc.itemId];
        if (!def) return;
        const inventory = getItemInventory();
        if (!inventory[npc.itemId]) {
            inventory[npc.itemId] = {
                id:npc.itemId, name:def.name, description:def.description, quantity:0,
                kind:npc.itemId === 'greaterRestore' || npc.itemId === 'basicRestore' ? 'heal' : 'revive',
                amount:npc.itemId === 'basicRestore' ? 25 : npc.itemId === 'greaterRestore' ? 60 : 0.5
            };
        }
        inventory[npc.itemId].quantity += 1;
        gameState.collectedItems[npc.id] = true;
        showWorldMessage(`You found a ${def.name}.`);
    }

    renderInventoryList();
    renderCrystalList();
    drawGame();
}

function useLumeFerry(npc) {
    const targetMap = npc.destinationMap || "lume_city";

    if (!maps[targetMap]) {
        showWorldMessage("The ferry service to Lume is planned, but Lume is not yet available in this build.");
        return;
    }

    const confirmed = window.confirm("Take the ferry to Lume?");
    if (!confirmed) return;

    gameState.ferryReturnMap = gameState.currentMap;
    gameState.ferryReturnX = npc.returnX ?? player.x;
    gameState.ferryReturnY = npc.returnY ?? player.y;

    transitionTo(
        targetMap,
        npc.destinationX ?? 14.5,
        npc.destinationY ?? 15.5,
        "You board the ferry and sail to Lume."
    );
}

function returnFromLumeFerry() {
    // Lume is the central ferry hub. Do not automatically send the player
    // back to whichever port they arrived from: let them choose from all
    // five established Lume ferry destinations.
    const ferryChoices = [
        { locationId: "settlement-2", name: "Settlement 2", mapId: "westmere_settlement2", x: 22.5, y: 17.5 },
        { locationId: "settlement-7", name: "Settlement 7", mapId: "greenvale_settlement7", x: 22.5, y: 17.5 },
        { locationId: "settlement-18", name: "Settlement 18", mapId: "northvale_settlement18", x: 14.5, y: 15.5 },
        { locationId: "settlement-22", name: "Settlement 22", mapId: null, x: 14.5, y: 15.5 },
        { locationId: "settlement-24", name: "Settlement 24", mapId: null, x: 14.5, y: 15.5 }
    ];

    const available = ferryChoices.filter(choice => maps[choice.mapId]);
    if (!available.length) {
        showWorldMessage("No Lume ferry destinations are available in this build yet.");
        return;
    }

    const lines = ferryChoices.map((choice, index) => {
        const status = maps[choice.mapId] ? "" : " (not available yet)";
        return `${index + 1}. ${choice.name}${status}`;
    });

    const answer = window.prompt(
        "Lume Ferry Terminal\n\nWhere would you like to travel?\n\n" + lines.join("\n") + "\n\nEnter a number (1–5), or Cancel to stay in Lume.",
        "1"
    );

    if (answer === null) return;
    const index = Number.parseInt(answer, 10) - 1;
    if (!Number.isInteger(index) || index < 0 || index >= ferryChoices.length) {
        showWorldMessage("Please choose one of the numbered ferry destinations.");
        return;
    }

    const choice = ferryChoices[index];
    if (!maps[choice.mapId]) {
        showWorldMessage(`${choice.name} is part of Lume's ferry network, but that location has not been built in the current game build yet.`);
        return;
    }

    transitionTo(
        choice.mapId,
        choice.x,
        choice.y,
        `The ferry carries you from Lume to ${choice.name}.`
    );
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
        } else if (interaction === "trainer" || interaction === "gym") {
            if (interaction === "gym" && npc.badgeId && gameState.badges.includes(npc.badgeId)) {
                showWorldMessage(`You have already earned the ${npc.badgeName} here.`);
                return;
            }
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
                kind: itemId === "basicRestore" || itemId === "greaterRestore" ? "heal" : "revive",
                amount: itemId === "basicRestore" ? 25 : itemId === "greaterRestore" ? 60 : 0.5
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
    const S = TILE_ART_SCALE;
    const q = value => value * S;

    if (tile === TILE.VOID) {
        ctx.fillStyle = "#0f1017";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        return;
    }

    if (tile === TILE.GRASS) {
        ctx.fillStyle = "#68a85a";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#79b969";
        ctx.fillRect(x + q(7), y + q(8), q(3), q(3));
        ctx.fillRect(x + q(22), y + q(19), q(3), q(3));
    }

    else if (tile === TILE.TALL_GRASS) {
        ctx.fillStyle = "#4f963f";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "#2f7030";
        ctx.lineWidth = Math.max(1, q(2));
        for (let i = 0; i < 5; i++) {
            const bx = x + q(5 + i * 5);
            ctx.beginPath();
            ctx.moveTo(bx, y + q(25));
            ctx.lineTo(bx + q(2), y + q(10));
            ctx.stroke();
        }
    }

    else if (tile === TILE.PATH) {
        ctx.fillStyle = "#c8ad78";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#d7bf8d";
        ctx.fillRect(x + q(5), y + q(6), q(3), q(3));
        ctx.fillRect(x + q(20), y + q(20), q(3), q(3));
    }

    else if (tile === TILE.FLOOR) {
        ctx.fillStyle = "#d9d5c8";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = "#c9c4b5";
        ctx.fillRect(x, y + q(30), TILE_SIZE, q(2));
        ctx.fillRect(x + q(30), y, q(2), TILE_SIZE);
    }

    else if (tile === TILE.SHELF) {
        ctx.fillStyle = "#5b4635";
        ctx.fillRect(x + q(3), y + q(3), q(26), q(26));
        ctx.fillStyle = "#9b7952";
        ctx.fillRect(x + q(6), y + q(7), q(20), q(4));
        ctx.fillRect(x + q(6), y + q(15), q(20), q(4));
        ctx.fillRect(x + q(6), y + q(23), q(20), q(3));
        ctx.fillStyle = "#d8c28d";
        ctx.fillRect(x + q(8), y + q(5), q(4), q(3));
        ctx.fillRect(x + q(17), y + q(13), q(4), q(3));
    }

    else if (tile === TILE.LAB) {
        ctx.fillStyle = "#394958";
        ctx.fillRect(x + q(2), y + q(4), q(28), q(24));
        ctx.fillStyle = "#78a5b6";
        ctx.fillRect(x + q(5), y + q(7), q(22), q(5));
        ctx.fillStyle = "#26313b";
        ctx.fillRect(x + q(5), y + q(16), q(22), q(9));
        ctx.fillStyle = "#77d4bd";
        ctx.fillRect(x + q(9), y + q(18), q(4), q(4));
        ctx.fillRect(x + q(18), y + q(18), q(4), q(4));
    }

    else if (tile === TILE.DISPLAY) {
        ctx.fillStyle = "#4b6170";
        ctx.fillRect(x + q(3), y + q(5), q(26), q(22));
        ctx.fillStyle = "#a9d9df";
        ctx.fillRect(x + q(6), y + q(8), q(20), q(12));
        ctx.fillStyle = "#6a91a1";
        ctx.fillRect(x + q(10), y + q(22), q(12), q(3));
    }

    else if (tile === TILE.PLANT) {
        ctx.fillStyle = "#7c5639";
        ctx.fillRect(x + q(12), y + q(19), q(8), q(9));
        ctx.fillStyle = "#4c9a5a";
        ctx.beginPath();
        ctx.arc(x + q(11), y + q(14), q(7), 0, Math.PI * 2);
        ctx.arc(x + q(20), y + q(12), q(7), 0, Math.PI * 2);
        ctx.fill();
    }

    else if (tile === TILE.TREE) {
        ctx.fillStyle = "#3f7d43";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#276332";
        ctx.beginPath();
        ctx.arc(x + q(16), y + q(13), q(13), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#795333";
        ctx.fillRect(x + q(13), y + q(20), q(6), q(12));
    }

    else if (tile === TILE.WATER) {
        ctx.fillStyle = "#4c8fc2";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "#75b4dc";
        ctx.lineWidth = Math.max(1, q(2));

        ctx.beginPath();
        ctx.moveTo(x + q(5), y + q(12));
        ctx.lineTo(x + q(13), y + q(12));
        ctx.moveTo(x + q(18), y + q(22));
        ctx.lineTo(x + q(27), y + q(22));
        ctx.stroke();
    }

    else if (tile === TILE.WALL) {
        ctx.fillStyle = "#55535d";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "#696771";
        ctx.lineWidth = Math.max(1, q(1));
        ctx.strokeRect(x + q(2), y + q(2), TILE_SIZE - q(4), TILE_SIZE - q(4));
    }

    else if (tile === TILE.DOOR) {
        ctx.fillStyle = "#754d32";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#b9824e";
        ctx.fillRect(x + q(5), y + q(4), TILE_SIZE - q(10), TILE_SIZE - q(4));

        ctx.fillStyle = "#e0bd68";
        ctx.beginPath();
        ctx.arc(x + q(22), y + q(18), q(2), 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawNpcs() {
    getNpcs().forEach(npc => {
        const px = npc.x * TILE_SIZE;
        const py = npc.y * TILE_SIZE;

        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(px, py + 9 * TILE_ART_SCALE, 9 * TILE_ART_SCALE, 4 * TILE_ART_SCALE, 0, 0, Math.PI * 2);
        ctx.fill();

        if (npc.type === "item" || npc.interaction === "item") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.20)";
            ctx.beginPath();
            ctx.ellipse(px, py + 7 * TILE_ART_SCALE, 8 * TILE_ART_SCALE, 3 * TILE_ART_SCALE, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = npc.color || '#d5b35f';
            ctx.beginPath();
            ctx.moveTo(px, py - 12 * TILE_ART_SCALE);
            ctx.lineTo(px + 9 * TILE_ART_SCALE, py);
            ctx.lineTo(px, py + 12 * TILE_ART_SCALE);
            ctx.lineTo(px - 9 * TILE_ART_SCALE, py);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.round(13 * TILE_ART_SCALE)}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(npc.icon || '✦', px, py + 4);
            return;
        }

        if (npc.type === "starter") {
            ctx.fillStyle = npc.color;
            ctx.beginPath();
            ctx.arc(px, py - 4 * TILE_ART_SCALE, 12 * TILE_ART_SCALE, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#222";
            ctx.fillRect(px - 5 * TILE_ART_SCALE, py - 7 * TILE_ART_SCALE, 3 * TILE_ART_SCALE, 3 * TILE_ART_SCALE);
            ctx.fillRect(px + 2, py - 7, 3, 3);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 10px Arial";
            ctx.textAlign = "center";
            ctx.fillText(npc.name, px, py - 22);
            return;
        }

        ctx.fillStyle = npc.color;
        ctx.fillRect(px - 9 * TILE_ART_SCALE, py - 7, 18, 18);

        ctx.fillStyle = "#f0c6a4";
        ctx.beginPath();
        ctx.arc(px, py - 11 * TILE_ART_SCALE, 8 * TILE_ART_SCALE, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#3c2a24";
        ctx.fillRect(px - 7, py - 19 * TILE_ART_SCALE, 14 * TILE_ART_SCALE, 5 * TILE_ART_SCALE);

        ctx.fillStyle = "#222";
        ctx.fillRect(px - 4, py - 12 * TILE_ART_SCALE, 2, 2);
        ctx.fillRect(px + 2, py - 12 * TILE_ART_SCALE, 2, 2);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        const marker = npc.interaction === "merchant" ? "$" : npc.interaction === "trainer" ? "!" : "!";
        ctx.fillText(marker, px, py - 25 * TILE_ART_SCALE);
    });
}

function drawPlayer() {
    const px = player.x * TILE_SIZE;
    const py = player.y * TILE_SIZE;
    const asset = getPlayerAsset(player.direction);
    const frameIndex = player.moving ? player.frame : 0;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Source artwork and world display size are deliberately separate.
    // Production artwork is 64×96 per frame. The high-polish world uses
    // 48px tiles, while the trainer remains 48×72 in-world (1.5 tiles tall).
    // This increases environmental pixel density without making the trainer
    // physically larger on screen.
    const targetWidth = getCharacterConfig().worldFrame?.width || 48;
    const targetHeight = getCharacterConfig().worldFrame?.height || 72;
    const footOffset = getCharacterConfig().worldFrame?.footOffset ?? 4;
    const drawX = Math.round(px - targetWidth / 2);
    const drawY = Math.round(py - targetHeight + footOffset);

    let rendered = false;

    if (asset.state === "ready" && asset.image) {
        rendered = drawPlayerSheet(
            asset.image,
            frameIndex,
            drawX,
            drawY,
            targetWidth,
            targetHeight,
            player.direction
        );
    }

    // A deliberately clear development fallback. It should only be visible
    // while production artwork is missing or has an invalid sheet layout.
    // This is preferable to silently rendering only the ground shadow.
    if (!rendered) {
        ctx.globalAlpha = asset.state === "missing" ? 0.9 : 0.72;

        // body / jacket
        ctx.fillStyle = gameState.gender === "girl" ? "#9a4164" : "#283c5c";
        ctx.fillRect(px - 13, py - 43, 26, 31);

        // legs
        ctx.fillStyle = "#1b2029";
        ctx.fillRect(px - 11, py - 13, 9, 13);
        ctx.fillRect(px + 2, py - 13, 9, 13);

        // head
        ctx.fillStyle = "#f0c6a4";
        ctx.beginPath();
        ctx.arc(px, py - 53, 11, 0, Math.PI * 2);
        ctx.fill();

        // hair
        const hairColours = {
            blond: "#e5bb72", brown: "#76503c", black: "#20252d",
            red: "#a9473f", white: "#d9dce1", blonde: "#e5bb72", auburn: "#8f503d"
        };
        ctx.fillStyle = hairColours[getPlayerVisualSelection().hair] || "#76503c";
        ctx.beginPath();
        ctx.arc(px, py - 58, 11, Math.PI, Math.PI * 2);
        ctx.fill();

        // eyes
        ctx.fillStyle = "#1b1b1b";
        ctx.fillRect(px - 5, py - 53, 2, 2);
        ctx.fillRect(px + 3, py - 53, 2, 2);

        // feet
        ctx.fillStyle = "#d7d9dd";
        ctx.fillRect(px - 12, py - 2, 10, 4);
        ctx.fillRect(px + 2, py - 2, 10, 4);

        ctx.globalAlpha = 1;
    }

    ctx.restore();
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
    gameState.playerCustomization = {
        hair: "blond",
        eyes: "amber",
        outfit: "default"
    };
    player.direction = "down";
    player.frame = 0;
    player.frameClock = 0;
    player.moving = false;
    gameState.starter = null;
    gameState.starterAvailable = false;
    gameState.starterData = null;
    gameState.party = [];
    gameState.activePartyIndex = 0;
    gameState.selectedPartyIndex = 0;
    gameState.captureDevices = 5;
    gameState.crystals = { capture: { id: "capture", name: "Capture Crystal", grade: "Capture", quantity: 5 } };
    gameState.items = {
        basicRestore: { id: "basicRestore", name: "Basic Restore", description: "A field restorative for minor injuries. (Prototype: restores 25 HP.)", quantity: 3, kind: "heal", amount: 25 },
        revitalizingElixir: { id: "revitalizingElixir", name: "Revitalizing Elixir", description: "A specialized restorative for an exhausted Entheon. (Prototype: revives at 50% HP.)", quantity: 1, kind: "revive", amount: 0.5 },
        greaterRestore: { id: "greaterRestore", name: "Greater Restore", description: "A stronger restorative for more serious injuries. (Prototype: restores 60 HP.)", quantity: 0, kind: "heal", amount: 60 }
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
    gameState.badges = [];
    gameState.collectedItems = {};
    renderBadges();

    npcDialogue.classList.add("hidden");
    overworldScreen.classList.add("hidden");
    introScreen.classList.remove("hidden");

    showWelcome();
}

function resetGame() {
    gameState.mode = "intro";
    gameState.currentScene = "welcome";
    gameState.playerName = "";
    gameState.gender = null;
    gameState.playerCustomization = { hair: "blond", eyes: "amber", outfit: "default" };
    gameState.starter = null;
    gameState.starterAvailable = false;
    gameState.starterData = null;
    gameState.party = [];
    gameState.activePartyIndex = 0;
    gameState.selectedPartyIndex = 0;
    gameState.captureDevices = 5;
    gameState.vale = 1500;
    gameState.badges = [];
    gameState.crystals = { capture: { id: "capture", name: "Capture Crystal", grade: "Capture", quantity: 5 } };
    gameState.items = {
        basicRestore: { id: "basicRestore", name: "Basic Restore", description: "A field restorative for minor injuries. (Prototype: restores 25 HP.)", quantity: 3, kind: "heal", amount: 25 },
        revitalizingElixir: { id: "revitalizingElixir", name: "Revitalizing Elixir", description: "A specialized restorative for an exhausted Entheon. (Prototype: revives at 50% HP.)", quantity: 1, kind: "revive", amount: 0.5 },
        greaterRestore: { id: "greaterRestore", name: "Greater Restore", description: "A stronger restorative for more serious injuries. (Prototype: restores 60 HP.)", quantity: 0, kind: "heal", amount: 60 }
    };
    gameState.collectedItems = {};
    gameState.entheonDirectory = { seen: {}, captured: {} };
    gameState.currentMap = "town";
    gameState.ferryReturnMap = null;
    gameState.ferryReturnX = null;
    gameState.ferryReturnY = null;
    gameState.battle = null;
    gameState.trainerBattle = null;
    gameState.activeDialogue = null;
    gameState.dialogueIndex = 0;
    gameState.evolutionPromptOpen = false;

    Object.values(maps).forEach(map => {
        (map.npcs || []).forEach(npc => {
            if (npc.type === "starter") npc.chosen = false;
        });
    });

    player.x = 4;
    player.y = 25;
    player.direction = "down";
    player.frame = 0;
    player.frameClock = 0;
    player.moving = false;
    currentMap = maps.town;
    clearSavedGame();
}

function showWelcome() {
    gameState.mode = "intro";
    gameState.currentScene = "welcome";
    characterCreationScreen?.classList.add("hidden");
    overworldScreen?.classList.add("hidden");
    introScreen.classList.remove("hidden");

    const options = [];

    if (hasSavedGame()) {
        options.push({
            text: "Continue Adventure",
            action: () => {
                if (!loadSavedGame()) showCharacterChoice();
            }
        });
    }

    options.push({
        text: hasSavedGame() ? "New Game" : "Begin your journey",
        action: () => {
            clearSavedGame();
            resetGame();
            showCharacterCreation();
        }
    });

    showScene(
        "Welcome to Kaleo",
        `
        <p>Your journey is about to begin.</p>
        <p>The world of Kaleo awaits.</p>
        ${hasSavedGame() ? "<p class=\"save-notice\">A saved adventure was found in this browser.</p>" : ""}
        `,
        options
    );
}


// ============================================================
// START
// ============================================================

showWelcome();
// ============================================================
// PROTOTYPE ITEM SHOP TIERING
// ============================================================
// Higher-stage cities carry the stronger canonical restorative as the world
// expands. This is a prototype economy layer; exact prices/effects remain
// subject to the final economy/stat balance pass.
(function applyShopTiers(){
    const advancedCities = new Set(['thermalis_city','winterhold_city','northreach_city','lakecrest_city','fairhaven_city']);
    advancedCities.forEach(mapId => {
        const map = maps[mapId];
        (map?.npcs || []).filter(n => n.interaction === 'merchant' && n.shop).forEach(npc => {
            if (!npc.shop.inventory.includes('greaterRestore')) npc.shop.inventory.push('greaterRestore');
        });
    });
})();