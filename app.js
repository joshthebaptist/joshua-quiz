// App State
const state = {
    playerName: '',
    currentQuestion: 1,
    totalQuestions: 5,
    score: 0,
    answers: {},
    usedGifIds: {
        correct: new Set(),
        wrong: new Set()
    }
};

// Question Configuration
const questions = {
    1: {
        correctAnswer: 'yes',
        points: 10,
        correctText: 'That\'s right! Joshua is amazing!',
        wrongText: 'Wrong! Joshua is definitely great!'
    },
    2: {
        correctAnswer: 'CDPC Puchong',
        points: 10,
        correctText: 'Correct! CDPC Puchong all the way!',
        wrongText: 'Nope! It\'s CDPC Puchong!'
    },
    3: {
        correctAnswer: 'yes',
        points: 50,
        correctText: 'Absolutely! Joshua is the best looking!',
        wrongText: 'Are you blind?! Joshua is gorgeous!'
    },
    4: {
        correctAnswer: 'yes',
        points: 10,
        correctText: 'Yes! Joshua will speak in tongues!',
        wrongText: 'Incorrect! Joshua definitely will!'
    },
    5: {
        correctAnswer: 'healer',
        points: 10,
        correctText: 'Right! Joshua is a healer!',
        wrongText: 'Wrong! Joshua is a healer!'
    }
};

// Giphy Search Terms
const giphyTerms = {
    correct: [
        'thumbs up happy',
        'celebration excited',
        'yes approval',
        'happy dance',
        'proud excited',
        'you did it happy',
        'cheering celebration',
        'great job happy',
        'amazing excited',
        'clapping applause',
        'victory celebration',
        'happy smile',
        'excited yay',
        'well done happy',
        'success celebration'
    ],
    wrong: [
        'angry mad',
        'disappointed sigh',
        'funny angry',
        'shocked no',
        'mad funny',
        'are you serious',
        'wrong answer',
        'no no no',
        'facepalm disappointed',
        'comically angry',
        'cartoon angry',
        'mad cartoon',
        'funny rage',
        'annoyed mad',
        'disgusted no'
    ]
};

// DOM Elements
const screens = document.querySelectorAll('.screen');
const playerNameInput = document.getElementById('playerName');
const startBtn = document.getElementById('startBtn');
const responseGif = document.getElementById('responseGif');
const responseText = document.getElementById('responseText');
const pointsEarned = document.getElementById('pointsEarned');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const leaderboardBody = document.getElementById('leaderboardBody');
const playAgainBtn = document.getElementById('playAgainBtn');

// Giphy API Configuration
const GIPHY_API_KEY = 'dc6zaTOxFJmzN';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs/search';

// Screen Navigation
function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Get Random Giphy Term
function getRandomTerm(category) {
    const terms = giphyTerms[category];
    return terms[Math.floor(Math.random() * terms.length)];
}

// Fetch GIF from Giphy
async function fetchGif(category) {
    const searchTerm = getRandomTerm(category);
    const offset = Math.floor(Math.random() * 50);
    
    const url = `${GIPHY_BASE_URL}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=50&offset=${offset}&rating=g&lang=en`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const gifs = data.data.filter(gif => {
                const id = gif.id;
                const usedSet = state.usedGifIds[category];
                return !usedSet.has(id);
            });
            
            if (gifs.length > 0) {
                const selectedGif = gifs[Math.floor(Math.random() * gifs.length)];
                state.usedGifIds[category].add(selectedGif.id);
                
                if (state.usedGifIds[category].size > 40) {
                    state.usedGifIds[category].clear();
                }
                
                return selectedGif.images.fixed_height.url;
            }
            
            const randomGif = data.data[Math.floor(Math.random() * data.data.length)];
            state.usedGifIds[category].add(randomGif.id);
            return randomGif.images.fixed_height.url;
        }
        
        return category === 'correct' 
            ? 'https://media.giphy.com/media/111ebonMo90ZLC/giphy.gif'
            : 'https://media.giphy.com/media/lptjPvjmy8f63f64dR/giphy.gif';
    } catch (error) {
        console.error('Error fetching GIF:', error);
        return category === 'correct'
            ? 'https://media.giphy.com/media/111ebonMo90ZLC/giphy.gif'
            : 'https://media.giphy.com/media/lptjPvjmy8f63f64dR/giphy.gif';
    }
}

