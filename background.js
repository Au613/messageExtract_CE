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

	const personDirectoryByName = {
		"Elon Packin": {
			email: "epackin@gmail.com",
			phone: "5166985825",
		},
		"Amy Gutenplan": {
			email: "amygutenplan@gmail.com",
			phone: "9143295026",
		},
		"Hannah Packin": {
			email: "hmpackin@gmail.com",
			phone: "9143294005",
		},
		"Ayellet Afek": {
			email: "arpackin@gmail.com",
			phone: "972529575625",
		},
		"David Dworsky": {
			email: "dworsky.david@gmail.com",
			phone: "3109635504",
		},
		"Yaniv Sapir": {
			email: "yaniv.s.sapir@gmail.com",
			phone: "7542041129",
		},
		"Moses Gotterer": {
			email: "William.gotterer@gmail.com",
			phone: "4136730086",
		},
		"Chezky Wolff": {
			email: "Chezkywolff@gmail.com",
			phone: "9177539929",
		},
		"Ethan Shapiro": {
			email: "Ethanshapiro22@gmail.com",
			phone: "9545517440",
		},
		"Jacob Cannon": {
			email: "jacob.r.cannon@gmail.com",
			phone: "9149600249",
		},
		"Jordan Gottlieb": {
			email: "jgottlieb96@gmail.com",
			phone: "6103481277",
		},
		"James Schuster": {
			email: "Scjames@wharton.UPenn.edu",
			phone: "5162867090",
		},
		"Zach Levine": {
			email: "Zacharylevine9@gmail.com",
			phone: "2012489691",
		},
		"Kaitlin Schuster": {
			email: "kagschuster@gmail.com",
			phone: "6105291299",
		},
		"Jessica Faibish": {
			email: "jessica.faibish@gmail.com",
			phone: "5165025237",
		},
		"Tyler Sherman": {
			email: "sherman.tyler.j@gmail.com",
			phone: "5169652013",
		},
		"Michael Egan": {
			email: "eganmj.426@gmail.com",
			phone: "5163820059",
		},
		"George Hartoularos": {
			email: "ghartoularos@gmail.com",
			phone: "9179212450",
		},
		"Masha Vainblat": {
			email: "Mashavainblat@gmail.com",
			phone: "5162344611",
		},
		"Jordana Balsam": {
			email: "jordanabalsam@gmail.com",
			phone: "5163133164",
		},
		"Austin Edelman": {
			email: "austinmit613@gmail.com",
			phone: "6172333055",
		},
		"Aaron Kahane": {
			email: "eakahane@gmail.com",
			phone: "2019063459",
		},
		"Sam Strickberger": {
			email: "sam@impactfirst.vc",
			phone: "2404542522",
		},
		"Max Strickberger": {
			email: "Max@impactfirst.vc",
			phone: "2404542526",
		},
		"Salo Serfati": {
			email: "salo@givechariot.com",
			phone: "7866831020",
		},
		"Edan Packin": {
			email: "ep.packin@gmail.com",
			phone: "5169745790",
		},
		"William Cohen": {
			email: "will.h.cohen@gmail.com",
			phone: "5025481314",
		},
		"Ben Sender": {
			email: "Benpsend@gmail.com",
			phone: "8622520600",
		},
		"Ben Shapira": {
			email: "Benshaishapira@gmail.com",
			phone: "3025306670",
		},
		"Arianna Zarka": {
			email: "ariannazarka@gmail.com",
			phone: "5165921925",
		},
		"Elena Katan": {
			email: "elenakatan@gmail.com",
			phone: "9174261457",
		},
		"Josh Burton": {
			email: "Joshburton123@gmail.com",
			phone: "9524652979",
		},
		"Jacob Wasserman": {
			email: "Jacobawasserman@gmail.com",
			phone: "5162706778",
		},
		"Charlie Packin": {
			email: "Cbpackin@gmail.com",
			phone: "5167704871",
		},
		"Jake Kamensky": {
			email: "jakekamensky@gmail.com",
			phone: "8457980603",
		},
		"Yaniv Packin": {
			email: "Ypackin@gmail.com",
			phone: "5163131832",
		},
		"Avi Yeswich": {
			email: "ayesawich@gmail.com",
			phone: "3057904771",
		},
		"Ian Miller": {
			email: "ianmimiller@gmail.com",
			phone: "5163136813",
		},
		"Jordan Gvili": {
			email: "Jordang17696@gmail.com",
			phone: "7866373350",
		},
		"Yechiel Ciment": {
			email: "yciment@gmail.com",
			phone: "3054588332",
		},
		"Ron Packin": {
			email: "ronpackin@gmail.com",
			phone: "5166035197",
		},
		"Matt Oppenheim": {
			email: "mattopp9@gmail.com",
			phone: "3146878766",
		},
		"Jack Zucker": {
			email: "jacklzucker@gmail.com",
			phone: "8478141714",
		},
		"Miles Mueller": {
			email: "mueller.miles24@gmail.com",
			phone: "5165217979",
		},
		"Shua Mermelstein": {
			email: "Rabbishuam@gmail.com",
			phone: "9178806307",
		},
		"Alissa Freltz": {
			email: "Fromkin@gmail.com",
			phone: "5163150788",
		},
		"Emma Rich": {
			email: "emmasummerrich@gmail.com",
			phone: "2037247120",
		},
		"Noah Altman": {
			email: "Noahaltman7@gmail.com",
			phone: "6465446652",
		},
		"LeeLee Lavin": {
			email: "Leorelavin@gmail.com",
			phone: "6467098909",
		},
		"Assaf Packin": {
			email: "apackin@gmail.com",
			phone: "9176816829",
		},
		"Rich Weinstein": {
			email: "nicethinwires@yahoo.com",
			phone: "9175099082",
		},
		"Houston Diaz": {
			email: "houstondiaz@gmail.com",
			phone: "6462764310",
		},
		"Joshua Leventhal": {
			email: "Joshleve@gmail.com",
			phone: "5087404749",
		},
		"Jon Rosen": {
			email: "jonrsn23@gmail.com",
			phone: "5165812113",
		},
		"Zach Schwager": {
			email: "zachschwager@gmail.com",
			phone: "3474292363",
		},
	}

	const personDirectoryByPhone = {
		5166985825: {
			name: "Elon Packin",
			email: "epackin@gmail.com",
		},
		9143295026: {
			name: "Amy Gutenplan",
			email: "amygutenplan@gmail.com",
		},
		9143294005: {
			name: "Hannah Packin",
			email: "hmpackin@gmail.com",
		},
		972529575625: {
			name: "Ayellet Afek",
			email: "arpackin@gmail.com",
		},
		3109635504: {
			name: "David Dworsky",
			email: "dworsky.david@gmail.com",
		},
		7542041129: {
			name: "Yaniv Sapir",
			email: "yaniv.s.sapir@gmail.com",
		},
		4136730086: {
			name: "Moses Gotterer",
			email: "William.gotterer@gmail.com",
		},
		9177539929: {
			name: "Chezky Wolff",
			email: "Chezkywolff@gmail.com",
		},
		9545517440: {
			name: "Ethan Shapiro",
			email: "Ethanshapiro22@gmail.com",
		},
		9149600249: {
			name: "Jacob Cannon",
			email: "jacob.r.cannon@gmail.com",
		},
		6103481277: {
			name: "Jordan Gottlieb",
			email: "jgottlieb96@gmail.com",
		},
		5162867090: {
			name: "James Schuster",
			email: "Scjames@wharton.UPenn.edu",
		},
		2012489691: {
			name: "Zach Levine",
			email: "Zacharylevine9@gmail.com",
		},
		6105291299: {
			name: "Kaitlin Schuster",
			email: "kagschuster@gmail.com",
		},
		5165025237: {
			name: "Jessica Faibish",
			email: "jessica.faibish@gmail.com",
		},
		5169652013: {
			name: "Tyler Sherman",
			email: "sherman.tyler.j@gmail.com",
		},
		5163820059: {
			name: "Michael Egan",
			email: "eganmj.426@gmail.com",
		},
		9179212450: {
			name: "George Hartoularos",
			email: "ghartoularos@gmail.com",
		},
		5162344611: {
			name: "Masha Vainblat",
			email: "Mashavainblat@gmail.com",
		},
		5163133164: {
			name: "Jordana Balsam",
			email: "jordanabalsam@gmail.com",
		},
		6172333055: {
			name: "Austin Edelman",
			email: "austinmit613@gmail.com",
		},
		2019063459: {
			name: "Aaron Kahane",
			email: "eakahane@gmail.com",
		},
		2404542522: {
			name: "Sam Strickberger",
			email: "sam@impactfirst.vc",
		},
		2404542526: {
			name: "Max Strickberger",
			email: "Max@impactfirst.vc",
		},
		7866831020: {
			name: "Salo Serfati",
			email: "salo@givechariot.com",
		},
		5169745790: {
			name: "Edan Packin",
			email: "ep.packin@gmail.com",
		},
		5025481314: {
			name: "William Cohen",
			email: "will.h.cohen@gmail.com",
		},
		8622520600: {
			name: "Ben Sender",
			email: "Benpsend@gmail.com",
		},
		3025306670: {
			name: "Ben Shapira",
			email: "Benshaishapira@gmail.com",
		},
		5165921925: {
			name: "Arianna Zarka",
			email: "ariannazarka@gmail.com",
		},
		9174261457: {
			name: "Elena Katan",
			email: "elenakatan@gmail.com",
		},
		9524652979: {
			name: "Josh Burton",
			email: "Joshburton123@gmail.com",
		},
		5162706778: {
			name: "Jacob Wasserman",
			email: "Jacobawasserman@gmail.com",
		},
		5167704871: {
			name: "Charlie Packin",
			email: "Cbpackin@gmail.com",
		},
		8457980603: {
			name: "Jake Kamensky",
			email: "jakekamensky@gmail.com",
		},
		5163131832: {
			name: "Yaniv Packin",
			email: "Ypackin@gmail.com",
		},
		3057904771: {
			name: "Avi Yeswich",
			email: "ayesawich@gmail.com",
		},
		5163136813: {
			name: "Ian Miller",
			email: "ianmimiller@gmail.com",
		},
		7866373350: {
			name: "Jordan Gvili",
			email: "Jordang17696@gmail.com",
		},
		3054588332: {
			name: "Yechiel Ciment",
			email: "yciment@gmail.com",
		},
		5166035197: {
			name: "Ron Packin",
			email: "ronpackin@gmail.com",
		},
		3146878766: {
			name: "Matt Oppenheim",
			email: "mattopp9@gmail.com",
		},
		8478141714: {
			name: "Jack Zucker",
			email: "jacklzucker@gmail.com",
		},
		5165217979: {
			name: "Miles Mueller",
			email: "mueller.miles24@gmail.com",
		},
		9178806307: {
			name: "Shua Mermelstein",
			email: "Rabbishuam@gmail.com",
		},
		5163150788: {
			name: "Alissa Freltz",
			email: "Fromkin@gmail.com",
		},
		2037247120: {
			name: "Emma Rich",
			email: "emmasummerrich@gmail.com",
		},
		6465446652: {
			name: "Noah Altman",
			email: "Noahaltman7@gmail.com",
		},
		6467098909: {
			name: "LeeLee Lavin",
			email: "Leorelavin@gmail.com",
		},
		9176816829: {
			name: "Assaf Packin",
			email: "apackin@gmail.com",
		},
		9175099082: {
			name: "Rich Weinstein",
			email: "nicethinwires@yahoo.com",
		},
		6462764310: {
			name: "Houston Diaz",
			email: "houstondiaz@gmail.com",
		},
		5087404749: {
			name: "Joshua Leventhal",
			email: "Joshleve@gmail.com",
		},
		5165812113: {
			name: "Jon Rosen",
			email: "jonrsn23@gmail.com",
		},
		3474292363: {
			name: "Zach Schwager",
			email: "zachschwager@gmail.com",
		},
	}

	//gets info from one message row
	function extractInfo(row) {
		// Retrieve sender name
		const sender = row.querySelector('span[aria-label][dir="auto"]')?.innerText || "Unknown Sender"

		// Retrieve the message content
		const messageContent = row.querySelector('span[dir="ltr"]')?.innerText || "No Message Content"

		const countRegex = /\b(?:learn|lift)\b.*?(\d+-\d+)\b|\b(\d+-\d+)\b.*?\b(?:learn|lift)\b/i
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
        return {sender, count, messageContent}
		// return {sender, messageContent, date, time, phoneNumber, messageType, count}
	}

	//gets all of the message info from each message row
	function scrapeMessages() {
		const messageRows = document.querySelectorAll('div[role="row"]')
		const messages = Array.from(messageRows).map((row) => {
			return extractInfo(row)
		})
		console.log(messages, "MESSAGES")
        copyTodaysMessagesToClipboard(messages);
        console.log('done copying')
        
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


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'beginningOfWeek') {
      console.log('Button clicked: Beginning of the Week');
      const weekStart = "Monday 12/30 - Sunday 01/06"; // Example date range
      // Send a message to the popup to copy the text
      chrome.runtime.sendMessage({ action: 'copyToClipboard', text: weekStart });
      sendResponse({ success: true, copied: weekStart });
    } else if (message.action === 'today') {
        
      console.log('Button clicked: Today');
      const todayText = "Monday 12/30"; // Example today's date
      // Send a message to the popup to copy the text
      chrome.runtime.sendMessage({ action: 'copyToClipboard', text: todayText });
      sendResponse({ success: true, copied: todayText });
    }
  });
  