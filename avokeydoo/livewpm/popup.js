document.addEventListener("DOMContentLoaded", () => {
    const wpmDisplay = document.getElementById("wpm-display");

    // Function to update WPM in the popup
    const updateWPM = () => {
        chrome.storage.local.get(["wpm"], (result) => {
            const wpm = result.wpm || 0; // Default to 0 if no WPM is stored
            wpmDisplay.textContent = `Current WPM: ${wpm}`;
        });
    };

    // Update WPM immediately on popup open
    updateWPM();

    // Set an interval to update WPM every second
    setInterval(updateWPM, 1000);
});
