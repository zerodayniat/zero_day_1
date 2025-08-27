// DOM Elements
const input = document.getElementById('input');
const micBtn = document.getElementById('mic-btn');
const sendBtn = document.getElementById('send-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const output = document.getElementById('output');
const conversationHistory = document.getElementById('conversation-history');
const langSelect = document.getElementById('lang-select');
const voiceSelect = document.getElementById('voice-select');
const speedSlider = document.getElementById('speed-slider');
const pitchSlider = document.getElementById('pitch-slider');
const speedValue = document.getElementById('speed-value');
const pitchValue = document.getElementById('pitch-value');

// Global variables
let currentUtterance = null;
let isListening = false;
let conversationData = [];

const languages = [
    { name: 'English (US)', code: 'en-US' },
    { name: 'English (UK)', code: 'en-GB' },
    { name: 'Tamil', code: 'ta-IN' },
    { name: 'Hindi', code: 'hi-IN' },
    { name: 'Spanish', code: 'es-ES' },
    { name: 'French', code: 'fr-FR' },
    { name: 'German', code: 'de-DE' },
    { name: 'Chinese (Mandarin)', code: 'zh-CN' },
    { name: 'Arabic', code: 'ar-SA' },
    { name: 'Russian', code: 'ru-RU' },
    { name: 'Portuguese', code: 'pt-BR' },
    { name: 'Japanese', code: 'ja-JP' },
    { name: 'Korean', code: 'ko-KR' },
    { name: 'Italian', code: 'it-IT' },
    { name: 'Dutch', code: 'nl-NL' },
    { name: 'Swedish', code: 'sv-SE' },
    { name: 'Turkish', code: 'tr-TR' },
    { name: 'Polish', code: 'pl-PL' },
    { name: 'Indonesian', code: 'id-ID' },
    { name: 'Vietnamese', code: 'vi-VN' }
];

// Populate language select
languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.name;
    langSelect.appendChild(option);
});
langSelect.value = 'en-US';

// Speech Recognition Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = langSelect.value;
recognition.interimResults = false;

// Initialize voices
function loadVoices() {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '<option value="">Select a voice...</option>';
    
    voices.forEach((voice, index) => {
        if (voice.lang.startsWith('en')) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        }
    });
    
    // Auto-select a female voice if available
    const femaleVoiceIndex = voices.findIndex(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('zira') ||
         voice.name.toLowerCase().includes('hazel') ||
         voice.name.toLowerCase().includes('samantha'))
    );
    
    if (femaleVoiceIndex !== -1) {
        voiceSelect.value = femaleVoiceIndex;
    }
}

// Initialize voices (show all languages)
function loadVoices() {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '<option value="">Select a voice...</option>';
    
    // Group by language
    const groupedVoices = {};
    voices.forEach((voice, index) => {
        if (!groupedVoices[voice.lang]) {
            groupedVoices[voice.lang] = [];
        }
        groupedVoices[voice.lang].push({ name: voice.name, index });
    });
    
    // Sort languages and add to select
    Object.keys(groupedVoices).sort().forEach(lang => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = lang;
        
        groupedVoices[lang].forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.index;
            option.textContent = voice.name;
            optgroup.appendChild(option);
        });
        
        voiceSelect.appendChild(optgroup);
    });
    
    // Auto-select a default voice
    const defaultVoice = voices.find(voice => voice.default) || voices[0];
    if (defaultVoice) {
        voiceSelect.value = voices.indexOf(defaultVoice);
    }
}

// Load voices when available
speechSynthesis.addEventListener('voiceschanged', loadVoices);
loadVoices();

// Language change handler
langSelect.addEventListener('change', (e) => {
    recognition.lang = e.target.value;
    
    // Suggest matching voice
    const voices = speechSynthesis.getVoices();
    const matchingVoice = voices.find(voice => voice.lang === e.target.value);
    if (matchingVoice) {
        voiceSelect.value = voices.indexOf(matchingVoice);
    }
});

// Event Listeners
micBtn.addEventListener('click', toggleListening);
sendBtn.addEventListener('click', () => {
    const message = input.value.trim();
    if (message) {
        sendMessage(message);
        input.value = '';
    }
});

stopBtn.addEventListener('click', stopSpeech);
clearBtn.addEventListener('click', clearConversation);

speedSlider.addEventListener('input', (e) => {
    speedValue.textContent = e.target.value + 'x';
});

pitchSlider.addEventListener('input', (e) => {
    pitchValue.textContent = e.target.value + 'x';
});

// Allow Enter to send message (Shift+Enter for new line)
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = input.value.trim();
        if (message) {
            sendMessage(message);
            input.value = '';
        }
    }
});

// Speech Recognition Events
recognition.onstart = () => {
    isListening = true;
    micBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    micBtn.style.animation = 'pulse 1s infinite';
};

recognition.onend = () => {
    isListening = false;
    micBtn.style.background = 'linear-gradient(45deg, #64ffda, #00bcd4)';
    micBtn.style.animation = '';
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    sendMessage(transcript);
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    micBtn.style.background = 'linear-gradient(45deg, #64ffda, #00bcd4)';
    micBtn.style.animation = '';
};

function toggleListening() {
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function addMessageToHistory(message, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    
    messageDiv.innerHTML = `
        <div class="message-label">${isUser ? 'You' : 'AI Assistant'}</div>
        <div class="message-content">${message}</div>
    `;
    
    conversationHistory.appendChild(messageDiv);
    conversationData.push({ message, isUser, timestamp: new Date() });
    
    // Scroll to bottom
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
}

async function sendMessage(message) {
    // Add user message to history
    addMessageToHistory(message, true);
    
    // Show thinking status
    output.textContent = 'Thinking...';
    output.style.opacity = '1';
    
    try {
        // Use environment variable or fallback to localhost for development
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:8787/api/chat'
            : '/api/chat';
            
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(`Server error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const aiResponse = data.choices[0].message.content;
            
            // Add AI response to history
            addMessageToHistory(aiResponse, false);
            
            // Show current response
            output.textContent = aiResponse;
            output.style.opacity = '1';
            
            // Speak the response
            speak(aiResponse);
        } else {
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = `Error: ${error.message}. Please make sure the server is running.`;
        output.textContent = errorMessage;
        addMessageToHistory(errorMessage, false);
    }
}

function speak(text) {
    // Stop any current speech
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Apply user settings
    const voices = speechSynthesis.getVoices();
    const selectedVoiceIndex = voiceSelect.value;
    
    if (selectedVoiceIndex && voices[selectedVoiceIndex]) {
        currentUtterance.voice = voices[selectedVoiceIndex];
    }
    
    currentUtterance.rate = parseFloat(speedSlider.value);
    currentUtterance.pitch = parseFloat(pitchSlider.value);
    currentUtterance.volume = 0.9;
    
    // Enable stop button during speech
    currentUtterance.onstart = () => {
        stopBtn.disabled = false;
    };
    
    currentUtterance.onend = () => {
        stopBtn.disabled = true;
        currentUtterance = null;
    };
    
    currentUtterance.onerror = () => {
        stopBtn.disabled = true;
        currentUtterance = null;
    };
    
    speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
    if (currentUtterance) {
        speechSynthesis.cancel();
        currentUtterance = null;
        stopBtn.disabled = true;
    }
}

function clearConversation() {
    conversationHistory.innerHTML = '';
    output.textContent = '';
    output.style.opacity = '0';
    conversationData = [];
    
    // Stop any ongoing speech
    stopSpeech();
}
