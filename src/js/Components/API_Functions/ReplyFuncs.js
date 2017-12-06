import { SERVER_API } from "../../Constants/API";
import { sendDataWithAuth } from "./SecureConnect";
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

		let response = await sendDataWithAuth(
			"PUT",
			SERVER_API.reply,
			authData,
			body
		);

		if (response.status.httpStatus !== 200) throw Error("Cannot send reply");
	} catch (error) {
		throw error;
	}
}

export { sendReply };
