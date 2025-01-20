//this file has access to the popup

// Function to format a date in the format "Day, MM/DD"
function formatDate(date) {
	const options = {weekday: "long", month: "2-digit", day: "2-digit"}
	return date.toLocaleDateString("en-US", options)
}

// Function to get the start of the week (Monday)
function getStartOfWeek(date) {
	const day = date.getDay()
	const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust if it's Sunday (0)
	const startOfWeek = new Date(date.setDate(diff))
	return startOfWeek
}

// Function to get the end of the week (Sunday)
function getEndOfWeek(startOfWeek) {
	const endOfWeek = new Date(startOfWeek)
	endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
	return endOfWeek
}

// Get today's date and the start/end of the week
const today = new Date()
const startOfWeek = getStartOfWeek(new Date(today))
const endOfWeek = getEndOfWeek(startOfWeek)

// Format today's date and the week range
const todayFormatted = formatDate(today)
const weekRange = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`

// Update the DOM with today's date and the week range
document.getElementById("todayDate").textContent = `(${todayFormatted})`
document.getElementById("weekRange").textContent = `(${weekRange})`

document.getElementById("today").addEventListener("click", () => {
	const leaderboardContainer = document.getElementById("leaderboard")
	leaderboardContainer.innerHTML = "" // Clear any previous content
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		// Dynamically inject content script
		chrome.scripting.executeScript(
			{
				target: {tabId: tabs[0].id},
				files: ["content.js"],
			},
			() => {
				// Now send the message after content.js is injected
				chrome.tabs.sendMessage(tabs[0].id, {type: "scroll"}, (response) => {
					if (chrome.runtime.lastError) {
						console.error("Error sending message:", chrome.runtime.lastError)
					} else {
						console.log(response.status)
					}
				})
			}
		)
	})
})

document.getElementById("week").addEventListener("click", () => {
	const leaderboardContainer = document.getElementById("leaderboard")
	leaderboardContainer.innerHTML = "" // Clear any previous content
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		// Dynamically inject content script
		chrome.scripting.executeScript(
			{
				target: {tabId: tabs[0].id},
				files: ["content.js"],
			},
			() => {
				// Now send the message after content.js is injected
				chrome.tabs.sendMessage(tabs[0].id, {type: "scrollWeek"}, (response) => {
					if (chrome.runtime.lastError) {
						console.error("Error sending message:", chrome.runtime.lastError)
					} else {
						console.log(response.status)
					}
				})
			}
		)
	})
})

// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "SEND_JSON_TO_POPUP") {
		// console.log('Received JSON in popup:', message.data);

		// Update the UI (e.g., display the leaderboard)
		displayLeaderboard(message.data)
	}
})

function sortAndFilterLeaderboard(data) {
	// Filter out items where the 'count' property is falsy
	const filteredData = data.filter((item) => item.count && item.count !== "")

	// Sort the filtered data by the 'sender' property
	filteredData.sort((a, b) => {
		const senderA = a.sender.toLowerCase() // Case insensitive sorting
		const senderB = b.sender.toLowerCase()
		if (senderA < senderB) {
			return -1 // a comes before b
		}
		if (senderA > senderB) {
			return 1 // b comes before a
		}
		return 0 // equal
	})

	return filteredData
}

function sumCount(count) {
	let summ = 0
	let error = false
	try {
		summ = count.split("-").reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0)
	} catch (e) {
		error = true
	}
	if (error) console.log(count, "AUSTIN AUSTIN AUSTIN")
	return summ
}

function countDate(data) {
	// Object to track the highest count per sender
	const senderMaxCount = {}

	// Loop through the data to find the highest count for each sender
	data.forEach((entry) => {
		const countValue = sumCount(entry.count)

		if (!senderMaxCount[entry.sender] || countValue > sumCount(senderMaxCount[entry.sender].count)) {
			senderMaxCount[entry.sender] = entry
		}
	})

	return Object.values(senderMaxCount)
}

// Example function to display the leaderboard in the popup
function displayLeaderboard(data) {
	const leaderboardContainer = document.getElementById("leaderboard")
	leaderboardContainer.innerHTML = "" // Clear any previous content

	// Set the container to left-align
	leaderboardContainer.style.textAlign = "left"
	console.log(data, "DATA DATA DATA")
	const sortedData = sortAndFilterLeaderboard(data)
	const highestCountData = countDate(sortedData)

	if (highestCountData && highestCountData.length > 0) {
		// Create the table and the header
		const table = document.createElement("table")
		table.classList.add("leaderboard-table")

		// Create the table header
		const headerRow = document.createElement("tr")
		const senderHeader = document.createElement("th")
		senderHeader.innerText = "Sender"
		const countHeader = document.createElement("th")
		countHeader.innerText = "Count"
		const dateHeader = document.createElement("th")
		dateHeader.innerText = "Date"

		headerRow.appendChild(senderHeader)
		headerRow.appendChild(countHeader)
		headerRow.appendChild(dateHeader)
		table.appendChild(headerRow)
		// Create a row for each item in the highestCountData
		highestCountData.forEach((item) => {
			const row = document.createElement("tr")

			const senderCell = document.createElement("td")
			senderCell.innerText = item.sender

			const countCell = document.createElement("td")
			countCell.innerText = item.count

			const dateCell = document.createElement("td")
			dateCell.innerText = item.date

			row.appendChild(senderCell)
			row.appendChild(countCell)
			row.appendChild(dateCell)

			table.appendChild(row)
		})

		// Append the table to the leaderboard container
		leaderboardContainer.appendChild(table)
	} else {
		const message = document.createElement("p")
		message.innerText = "No leaderboard data available."
		leaderboardContainer.appendChild(message)
	}
}

// Add event listener to the "Copy" button
document.getElementById("Copy").addEventListener("click", () => {
	// Ensure the leaderboard is displayed before attempting to copy
	const leaderboardContainer = document.getElementById("leaderboard")
	if (leaderboardContainer && leaderboardContainer.innerText.trim() !== "") {
		copyLeaderboardToClipboard() // Call the copy function directly
	} else {
		console.log("Leaderboard content is empty or not loaded.")
	}
})

// Function to copy the leaderboard content to the clipboard
function copyLeaderboardToClipboard() {
	const leaderboardContainer = document.getElementById("leaderboard")
	const leaderboardText = leaderboardContainer.innerText

	navigator.clipboard
		.writeText(leaderboardText)
		.then(() => {
			console.log("Leaderboard successfully copied to clipboard")
		})
		.catch((error) => {
			console.error("Error copying text: ", error)
		})
}
