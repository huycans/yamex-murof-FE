import { URL, SERVER_API } from "../../Constants/API";
import { sendDataWithAuth, sendThankWithAuth } from "./SecureConnect";
async function sendReply(authData, content, threadId) {
	try {
		console.log("Sending reply");
		const body = {
			author: {
				id: authData.userId
			},
			threadId: threadId,
			content: content
		};

		await sendDataWithAuth("PUT", SERVER_API.reply, authData, body);
	} catch (error) {
		throw error;
	}
}

async function getReplyList(thrid, page) {
	try {
		let link = URL + SERVER_API.reply + "?thrid=" + thrid + "&page=" + page;
		let response = await fetch(link, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			}
		});
		let responseJSON = await response.json();
		return responseJSON.content;
	} catch (error) {
		throw error;
	}
}

async function sendThank(authData, rid) {
	try {
		await sendThankWithAuth("POST", SERVER_API.reply, authData, rid);
	} catch (error) {
		throw error;
	}
}
export { sendReply, getReplyList, sendThank };
