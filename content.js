
function extractInfo(row) {
	// console.log(row, "ROW ROW ROW")
	const firstMessageFromSender = !!row.querySelector('[tabindex="0"]')

	// Retrieve sender name
	let sender = row.querySelector('span[dir="auto"]')?.innerText || row.querySelector('span[aria-label][dir="auto"]')?.innerText || "Unknown Sender"
	sender = firstMessageFromSender ? sender : "previous sender"

	// Retrieve the message content
	const messageContent = row.querySelector('span[dir="ltr"]')?.innerText || "No Message Content"
	
	const countRegex = /\b(?:learn|lift)\b.*?(\d+(?:\.\d+)?\s*-?\s*\d*(?:\.\d+)?|\d*\s*\.\d+)\b|\b(\d+(?:\.\d+)?\s*-?\s*\d*(?:\.\d+)?|\d*\s*\.\d+)\b.*?\b(?:learn|lift)\b/i
	const match = messageContent.match(countRegex)
	const count = match ? match[1] || match[2] : ""

	// Retrieve the timestamp from the 'data-pre-plain-text' attribute
	const timestampElement = row.querySelector("[data-pre-plain-text]")
	const timestampText = timestampElement ? timestampElement.getAttribute("data-pre-plain-text") || "No Timestamp" : "No Timestamp"

	// Extract time
	const timeMatch = timestampText.match(/\b\d{1,2}:\d{2}\s?[AP]M\b/)
	const time = timeMatch ? timeMatch[0] : null

	// Extract date
	const dateMatch = timestampText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
	const date = dateMatch ? `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}` : null

	// Extract phone number
	const phoneMatch = timestampText.match(/\+1\s\(\d{3}\)\s\d{3}-\d{4}/)
	const phoneNumber = phoneMatch ? phoneMatch[0] : null // Determine the message type based on content

	let messageType = "Unknown"
	const includeLearn = messageContent.toUpperCase().includes("LEARN")
	const includesLift = messageContent.toUpperCase().includes("LIFT")
	if (includeLearn && includesLift) {
		messageType = "lift and learn"
	} else if (includeLearn) {
		messageType = "learn"
	} else if (includesLift) {
		messageType = "lift"
	}

	return {sender, count, messageType, messageContent, date, time, phoneNumber}
	// return {sender, messageContent, date, time, phoneNumber, messageType, count}
}

//gets all of the message info from each message row
function scrapeMessages() {
	const messageRows = document.querySelectorAll('div[role="row"]')
	let previousSender = "" // To keep track of the sender of the previous row
	const messages = Array.from(messageRows).map((row) => {
		let message = extractInfo(row) // Extract info from the current row
		let sender = message.sender
		// Check if the sender contains a time format like "1:23 PM" or "1:23 AM"
		if (sender.match(/\b\d{1,2}:\d{2}\s?[AP]M\b/) || sender === "previous sender") {
			sender = previousSender // If time format is found, use the previous sender
		} else {
			previousSender = sender // Update previousSender with the current row's sender
		}

		// Update the message object with the corrected sender
		message.sender = sender

		return message
	})
	return messages
}

function getStartOfWeek(date) {
	const day = date.getDay()
	const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust if it's Sunday (0)
	const startOfWeek = new Date(date.setDate(diff))
	return startOfWeek
}

function getPreviousDay(date) {
	const previousDate = new Date(date)
	previousDate.setDate(date.getDate() - 1)
	return previousDate
}

function getDayBeforeStartOfWeek(date) {
	const startOfWeek = getStartOfWeek(date)
	return getPreviousDay(startOfWeek)
}

function beforeDate(date1, date2) {
	if (date1.getFullYear() === date2.getFullYear()) {
		if (date1.getMonth() === date2.getMonth()) {
			return date1.getDate() < date2.getDate()
		} else {
			return date1.getMonth() < date2.getMonth()
		}
	} else {
		return date1.getFullYear() < date2.getFullYear()
	}
}

function getFirstMessageDate(messageRows) {
	let firstMessageDateObj
	for (let row of messageRows) {
		const info = extractInfo(row)
		if (info.date) {
			firstMessageDateObj = new Date(info.date)
			break
		}
	}
	return firstMessageDateObj
}

function scrollToDate(command) {
	const chatBox = document.querySelector('[role="application"]') // Get the chat box element
	const messageRows = document.querySelectorAll('div[role="row"]') // Get all message rows

	const today = new Date()
	let targetDate

	if (command === "today") {
		const scrollingTargetDay = getPreviousDay(today)
		targetDate = `${scrollingTargetDay.getMonth() + 1}/${scrollingTargetDay.getDate()}/${scrollingTargetDay.getFullYear()}` // Reversed: Month/Day/Year
	} else if (command === "week") {
		// Get the start of the week (Sunday, for example)
		const startOfWeek = getStartOfWeek(today)
		const dayBeforeStartOfWeek = getDayBeforeStartOfWeek(startOfWeek)

		targetDate = `${dayBeforeStartOfWeek.getMonth() + 1}/${dayBeforeStartOfWeek.getDate()}/${dayBeforeStartOfWeek.getFullYear()}` // Reversed: Month/Day/Year
	} else {
		console.error("Invalid command, expected 'today' or 'week'.")
		return
	}

	let firstMessageDateObj = getFirstMessageDate(messageRows)

	const scrollChat = () => {
		const targetdateDateObj = new Date(targetDate)
		const beforeDayCondition = beforeDate(targetdateDateObj, firstMessageDateObj)

		if (beforeDayCondition) {
			// If the first message is not from the target date, keep scrolling

			// Scroll to the chat box smoothly
			chatBox.scrollIntoView({behavior: "smooth", block: "start"})

			// Update the message rows and check the first message's date again
			const updatedMessageRows = document.querySelectorAll('div[role="row"]')
			firstMessageDateObj = getFirstMessageDate(updatedMessageRows)

			// Recursively call scrollChat every 2 seconds
			setTimeout(scrollChat, 2000)
		} else {
			// Once the first message's date matches the target date, stop scrolling and scrape the messages

			const messages = scrapeMessages()
			const targetMessages = messages.filter((message) => new Date(message.date) > new Date(targetDate))
			// Send the filtered messages to the background
			chrome.runtime.sendMessage({type: "EXTRACTED_JSON", data: targetMessages})
		}
	}

	// Start scrolling
	scrollChat()
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "scroll") {
		scrollToDate("today")
		sendResponse({status: "scroll started today"})
	}
	if (message.type === "scrollWeek") {
		scrollToDate("week")
		sendResponse({status: "scroll started week"})
	}
})
