import { URL, SERVER_API } from "../../Constants/API";
import { sendDataWithAuth } from "./SecureConnect";
async function getUserInfo(userId) {
	try {
		let link = URL + SERVER_API.user + "/" + userId;
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

async function updateUserInfo(authData, body) {
	try {
		await sendDataWithAuth(
			"POST",
			SERVER_API.user + "/" + authData.userId,
			authData,
			body
		);
	} catch (error) {
		throw error;
	}
}
export { getUserInfo, updateUserInfo };
