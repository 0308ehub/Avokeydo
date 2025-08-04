document.addEventListener("DOMContentLoaded", () => {
    const totalKeysElement = document.getElementById("total-keys");
    const favoriteKeyElement = document.getElementById("favorite-key");
    const avgMessageElement = document.getElementById("avg-message");
    const avgSentenceElement = document.getElementById("avg-sentence");
    const totalWordsElement = document.getElementById("total-words");
    const avgWordsElement = document.getElementById("avg-words");
    const capsLockElement = document.getElementById("caps-lock");
    const spaceKeyElement = document.getElementById("space-key");

    const calculateStats = (keystrokes) => {
        const keys = [];
        const messages = [];
        const sentences = [];
        let currentMessage = "";
        let currentSentence = "";

        keystrokes.split("\n").forEach((entry) => {
            const match = entry.match(/Key pressed: (.+)/);
            if (!match) return;
            const key = match[1];
            keys.push(key);

            // Track messages (before Enter key)
            if (key === "Enter") {
                if (currentMessage) {
                    messages.push(currentMessage.trim());
                    currentMessage = "";
                }
            } else {
                currentMessage += key;

                // Track sentences (before period)
                if (key === ".") {
                    if (currentSentence) {
                        sentences.push(currentSentence.trim());
                        currentSentence = "";
                    }
                } else {
                    currentSentence += key;
                }
            }
        });

        // Add any unfinished messages or sentences
        if (currentMessage) messages.push(currentMessage.trim());
        if (currentSentence) sentences.push(currentSentence.trim());

        const totalKeys = keys.length;
        const keyCounts = keys.reduce((acc, key) => {
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const favoriteKey = Object.entries(keyCounts).sort((a, b) => b[1] - a[1])[0] || ["None", 0];
        const avgMessageLength = messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length || 0;
        const avgSentenceLength = sentences.reduce((sum, sent) => sum + sent.length, 0) / sentences.length || 0;
        const totalWords = messages.reduce((sum, msg) => sum + msg.split(/\s+/).length, 0);
        const avgWordsPerMessage = totalWords / messages.length || 0;

        return {
            totalKeys,
            favoriteKey,
            avgMessageLength,
            avgSentenceLength,
            totalWords,
            avgWordsPerMessage,
            capsLockUsage: keyCounts["CapsLock"] || 0,
            spaceUsage: keyCounts[" "] || 0,
        };
    };

    const updateStatsDisplay = (stats) => {
        totalKeysElement.textContent = stats.totalKeys;
        favoriteKeyElement.textContent = `'${stats.favoriteKey[0]}' (pressed ${stats.favoriteKey[1]} times)`;
        avgMessageElement.textContent = stats.avgMessageLength.toFixed(2);
        avgSentenceElement.textContent = stats.avgSentenceLength.toFixed(2);
        totalWordsElement.textContent = stats.totalWords;
        avgWordsElement.textContent = stats.avgWordsPerMessage.toFixed(2);
        capsLockElement.textContent = stats.capsLockUsage;
        spaceKeyElement.textContent = stats.spaceUsage;
    };

    // Fetch keystrokes from storage and update stats
    chrome.storage.local.get("keystrokes", (result) => {
        const keystrokes = result.keystrokes || "";
        const stats = calculateStats(keystrokes);
        updateStatsDisplay(stats);
    });
});
