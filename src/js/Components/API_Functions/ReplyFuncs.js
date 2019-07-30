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
      content: content,
      // token: authData.sessionToken
    };
		const link = URL + SERVER_API.reply;
    const bearer = 'Bearer ' + authData.sessionToken;
    let serverResponse = await fetch(link, {
			method: "POST",
      withCredentials: true,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Authorization": bearer
			},
			body: JSON.stringify(body)
    });
    let responseJSON = await serverResponse.json();
		console.log(responseJSON);
		if (serverResponse.status === 200) {
			//make sure there is content inside the response before return it
			return responseJSON;
		} else {
			console.log(responseJSON.message);
			throw responseJSON.message;
		}
		// await sendDataWithAuth("PUT", SERVER_API.reply, authData, body);
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
		console.log(responseJSON);
		return responseJSON ;
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
