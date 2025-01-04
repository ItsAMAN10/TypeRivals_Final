const practiceText = document.getElementById('practice-text');
const textArea = document.getElementById('text-area');
const resultDiv = document.getElementById('result');
const easyTextButton = document.getElementById('easy-text');
const mediumTextButton = document.getElementById('medium-text');
const hardTextButton = document.getElementById('hard-text');
const timeDisplay = document.getElementById('time'); // Get the time display element
const restartButton = document.getElementById('restart-button');
const homeButton = document.getElementById('home-button');
const optionsDiv = document.getElementById('options'); // Get the options div

const texts = {
    easy: "The sun is shining brightly in the sky. Birds are flying high and chirping happily. The grass is green, and the flowers are blooming with beautiful colors. A little dog is running around in the park, chasing a red ball. Children are laughing and playing near the swings. It's a perfect day to be outside and enjoy nature.",
    medium: "On a calm Sunday morning, the family gathered around the breakfast table. The smell of freshly baked bread and sizzling bacon filled the air. Outside, the trees swayed gently in the breeze, and the golden rays of the sun filtered through the windows. The youngest member of the family, a curious boy, asked about the old photo hanging on the wall. Everyone smiled, reminiscing about cherished memories.",
    hard: "The library was a sanctuary of knowledge, filled with shelves that stretched endlessly toward the vaulted ceiling. Dust particles danced in the beams of sunlight streaming through the stained glass windows. A solitary figure sat at a desk, poring over an ancient tome, its pages yellowed with age. The air was thick with the scent of aged paper and polished wood. Silence reigned, broken only by the faint rustle of pages and the occasional distant creak of the floorboards, lending an almost ethereal quality to the space."
};

let startTime;
let endTime;
let timerInterval;
let elapsedTime = 0;

function displayPracticeText(text) {
    practiceText.innerHTML = text.split(" ").map(word => `<span>${word} </span>`).join("");
    textArea.value = "";
    textArea.focus();
    startTime = new Date();
    endTime = null;
    elapsedTime = 0;
    clearInterval(timerInterval); 
    timerInterval = setInterval(updateTimerDisplay, 1000); 
    textArea.disabled = false;
}

function updateTimerDisplay() {
    if (!startTime) return;
    const currentTime = new Date();
    elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timeDisplay.textContent = `Time: ${elapsedTime} seconds`;
}


easyTextButton.addEventListener('click', () => displayPracticeText(texts.easy));
mediumTextButton.addEventListener('click', () => displayPracticeText(texts.medium));
hardTextButton.addEventListener('click', () => displayPracticeText(texts.hard));

textArea.addEventListener('input', () => {
    if (!startTime) return;
    const typedText = textArea.value;
    const originalWords = practiceText.querySelectorAll('span');
    let correctCharacters = 0;
    let typedWords = typedText.split(/\s+/);

    for (let i = 0; i < originalWords.length; i++) {
        const originalWord = originalWords[i].textContent.trim();
        if (i < typedWords.length) {
            const typedWord = typedWords[i];
            let matchingChars = 0;
            for (let j = 0; j < Math.min(originalWord.length, typedWord.length); j++) {
                if (originalWord[j] === typedWord[j]) {
                    matchingChars++;
                }
            }
            if (matchingChars === originalWord.length && matchingChars === typedWord.length) {
                originalWords[i].classList.add('correct');
                originalWords[i].classList.remove('incorrect');
                correctCharacters += originalWord.length + 1; 
            } else if(matchingChars > 0){
                originalWords[i].classList.remove('correct');
                originalWords[i].classList.add('incorrect');
            }
            else{
                originalWords[i].classList.remove('correct');
                originalWords[i].classList.remove('incorrect');
            }
        } else {
            originalWords[i].classList.remove('correct');
            originalWords[i].classList.remove('incorrect');
        }
    }

    const originalTextLength = practiceText.textContent.trim().length;
    correctCharacters = Math.min(correctCharacters, originalTextLength);
    const accuracy = originalTextLength > 0 ? (correctCharacters / originalTextLength) * 100 : 0;

    if (typedText.trim().length === practiceText.textContent.trim().length) {
        endTime = new Date();
        const timeInSeconds = (endTime - startTime) / 1000;
        const words = typedText.trim().split(/\s+/).length;
        const wpm = timeInSeconds > 0 ? Math.round((words / 5) / (timeInSeconds / 60)) : 0;
        resultDiv.textContent = `Accuracy: ${accuracy.toFixed(2)}%, WPM: ${wpm}`;
        textArea.disabled = true;
        startTime = null;
        clearInterval(timerInterval); 
    }
    else{
        resultDiv.textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
    }
});

restartButton.addEventListener('click', () => {
    practiceText.textContent = "";
    textArea.value = "";
    textArea.disabled = true;
    resultDiv.textContent = "";
    clearInterval(timerInterval);
    timeDisplay.textContent = "Time: 0 seconds";
    startTime = null;
    optionsDiv.style.display = 'flex'; 
});


easyTextButton.addEventListener('click', () => {
    displayPracticeText(texts.easy);
    optionsDiv.style.display = 'none'; 
});

mediumTextButton.addEventListener('click', () => {
    displayPracticeText(texts.medium);
    optionsDiv.style.display = 'none'; 
});

hardTextButton.addEventListener('click', () => {
    displayPracticeText(texts.hard);
    optionsDiv.style.display = 'none'; 
});
