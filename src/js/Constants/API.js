//constants for api access
const PROTOCOL = "http://";
// const PROTOCOL = "http://";
const SERVER_IP = "104.196.11.70:5003";
// const SERVER_IP = "192.168.137.1:5003";
const SERVER_LINK = "/yamex";
const SERVER_API = {
	auth: "/auth",
	forum: "/forum",
	getAllForum: "/forum/all",
	getAllSubforumOfAForum: "/subforum"
};
let URL = PROTOCOL + SERVER_IP + SERVER_LINK;

export { URL, SERVER_API };
