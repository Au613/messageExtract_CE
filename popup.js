// Function to format a date in the format "Day, MM/DD"
function formatDate(date) {
    const options = { weekday: "long", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  }
  
  // Function to get the start of the week (Monday)
  function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust if it's Sunday (0)
    const startOfWeek = new Date(date.setDate(diff));
    return startOfWeek;
  }
  
  // Function to get the end of the week (Sunday)
  function getEndOfWeek(startOfWeek) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    return endOfWeek;
  }
  
  // Get today's date and the start/end of the week
  const today = new Date();
  const startOfWeek = getStartOfWeek(new Date(today));
  const endOfWeek = getEndOfWeek(startOfWeek);
  
  // Format today's date and the week range
  const todayFormatted = formatDate(today);
  const weekRange = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  
  // Update the DOM with today's date and the week range
  document.getElementById("todayDate").textContent = `(${todayFormatted})`;
  document.getElementById("weekRange").textContent = `(${weekRange})`;
  
  // Handle button clicks
  document.getElementById("beginningOfWeek").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "beginningOfWeek" });
  });
  
  document.getElementById("today").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "today" });
  });
  
  // Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === 'copyToClipboard') {
      const text = message.text;
      copyToClipboard(text);
    }
  });
  
  // Function to copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
      console.log('Text successfully copied to clipboard');
    }).catch(function(error) {
      console.error('Error copying text: ', error);
    });
  }
  