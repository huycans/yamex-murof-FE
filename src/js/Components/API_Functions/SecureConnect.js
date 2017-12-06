import { URL } from "../../Constants/API";
import sha512 from "crypto-js/sha512";

async function sendDataWithAuth(method, api, authData, body) {
	try {
		console.log("starting sending data");
		let currentTime = new Date().toISOString();

		let hashDigest = sha512(
			`${method} ${api} ${currentTime} ${authData.userId}`
		).toString();

		let link = `${URL}${api}?emit=${currentTime}`;
		console.log("inside sendDataWithAuth");
		console.log(method, api, authData, body);

		let serverResponse = await fetch(link, {
			method: method,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
				sessionToken: authData.sessionToken,
				enc: hashDigest
			},
			body: JSON.stringify(body)
		});
		console.log("serverResponse", serverResponse);
		let responseJSON = await serverResponse.json();
		if (responseJSON.status.httpStatus === 200) {
			//make sure there is content inside the response before return it
			return responseJSON;
		} else {
			console.log(responseJSON.message);
			throw responseJSON.message;
		}
	} catch (error) {
		throw error;
	}
}
export { sendDataWithAuth };
