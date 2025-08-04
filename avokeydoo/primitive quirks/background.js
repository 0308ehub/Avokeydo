chrome.action.onClicked.addListener((tab) => {
    // Inject content.js into the active tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    }, () => {
        console.log("Injected content.js into the active tab");
    });
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("content.js"); // Replace with your script file
    script.type = "application/javascript";
    (document.head || document.documentElement).appendChild(script);
});
