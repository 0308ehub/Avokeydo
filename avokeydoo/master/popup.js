document.addEventListener("DOMContentLoaded", () => {
    const wpmDisplay = document.getElementById("wpm-display");

    // Update WPM in the popup
    const updateWPM = () => {
        chrome.storage.local.get(["wpm"], (result) => {
            const wpm = result.wpm || 0;
            wpmDisplay.textContent = `Current WPM: ${wpm}`;
        });
    };
    updateWPM();
    setInterval(updateWPM, 1000);

    // Download keystrokes
    document.getElementById("download").addEventListener("click", () => {
        chrome.storage.local.get(["keystrokes"], (result) => {
            const keystrokes = result.keystrokes || "";
            const blob = new Blob([keystrokes], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "keystrokes.txt";
            a.click();
            URL.revokeObjectURL(url);
        });
    });
});
