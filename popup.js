document.getElementById('scrapeButton').addEventListener('click', () => {
    // Send a message to content.js to execute the scraping
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: scrapeMessages
      });
    });
  });
  
  function scrapeMessages() {
    // Your scraping code here
    const messageRows = document.querySelectorAll('div[role="row"]');
  
    const messages = Array.from(messageRows).map((row) => {
      const sender = row.querySelector('span[aria-label][dir="auto"]')?.innerText || 'Unknown Sender';
      const messageContent = row.querySelector('span[dir="ltr"]')?.innerText || 'No Message Content';
      
      const timestampElement = row.querySelector('span[aria-label][role="link"], div[aria-label][role="button"]');
      const timestampText = timestampElement ? timestampElement.ariaLabel || 'No Timestamp' : 'No Timestamp';
      
      const phoneNumberMatch = timestampText.match(/\+?\(?(\d{1,3})\)?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})/);
      const phoneNumber = phoneNumberMatch ? phoneNumberMatch[0] : 'No Phone Number';
  
      // Split the timestamp into date and time
      const dateMatch = timestampText.match(/\[(.*?)\]/);
      const timeMatch = timestampText.match(/(\d{1,2}:\d{2} [APM]{2})/);
  
      let date = dateMatch ? dateMatch[1].split(',')[0] : 'No Date';
      let time = timeMatch ? timeMatch[0] : 'No Time';
  
      return { sender, messageContent, date, time, phoneNumber };
    });
  
    // Store the messages to inspect them
    console.log(messages);
  }
  