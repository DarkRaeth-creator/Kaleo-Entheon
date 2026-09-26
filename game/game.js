const gameScreen = document.querySelector(".game-screen");

function showOpening() {
    gameScreen.innerHTML = `
        <h2>Welcome to Kaleo</h2>

        <div class="dialogue">
            <p>
                You have arrived in Kaleo.
            </p>

            <p>
                Today is the beginning of your journey.
            </p>

            <p>
                The world of Entheon awaits you.
            </p>

            <p>
                Your adventure begins here.
            </p>
        </div>

        <div class="options">
            <button class="option-button" onclick="showStarterSelection()">
                Continue
            </button>
        </div>
    `;
}

function showStarterSelection() {
    gameScreen.innerHTML = `
        <h2>Choose Your First Entheon</h2>

        <div class="dialogue">
            <p>
                Several young Entheon have been selected
                as suitable companions for new trainers.
            </p>

            <p>
                Take your time and choose the companion
                you want to begin your journey with.
            </p>
        </div>

        <div class="creature-list">
            <div class="creature-card">
                <h3>Nimblet</h3>
                <p>Starter Entheon</p>
            </div>

            <div class="creature-card">
                <h3>Pipiri</h3>
                <p>Starter Entheon</p>
            </div>

            <div class="creature-card">
                <h3>Morrowe</h3>
                <p>Starter Entheon</p>
            </div>
        </div>
    `;
}
