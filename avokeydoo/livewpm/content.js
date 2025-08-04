console.log("Live WPM Tracker is active");

// Variables to track typing session
let startTime = null;
let wordCount = 0;

// Function to calculate WPM
const calculateWPM = () => {
    if (!startTime || wordCount === 0) return 0; // Avoid division by zero
    const currentTime = new Date();
    const elapsedMinutes = (currentTime - startTime) / 60000; // Convert milliseconds to minutes
    return Math.round(wordCount / elapsedMinutes);
};

// Listen for keypress events
document.addEventListener("keydown", (event) => {
    // Ignore keys that aren't text-producing (e.g., Shift, Ctrl)
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Start the timer only on the first keypress
        if (!startTime) {
            startTime = new Date();
            console.log("Typing session started");
        }

        // Count words based on spaces or newline
        if (event.key === " " || event.key === "\n") {
            wordCount++;
        }

        // Calculate WPM and store it
        const wpm = calculateWPM();
        console.log(`Current WPM: ${wpm}`);
        chrome.storage.local.set({ wpm });
    }
});

// Reset typing session after inactivity
let typingTimeout;
document.addEventListener("keydown", () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        console.log("Resetting typing session due to inactivity");
        startTime = null;
        wordCount = 0;
        chrome.storage.local.set({ wpm: 0 }); // Reset WPM in storage
    }, 5000); // 5 seconds of inactivity resets the session
});

// Inject the overlay panel only once
if (!document.getElementById("wpm-overlay")) {
    // Create the overlay
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
    // Append the overlay to the body
    document.body.appendChild(overlay);
}

// Update the WPM display in the overlay
const updateWPM = () => {
    chrome.storage.local.get(["wpm"], (result) => {
        const wpm = result.wpm || 0;
        const wpmDisplay = document.getElementById("wpm-display");
        if (wpmDisplay) {
            wpmDisplay.textContent = `Current WPM: ${wpm}`;
        }
    });
};

// Periodically update WPM
setInterval(updateWPM, 100);
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
