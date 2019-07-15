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
		return responseJSON;
	} catch (error) {
		throw error;
	}
}

async function updateUserInfo(authData, body) {
	try {
		await sendDataWithAuth("POST", SERVER_API.user + "/" + authData.userId, authData, body);
	} catch (error) {
		throw error;
	}
}

async function loginWithEmail(username, password) {
	try {
		let response = await fetch(URL + SERVER_API.userlogin, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});
		let responseJSON = await response.json();
		console.log(responseJSON);
		if (responseJSON) {
			return responseJSON;
		} else return null;
	} catch (error) {
		throw error;
	}
}
export { getUserInfo, updateUserInfo, loginWithEmail };