// Handle Answer
async function handleAnswer(questionNum, answer) {
    const question = questions[questionNum];
    const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
    
    const category = isCorrect ? 'correct' : 'wrong';
    const gifUrl = await fetchGif(category);
    
    if (isCorrect) {
        state.score += question.points;
    }
    
    state.answers[questionNum] = {
        question: questionNum,
        answer: answer,
        correct: isCorrect,
        points: isCorrect ? question.points : 0
    };
    
    responseGif.src = gifUrl;
    responseText.textContent = isCorrect ? question.correctText : question.wrongText;
    pointsEarned.textContent = isCorrect 
        ? `+${question.points} points!` 
        : '0 points';
    
    if (questionNum < state.totalQuestions) {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
    } else {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    }
    
    showScreen('gif-response');
}

// Save Score to JSONBin
async function saveScore() {
    if (isJsonBinConfigured()) {
        try {
            await saveToJSONBin();
            return;
        } catch (error) {
            console.error('Error saving to JSONBin:', error);
        }
    }
    saveToLocalLeaderboard();
}

async function saveToJSONBin() {
    const entry = {
        name: state.playerName,
        score: state.score,
        answers: state.answers,
        timestamp: new Date().toISOString()
    };
    
    // Read existing data
    const readResponse = await fetch(READ_URL(), {
        headers: getHeaders()
    });
    const readData = await readResponse.json();
    
    const scores = readData.record?.scores || [];
    scores.push(entry);
    
    // Write updated data
    await fetch(WRITE_URL(), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ scores: scores })
    });
}

// Save to Local Storage (fallback)
function saveToLocalLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('joshuaLeaderboard') || '[]');
    leaderboard.push({
        name: state.playerName,
        score: state.score,
        answers: state.answers,
        timestamp: Date.now()
    });
    localStorage.setItem('joshuaLeaderboard', JSON.stringify(leaderboard));
}

// Load Leaderboard
async function loadLeaderboard() {
    if (isJsonBinConfigured()) {
        try {
            const response = await fetch(READ_URL(), {
                headers: getHeaders()
            });
            const data = await response.json();
            
            const scores = data.record?.scores || [];
            return scores;
        } catch (error) {
            console.error('Error loading from JSONBin:', error);
        }
    }
    
    return JSON.parse(localStorage.getItem('joshuaLeaderboard') || '[]');
}

// Render Leaderboard
async function renderLeaderboard() {
    showScreen('loading');
    
    await saveScore();
    
    const scores = await loadLeaderboard();
    scores.sort((a, b) => b.score - a.score);
    
    leaderboardBody.innerHTML = '';
    
    if (scores.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="3">No scores yet! Be the first!</td></tr>';
    } else {
        scores.forEach((entry, index) => {
            const rank = index + 1;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank-${rank}">${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</td>
                <td>${escapeHtml(entry.name)}</td>
                <td>${entry.score}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }
    
    showScreen('leaderboard');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Reset Game
function resetGame() {
    state.playerName = '';
    state.currentQuestion = 1;
    state.score = 0;
    state.answers = {};
    playerNameInput.value = '';
    nextBtn.classList.remove('hidden');
    finishBtn.classList.add('hidden');
    showScreen('welcome');
}

// Event Listeners
startBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        state.playerName = name;
        state.currentQuestion = 1;
        showScreen('question-1');
    } else {
        playerNameInput.style.boxShadow = '0 0 0 3px rgba(255, 100, 100, 0.5)';
        setTimeout(() => {
            playerNameInput.style.boxShadow = '';
        }, 1000);
    }
});

playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startBtn.click();
    }
});

document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', function() {
        const questionScreen = this.closest('.question-screen');
        const questionNum = parseInt(questionScreen.dataset.question);
        const answer = this.dataset.value;
        
        questionScreen.querySelectorAll('.option').forEach(b => b.classList.add('disabled'));
        
        handleAnswer(questionNum, answer);
    });
});

nextBtn.addEventListener('click', () => {
    state.currentQuestion++;
    showScreen(`question-${state.currentQuestion}`);
});

finishBtn.addEventListener('click', () => {
    renderLeaderboard();
});

playAgainBtn.addEventListener('click', () => {
    resetGame();
});
