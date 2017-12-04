import { URL, SERVER_API } from "../../Constants/API";
async function getSubForumList(fid) {
	try {
		let link = URL + SERVER_API.getAllSubforumOfAForum + "?fid=" + fid;
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

async function getForumList() {
	try {
		let link = URL + SERVER_API.getAllForum;
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

export { getSubForumList, getForumList };
