const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const themeSwitch = document.getElementById('theme-switch');
let isDarkMode = false;

// Toggle dark mode
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    themeSwitch.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
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

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = text;
    messagesContainer.appendChild(messageDiv);

    // GSAP animation for messages
    gsap.fromTo(messageDiv, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleUserMessage(message) {
    if (message.toLowerCase().includes("time")) {
        fetchTime();
    } else {
        sendMessageToBot(message);
    }
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
