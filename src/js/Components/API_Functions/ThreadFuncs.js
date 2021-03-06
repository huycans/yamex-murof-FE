import { URL, SERVER_API } from "../../Constants/API";
import { sendReply } from "./ReplyFuncs";
import { sendDataWithAuth } from "./SecureConnect";

async function getThreadList(sfid, page) {
	try {
		let link = URL + SERVER_API.thread + "?sfid=" + sfid + "&page=" + page;
		let response = await fetch(link, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			}
		});
		let responseJSON = await response.json();
		return responseJSON ;
	} catch (error) {
		throw error;
	}
}

async function getThreadData(threadId) {
	try {
		let link = URL + SERVER_API.thread + "/" + threadId;
		let response = await fetch(link, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			}
		});
		let responseJSON = await response.json();
		return responseJSON ;
	} catch (error) {
		throw error;
	}
}

async function createThread(name, subForumId, content, authData) {
	try {
		console.log(name, subForumId, content, authData);
		console.log("Creating thread");
		const body = {
			author: {
				id: authData.userId
			},
			name: name,
			subForumId: subForumId
		};

		let response = await sendDataWithAuth(
			"PUT",
			SERVER_API.thread,
			authData,
			body
		);
		let threadId = response ;
		await sendReply(authData, content, threadId);
		return 1;
	} catch (error) {
		throw error;
	}
}

async function getNewestThreadList(sfid) {
	try {
		let link = URL + SERVER_API.threadNewest + "?sfid=" + sfid;
		let response = await fetch(link, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			}
		});
		let responseJSON = await response.json();
		return responseJSON ;
	} catch (error) {
		throw error;
	}
}
export { getThreadList, createThread, getThreadData, getNewestThreadList };
