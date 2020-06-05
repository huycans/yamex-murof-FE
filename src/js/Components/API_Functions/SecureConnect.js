import { URL } from "../../Constants/API";
import sha512 from "crypto-js/sha512";

async function sendDataWithAuth(method, api, authData, body) {
	try {
		let link = `${URL}${api}`;
		let serverResponse = await fetch(link, {
			method: method,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
				// sessionToken: authData.sessionToken,
				// enc: hashDigest,
				"Authorization": "Bearer " + authData.sessionToken
			},
			body: JSON.stringify(body)
		});
		//make sure there is content inside the response before return it
		if (serverResponse.status === 200) {
			let responseJSON = await serverResponse.json();
			console.log(responseJSON);
			return responseJSON;
		} else {
			// console.log(serverResponse);
			throw serverResponse;
		}

	} catch (error) {
		throw error;
	}
}

async function sendFormWithAuth(method, api, authData, body) {
	try {
		let link = `${URL}${api}`;
		let serverResponse = await fetch(link, {
			method: method,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				// "Content-Type": "multipart/form-data",//setting this prevent the FormData object from being read by multer at backend
				"Authorization": "Bearer " + authData.sessionToken
			},
			body: body
		});
		//make sure there is content inside the response before return it
		if (serverResponse.status === 200) {
			let responseJSON = await serverResponse.json();
			console.log(responseJSON);
			return responseJSON;
		} else {
			// console.log(serverResponse);
			throw serverResponse;
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
export { sendDataWithAuth, sendThankWithAuth, sendFormWithAuth };
