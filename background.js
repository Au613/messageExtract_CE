// Listen for the message from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXTRACTED_JSON') {
        console.log('Received JSON from content script:', message.data);

        // Send the JSON data to the popup script
        chrome.runtime.sendMessage({ type: 'SEND_JSON_TO_POPUP', data: message.data });
    }
});
