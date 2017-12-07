import { URL } from "../../Constants/API";
import sha512 from "crypto-js/sha512";

async function sendDataWithAuth(method, api, authData, body) {
	try {
		console.log("starting sending data");
		let currentTime = new Date().toISOString();
		let serverResponse = null;
		//calculate hash for enc field
		let hashDigest = sha512(
			`${method} ${api} ${currentTime} ${authData.userId}`
		).toString();

		let link = `${URL}${api}?emit=${currentTime}`;
		serverResponse = await fetch(link, {
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

async function sendThankWithAuth(method, api, authData, rid) {
	try {
		console.log("starting sending data");
		let currentTime = new Date().toISOString();
		let serverResponse = null;
		//calculate hash for enc field
		let hashDigest = sha512(
			`${method} ${api}/${rid}/thank ${currentTime} ${authData.userId}`
		).toString();

		let link = `${URL}${api}/${rid}/thank?emit=${currentTime}`;
		serverResponse = await fetch(link, {
			method: method,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
				sessionToken: authData.sessionToken,
				enc: hashDigest
			}
		});
		let responseJSON = await serverResponse.json();
		console.log(responseJSON);
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
export { sendDataWithAuth, sendThankWithAuth };
