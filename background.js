chrome.runtime.onInstalled.addListener(() => {
	chrome.action.setBadgeText({
		text: "OFF",
	})
})

const extensions = "https://developer.chrome.com/docs/extensions"
const webstore = "https://developer.chrome.com/docs/webstore"
const whatsapp = "https://web.whatsapp.com/"

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
	if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
		// We retrieve the action badge to check if the extension is 'ON' or 'OFF'
		const prevState = await chrome.action.getBadgeText({tabId: tab.id})
		// Next state will always be the opposite
		const nextState = prevState === "ON" ? "OFF" : "ON"

		// Set the action badge to the next state
		await chrome.action.setBadgeText({
			tabId: tab.id,
			text: nextState,
		})

		if (nextState === "ON") {
			// Insert the CSS file when the user turns the extension on
			await chrome.scripting.insertCSS({
				files: ["focus-mode.css"],
				target: {tabId: tab.id},
			})
		} else if (nextState === "OFF") {
			// Remove the CSS file when the user turns the extension off
			await chrome.scripting.removeCSS({
				files: ["focus-mode.css"],
				target: {tabId: tab.id},
			})
		}

		// Log the HTML of the current page when the extension is clicked
	}
	if (tab.url.startsWith(whatsapp)) {
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: Master,
		})
	}
})

function Master() {
	const apiKey = "AIzaSyCEJG7V3S3W61Vn5xvj01IyjYjF3ZOsIvE"
	const spreadsheetId = "1Fq0IifoSIMvD9vXBjGVD3yxxz5E9J5OjO1OLeSbQH2M"
	const range = "Sheet1!M1" // Replace "Sheet1" with the actual sheet name
	const valueInputOption = "RAW" // RAW or USER_ENTERED

	async function updateSpreadsheet(inputValue) {
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=${valueInputOption}&key=${apiKey}`

		const body = {
			range: range,
			majorDimension: "ROWS",
			values: [[inputValue]],
		}

		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			})

			if (response.ok) {
				const data = await response.json()
				console.log("Cell updated successfully:", data)
			} else {
				console.error("Error updating cell:", response.status, await response.text())
			}
		} catch (error) {
			console.error("Fetch error:", error)
		}
	}

	//gets info from one message row
	function extractInfo(row) {
		// Retrieve sender name
		const sender = row.querySelector('span[aria-label][dir="auto"]')?.innerText || "Unknown Sender"

		// Retrieve the message content
		const messageContent = row.querySelector('span[dir="ltr"]')?.innerText || "No Message Content"

		// Retrieve the timestamp from the 'data-pre-plain-text' attribute
		const timestampElement = row.querySelector("[data-pre-plain-text]")
		const timestampText = timestampElement ? timestampElement.getAttribute("data-pre-plain-text") || "No Timestamp" : "No Timestamp"

		// Extract time
		const timeMatch = timestampText.match(/\b\d{1,2}:\d{2}\s?[AP]M\b/)
		console.log(timeMatch, "match")
		const time = timeMatch ? timeMatch[0] : null

		// Extract date
		const dateMatch = timestampText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
		const date = dateMatch ? `${dateMatch[2]}/${dateMatch[1]}/${dateMatch[3]}` : null

		// Extract phone number
		const phoneMatch = timestampText.match(/\+1\s\(\d{3}\)\s\d{3}-\d{4}/)
		const phoneNumber = phoneMatch ? phoneMatch[0] : null // Determine the message type based on content

		let messageType = "Unknown"
		if (messageContent.toUpperCase().includes("LEARN")) {
			messageType = "learn"
		} else if (messageContent.toUpperCase().includes("LIFT")) {
			messageType = "lift"
		}
		return {sender, messageContent, date, time, phoneNumber, messageType}
	}

	//gets all of the message info from each message row
	function scrapeMessages() {
		const messageRows = document.querySelectorAll('div[role="row"]')
		const messages = Array.from(messageRows).map((row) => {
			return extractInfo(row)
		})
		console.log(messages, "MESSAGES")
		return messages
	}

	//scrolls the chatbox to the top of the day
	function scrollToDay() {
		const chatBox = document.querySelector('[role="application"]') // get the chat box element
		const messageRows = document.querySelectorAll('div[role="row"]')

		const today = new Date()
		const todayStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

		// Check if there are message rows and the first message is from today
		let firstMessage = extractInfo(messageRows[0])
		let firstMessageDate = firstMessage.date

		// Scroll the chat box until the first message is no longer from today
		const scrollInterval = setInterval(() => {
			// If the first message is from today, scroll
			// console.log(firstMessageDate, todayStr, "austin austinI")
			if (firstMessageDate === todayStr) {
				chatBox.scrollIntoView({behavior: "smooth", block: "start"})

				// Update message rows and recheck the first message date
				const updatedMessageRows = document.querySelectorAll('div[role="row"]')
				firstMessageDate = extractInfo(updatedMessageRows[0]).date
				console.log("scrolling")
			} else {
				// Stop scrolling once we hit a message not from today
				console.log("not scrolling")
				const messages = scrapeMessages()
				updateSpreadsheet(messages)

				const today = new Date()
				const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`

				const todaysMessages = messages.filter((el) => el.date === todayStr)
				console.log(todaysMessages, "todays todays")

				clearInterval(scrollInterval)
			}
		}, 2000) // Scroll every 2 seconds (adjust as needed)
	}

	//master function
	async function scrollAndFindMessages() {
		await scrollToDay()
	}
	scrollAndFindMessages()
}
