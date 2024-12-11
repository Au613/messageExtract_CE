// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Add an event listener to the button
    const button = document.getElementById('runScriptButton');
    button.addEventListener('click', () => {
      console.log("Button clicked! Running script...");
      // Place the script logic here
    });
  });
  