const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
//const originText = document.querySelector("#origin-text p").innerHTML;
const   originText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");


////////////////////
// Text pool (required for randomization)
const textSamples = [
  "The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues.",
  "The 20 meter pacer test will begin in 30 seconds.",
  "Line up at the start.",
  "The running speed starts slowly but gets faster each minute after you hear this signal bodeboop.",
  "A single lap should be completed every time you hear this sound.",
  "Remember to run in a straight line and run as long as possible.",
  "The second time you fail to complete a lap before the sound, your test is over.",
  "The test will begin on the word start.",
  "On your mark. Get ready! Start.",
  "zz"
];

// State variables
let timer = [0, 0, 0]; // minutes, seconds, hundredths
let interval = null;
let timerRunning = false;

let errors = 0;

function getRandomText() {
    const index = Math.floor(Math.random() * textSamples.length);
    return textSamples[index];
}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0, 0, 0];
    timerRunning = false;

    testArea.value = "";
    theTimer.textContent = "00:00:00";

    testWrapper.style.borderColor = "grey";
    testArea.disabled= false;

    originText.textContent = getRandomText();

    errors = 0;
}
// Run a standard minute/second/hundredths timer:
function runTimer() {
    let current = `${timer[0]}:${timer[1]}:${timer[2]}`;

    theTimer.textContent =
        `${pad(timer[0])}:${pad(timer[1])}:${pad(timer[2])}`;

    timer[2]++;

    if (timer[2] === 100) {
        timer[2] = 0;
        timer[1]++;
    }

    if (timer[1] === 60) {
        timer[1] = 0;
        timer[0]++;
    }
}

function pad(unit) {
    return unit < 10 ? "0" + unit : unit;
}

// Start the timer:
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    const textEntered = testArea.value;
    const origin = originText.textContent;

    //completed successfully
    if (textEntered === origin) {
        testWrapper.style.borderColor = "green";
        clearInterval(interval);
        timerRunning = false;
        testArea.disabled= true;

        const wpm = calculateWPM();
        saveScore(wpm, errors);
        loadScores();

    } 
    // correct so far
    else if (origin.startsWith(textEntered)) {
        testWrapper.style.borderColor = "blue";
    } 
    //typo exists
    else {
        testWrapper.style.borderColor = "red";
        errors++;
    }
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", startTimer);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset);






function calculateWPM() {
    const textEntered = testArea.value;
    const words = textEntered.length / 5;
    const minutes = (timer[0] * 60 + timer[1] + timer[2] / 100) / 60;

    return Math.round(words / minutes) || 0;
}

// Add leading zero to numbers 9 or below (purely for aesthetics):
function saveScore(wpm) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    if(wpm<10) {
        wpm= '0'+wpm
    }
    scores.push({wpm, errors});
    scores.sort((a, b) => b.wpm - a.wpm);
    scores = scores.slice(0, 3);

    localStorage.setItem("scores", JSON.stringify(scores));
}

function loadScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    const list = document.querySelector("#score-list");
    list.innerHTML = "";

    if (scores.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No scores yet";
        list.appendChild(li);
        return;
    }

    scores.forEach((score, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1} — ${score.wpm} WPM | ${score.errors} errors`;
        list.appendChild(li);
    });
}


reset();
loadScores();

////////////////////////////////////////////////////////////////////////////////

















