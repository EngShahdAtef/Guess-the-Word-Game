// Setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Shahd`;

// Setting game options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 3;

// Manage words
let wordToGuess = "";
const words = ["animal", "bucket", "circle", "dragon", "forest", "guitar", "island", "jacket", "kitten", "letter", "monkey", "number", "pencil", "rocket", "silver", "ticket", "window", "yellow", "zombie"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    // Create main try div
    for (let tryIndex = 1; tryIndex <= numberOfTries; tryIndex++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${tryIndex}`);
        tryDiv.innerHTML = `<span>Try ${tryIndex}</span>`;

        if (tryIndex !== 1) tryDiv.classList.add("disabled-inputs");

        // Create input fields
        for (let letterIndex = 1; letterIndex <= numberOfLetters; letterIndex++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${tryIndex}-letter-${letterIndex}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }

    // Focus on the first input
    inputsContainer.children[0].querySelector("input").focus();

    // Disable all inputs except the first row
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));

    // Navigation control
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            input.value = input.value.toLowerCase();
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });

        input.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);

            if (event.key === "ArrowRight") {
                const nextIndex = currentIndex + 1;
                if (nextIndex < inputs.length) {
                    inputs[nextIndex].focus();
                }
            } else if (event.key === "ArrowLeft") {
                const prevIndex = currentIndex - 1;
                if (prevIndex >= 0) {
                    inputs[prevIndex].focus();
                }
            } else if (event.key === "Backspace" && input.value === "") {
                const prevIndex = currentIndex - 1;
                if (prevIndex >= 0) {
                    inputs[prevIndex].focus();
                }
            }
        });
    });
}
console.log(wordToGuess);

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;

    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // Game logic
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    if (successGuess) {
        messageArea.innerHTML = `You Win! The word was <span>${wordToGuess}</span>`;
        document.querySelectorAll(".inputs > div").forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
        guessButton.disabled = true;
        getHintButton.disabled = true;

    } else {
        if (currentTry >= numberOfTries) {
            messageArea.innerHTML = `You Lose! The word was <span>${wordToGuess}</span>`;
            guessButton.disabled = true;
            return;
        }

        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        document.querySelectorAll(`.try-${currentTry} input`).forEach((input) => (input.disabled = true));

        currentTry++;

        document.querySelectorAll(`.try-${currentTry} input`).forEach((input) => (input.disabled = false));
        let el = document.querySelector(`.try-${currentTry}`);
        if (el) {
            el.classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            guessButton.disabled = true;
            getHintButton.disabled = true;
        }
    }
}

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;

        const enabledInputs = document.querySelectorAll("input:not([disabled])");
        const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
        if (emptyEnabledInputs.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
            const randomInput = emptyEnabledInputs[randomIndex];
            const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
            if (indexToFill !== -1) {
                randomInput.value = wordToGuess[indexToFill];
            }
        }
    }
    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }
}

// Call the function on page load
window.onload = function () {
    generateInput();
};
