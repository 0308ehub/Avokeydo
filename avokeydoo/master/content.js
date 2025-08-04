console.log("Live WPM and Keystroke Tracker is active");

// Variables for WPM tracking
let startTime = null;
let wordCount = 0;

// Function to calculate WPM
const calculateWPM = () => {
    if (!startTime || wordCount === 0) return 0;
    const currentTime = new Date();
    const elapsedMinutes = (currentTime - startTime) / 60000;
    return Math.round(wordCount / elapsedMinutes);
};

// Listen for keypress events
document.addEventListener("keydown", (event) => {
    // Start WPM timer if not started
    if (!startTime) {
        startTime = new Date();
        console.log("WPM timer started");
    }

    // Count words based on spaces or newline for WPM
    if (event.key === " " || event.key === "\n") {
        wordCount++;
    }

    // Calculate and save WPM
    const wpm = calculateWPM();
    chrome.storage.local.set({ wpm });

    // Log keystrokes
    const keyPressed = `${new Date().toISOString()} - Key pressed: ${event.key}\n`;
    chrome.storage.local.get(["keystrokes"], (result) => {
        const keystrokes = result.keystrokes || "";
        const updatedKeystrokes = keystrokes + keyPressed;
        chrome.storage.local.set({ keystrokes: updatedKeystrokes });
    });
});

// Reset WPM after inactivity
let typingTimeout;
document.addEventListener("keydown", () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        startTime = null;
        wordCount = 0;
        chrome.storage.local.set({ wpm: 0 });
    }, 5000);
});

// Inject the overlay for live WPM
if (!document.getElementById("wpm-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "wpm-overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "10px";
    overlay.style.right = "10px";
    overlay.style.width = "200px";
    overlay.style.height = "100px";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.color = "white";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.fontSize = "14px";
    overlay.style.padding = "10px";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = "9999";
    overlay.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    overlay.innerHTML = `
        <div>
            <strong>Live WPM Tracker</strong>
            <p id="wpm-display">Current WPM: 0</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Update WPM display
const updateWPM = () => {
    chrome.storage.local.get(["wpm"], (result) => {
        const wpm = result.wpm || 0;
        const wpmDisplay = document.getElementById("wpm-display");
        if (wpmDisplay) {
            wpmDisplay.textContent = `Current WPM: ${wpm}`;
        }
    });
};
setInterval(updateWPM, 100);

// Add styles for overlay
const style = document.createElement("style");
style.textContent = `
    #wpm-overlay {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 200px;
        height: 100px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 10px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    #wpm-overlay strong {
        font-size: 16px;
        margin-bottom: 10px;
        display: block;
    }
`;
document.head.appendChild(style);
