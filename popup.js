document.getElementById('scrapeButton').addEventListener('click', () => {
    const messageElement = document.getElementById('message');
    const statusElement = document.getElementById('status');
    
    messageElement.textContent = "CONGRATULATIONS";
    statusElement.textContent = "Querying active tab...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
            statusElement.textContent = "Active tab found. Executing script...";

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: scrapeMessages
            }, (results) => {
                if (chrome.runtime.lastError) {
                    statusElement.textContent = "Error executing script";
                    console.error('Error executing script:', chrome.runtime.lastError);
                    return;
                }

                if (results && results[0] && results[0].result) {
                    statusElement.textContent = "Scraping complete!";
                    messageElement.textContent = JSON.stringify(results[0].result, null, 2); // Display results
                } else {
                    statusElement.textContent = "No messages found or an error occurred!";
                    messageElement.textContent = "No messages found!";
                }
            });
        } else {
            statusElement.textContent = "No active tab found";
        }
    });
});


// Function to be executed in the content script context
function scrapeMessages() {
    const messageRows = document.querySelectorAll('div[role="row"]');

    const messages = Array.from(messageRows).map((row) => {
        // Retrieve sender name
        const sender = row.querySelector('span[aria-label][dir="auto"]')?.innerText || 'Unknown Sender';

        // Retrieve the message content
        const messageContent = row.querySelector('span[dir="ltr"]')?.innerText || 'No Message Content';
        
        // Retrieve the timestamp from the 'data-pre-plain-text' attribute
        const timestampElement = row.querySelector('[data-pre-plain-text]');
        const timestampText = timestampElement ? timestampElement.getAttribute('data-pre-plain-text') || 'No Timestamp' : 'No Timestamp';

        // Use regex to separate the timestamp (date and time) and the phone number
        const timestampMatch = timestampText.match(/\[(\d{1,2}:\d{2} [APM]{2}), (\d{1,2}\/\d{1,2}\/d{4})\]/);
        const phoneNumberMatch = timestampText.match(/\+?\(?(\d{1,3})\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}/);

        const time = timestampMatch ? timestampMatch[1] : 'No Time';
        const date = timestampMatch ? timestampMatch[2] : 'No Date';
        const phoneNumber = phoneNumberMatch ? phoneNumberMatch[0] : 'No Phone Number';

        // Determine the message type based on content
        let messageType = 'Unknown';
        if (messageContent.toUpperCase().includes('LEARN')) {
            messageType = 'learn';
        } else if (messageContent.toUpperCase().includes('LIFT')) {
            messageType = 'lift';
        }

        return { sender, messageContent, date, time, phoneNumber, messageType };
    });

    return messages;
}
