const apiKey = "AIzaSyCEJG7V3S3W61Vn5xvj01IyjYjF3ZOsIvE";
const spreadsheetId = "1Fq0IifoSIMvD9vXBjGVD3yxxz5E9J5OjO1OLeSbQH2M";
const range = "Sheet1!M1"; // Replace "Sheet1" with the actual sheet name
const valueInputOption = "RAW"; // RAW or USER_ENTERED

export default async function updateSpreadsheet(inputValue) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=${valueInputOption}&key=${apiKey}`;
  
  const body = {
    range: range,
    majorDimension: "ROWS",
    values: [[inputValue]],
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Cell updated successfully:", data);
    } else {
      console.error("Error updating cell:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Example usage:
updateSpreadsheet("Hello from Chrome Extension!");
