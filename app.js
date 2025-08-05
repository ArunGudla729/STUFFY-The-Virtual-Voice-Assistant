const btn = document.querySelector('.talk');
const stopBtn = document.getElementById('stopBtn');
const startBtn = document.getElementById('startBtn');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing STUFFY...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;

let isListening = false;

recognition.onstart = () => {
    console.log("Voice recognition started.");
    isListening = true;
};

recognition.onend = () => {
    console.log("Recognition stopped.");
    isListening = false;
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speak("Recognition error: " + event.error);
    content.textContent = "Recognition error: " + event.error;
};
recognition.onresult = (event) => {
    let transcript = '';
    let isFinal = false;

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            isFinal = true;
        }
    }

    transcript = transcript.trim();

    if (!transcript || !isFinal) return;

    recognition.stop(); // Stop to avoid looping
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};
btn.addEventListener('click', () => {
    if (!isListening) {
        content.textContent = "Listening...";
        recognition.start();
    }
});

stopBtn.addEventListener('click', () => {
    recognition.stop();
    speak("Voice assistant stopped.");
});

startBtn.addEventListener('click', () => {
    if (!isListening) {
        recognition.start();
        speak("Voice assistant resumed.");
    }
});
function takeCommand(message) {
    if (message.includes("stop listening")) {
        speak("OK, I will stop listening.");
        recognition.stop();
        return;
    }

    if (message.includes("start listening")) {
        speak("Resuming listening.");
        recognition.start();
        return;
    }

    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        const searchQuery = message.split(" ").join("+");
        window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        const topic = message.replace("wikipedia", "").trim().split(" ").join("_");
        window.open(`https://en.wikipedia.org/wiki/${topic}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + topic);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak("Today's date is " + date);
    } else if (message.includes('calculator')) {
        window.open('https://www.google.com/search?q=calculator', '_blank');
        speak("Opening Calculator");
    } else if (message.includes("joke")) {
        speak("Why don’t scientists trust atoms? Because they make up everything!");
    } else if (message.includes("define")) {
        speak("Please be more specific. I can search it for you if you say: define followed by the term.");
    } else {
        speak("Sorry, I couldn't understand that clearly.");
    }
    setTimeout(() => {
        if (!isListening) {
            recognition.start();
        }
    }, 3000);
}





