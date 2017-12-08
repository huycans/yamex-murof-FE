import { URL, SERVER_API } from "../../Constants/API";

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

export { getUserInfo };
