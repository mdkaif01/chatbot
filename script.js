const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const themeSwitch = document.getElementById('theme-switch');
const helpButton = document.getElementById('help-button');
const helpOverlay = document.getElementById('help-overlay');
const closeHelpButton = document.getElementById('close-help');
let isDarkMode = false;
let userName = '';

// Welcome message with personalized greeting
window.onload = () => {
    const hours = new Date().getHours();
    let greeting = "Hello";

    if (hours >= 0 && hours < 12) {
        greeting = "Good Morning";
    } else if (hours >= 12 && hours < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    setTimeout(() => {
        addMessage(`${greeting}! What's your name?`, "bot", true);
    }, 500);
};

// Toggle dark mode
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    themeSwitch.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});

// Handle Help button click
helpButton.addEventListener('click', () => {
    helpOverlay.style.display = 'flex';
    gsap.fromTo(helpOverlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
});

// Handle closing of Help overlay
closeHelpButton.addEventListener('click', () => {
    gsap.to(helpOverlay, { opacity: 0, duration: 0.5, onComplete: () => {
        helpOverlay.style.display = 'none';
    }});
});

sendButton.addEventListener('click', function() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        userInput.value = '';
        handleUserMessage(message);
    }
});

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

function addMessage(text, sender, animate = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = text;
    messagesContainer.appendChild(messageDiv);

    // GSAP animation for messages
    gsap.fromTo(messageDiv, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: animate ? 1.2 : 0.8 });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleUserMessage(message) {
    if (!userName) {
        userName = message;
        addMessage(`Nice to meet you, ${userName}! How can I help you today?`, 'bot');
        return;
    }

    showTypingIndicator();
    setTimeout(() => {
        if (message.toLowerCase().includes("time")) {
            fetchTime();
        } else {
            sendMessageToBot(message);
        }
        hideTypingIndicator();
    }, 1000); // Simulate bot delay
}

function fetchTime() {
    fetch('http://worldtimeapi.org/api/timezone/Etc/UTC')
        .then(response => response.json())
        .then(data => {
            const currentTime = new Date(data.datetime).toLocaleTimeString();
            addMessage(`The current time is ${currentTime} IST`, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage("Sorry, I can't retrieve the time right now.", 'bot');
        });
}

function sendMessageToBot(message) {
    fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            data.forEach(response => addMessage(response.text, 'bot'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage("Sorry, I can't connect to the server right now.", 'bot');
    });
}

function showTypingIndicator() {
    typingIndicator.style.display = 'block';
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Handle quick replies
function handleQuickReply(message) {
    addMessage(message, 'user');
    handleUserMessage(message);
}