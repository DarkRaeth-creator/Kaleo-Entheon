// ============================================================
// KALEO – WORLD OF ENTHEON
// Main Game Logic
// ============================================================


// ------------------------------------------------------------
// GAME STATE
// ------------------------------------------------------------

const gameState = {
    currentScene: "welcome",
    playerName: "",
    starter: null
};


// ------------------------------------------------------------
// SCREEN ELEMENTS
// ------------------------------------------------------------

const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const optionsContainer = document.getElementById("options");


// ------------------------------------------------------------
// SCENE SYSTEM
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// OPENING
// ------------------------------------------------------------

function showOpening() {

    gameState.currentScene = "opening";

    showScene(
        "Kaleo",
        `
        <p>You have arrived in Kaleo.</p>

        <p>
        Today is the beginning of your journey.
        </p>

        <p>
        The world of Kaleo awaits.
        </p>
        `,
        [
            {
                text: "Begin",
                action: showArrival
            }
        ]
    );
}


// ------------------------------------------------------------
// ARRIVAL
// ------------------------------------------------------------

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

        <p>
        Somewhere ahead lies the path you have chosen to follow.
        </p>
        `,
        [
            {
                text: "Continue",
                action: showResearchCenter
            }
        ]
    );
}


// ------------------------------------------------------------
// RESEARCH CENTER
// ------------------------------------------------------------

function showResearchCenter() {

    gameState.currentScene = "research-center";

    showScene(
        "Entheon Research and Training Center",
        `
        <p>
        You stand inside the local Entheon Research and Training
        Center.
        </p>

        <p>
        Around you are displays, research equipment and information
        about the creatures that inhabit Kaleo.
        </p>

        <p>
        Beyond the large windows lies the world outside.
        </p>

        <p>
        Your journey is about to truly begin.
        </p>
        `,
        [
            {
                text: "Continue",
                action: showStarterIntroduction
            }
        ]
    );
}


// ------------------------------------------------------------
// STARTER INTRODUCTION
// ------------------------------------------------------------

function showStarterIntroduction() {

    gameState.currentScene = "starter-introduction";

    showScene(
        "Your First Entheon",
        `
        <p>
        Before you can begin exploring Kaleo, there is one
        important decision you must make.
        </p>

        <p>
        You must choose your first Entheon.
        </p>

        <p>
        Several young Entheon have been selected as suitable
        companions for new trainers.
        </p>

        <p>
        Each one is different.
        </p>

        <p>
        Your first companion will be the beginning of your own
        story in Kaleo.
        </p>
        `,
        [
            {
                text: "Meet the starters",
                action: showStarterSelection
            }
        ]
    );
}


// ------------------------------------------------------------
// STARTER SELECTION
// ------------------------------------------------------------

function showStarterSelection() {

    gameState.currentScene = "starter-selection";

    showScene(
        "Choose Your First Entheon",
        `
        <p>
        Three young Entheon have been selected as potential
        companions.
        </p>

        <p>
        Take your time. You can examine each one before making
        your decision.
        </p>
        `,
        [
            {
                text: "Nimblet",
                action: () => showStarter("Nimblet")
            },
            {
                text: "Pipiri",
                action: () => showStarter("Pipiri")
            },
            {
                text: "Morrowe",
                action: () => showStarter("Morrowe")
            }
        ]
    );
}


// ------------------------------------------------------------
// STARTER DETAILS
// ------------------------------------------------------------

function showStarter(name) {

    gameState.currentScene = "starter-" + name.toLowerCase();

    showScene(
        name,
        `
        <p>
        You approach <strong>${name}</strong>.
        </p>

        <p>
        You take a moment to observe the young Entheon carefully.
        </p>

        <p>
        There will be more information about Entheon species,
        their appearances, behaviours, abilities and other
        characteristics as the game develops.
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


// ------------------------------------------------------------
// CHOOSE STARTER
// ------------------------------------------------------------

function chooseStarter(name) {

    gameState.starter = name;

    gameState.currentScene = "starter-chosen";

    showScene(
        "A New Partnership",
        `
        <p>
        You have chosen <strong>${name}</strong>.
        </p>

        <p>
        This Entheon will accompany you as you begin your journey
        through Kaleo.
        </p>

        <p>
        Your adventure begins now.
        </p>
        `,
        [
            {
                text: "Continue",
                action: showComingSoon
            }
        ]
    );
}


// ------------------------------------------------------------
// TEMPORARY PLACEHOLDER
// ------------------------------------------------------------

function showComingSoon() {

    showScene(
        "Kaleo",
        `
        <p>
        The next part of the journey is still under construction.
        </p>

        <p>
        Your adventure with <strong>${gameState.starter}</strong>
        will continue here.
        </p>
        `,
        [
            {
                text: "Restart",
                action: restartGame
            }
        ]
    );
}


// ------------------------------------------------------------
// RESTART
// ------------------------------------------------------------

function restartGame() {

    gameState.currentScene = "welcome";
    gameState.playerName = "";
    gameState.starter = null;

    showWelcome();
}


// ------------------------------------------------------------
// WELCOME SCREEN
// ------------------------------------------------------------

function showWelcome() {

    gameState.currentScene = "welcome";

    showScene(
        "Welcome to Kaleo",
        `
        <p>
        Your journey is about to begin.
        </p>

        <p>
        The world of Kaleo awaits.
        </p>
        `,
        [
            {
                text: "Begin your journey",
                action: showOpening
            }
        ]
    );
}


// ------------------------------------------------------------
// START GAME
// ------------------------------------------------------------

showWelcome();
