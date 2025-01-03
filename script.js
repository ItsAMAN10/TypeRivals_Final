const sampleTexts = {
    easy: "The quick brown fox jumps over the lazy dog.",
    medium: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    hard: "Sphinx of black quartz, judge my vow."
};

let timer;
let timeLeft;
let startTime;
let textToType;

function startTest() {
    const level = document.getElementById('level').value;
    const duration = document.getElementById('duration').value;
    textToType = sampleTexts[level];
    timeLeft = duration;
    document.getElementById('test-area').style.display = 'block';
    document.getElementById('typing-area').value = '';
    document.getElementById('typing-area').placeholder = textToType;
    document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;
    document.getElementById('result').innerText = '';
    startTime = new Date().getTime();
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timeLeft -= 1;
    document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        endTest();
    }
}

function endTest() {
    const typedText = document.getElementById('typing-area').value;
    const wordsTyped = typedText.split(' ').length;
    const wpm = (wordsTyped / (timeLeft / 60)).toFixed(2);
    document.getElementById('result').innerText = `You typed ${wordsTyped} words. Your speed is ${wpm} words per minute.`;
}