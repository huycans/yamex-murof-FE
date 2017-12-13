//constants for api access
const PROTOCOL = "http://";
// const PROTOCOL = "https://";
// const SERVER_IP = "35.196.89.114:5003";
//const SERVER_IP = "10.80.250.235:5003";
const SERVER_IP = "192.168.137.157:5003";
const SERVER_LINK = "/yamex";
const SERVER_API = {
	auth: "/auth",
	forum: "/forum",
	getAllForum: "/forum/all",
	subforum: "/subforum",
	thread: "/thread",
	threadNewest: "/thread/latest",
	reply: "/reply",
	user: "/user/info"
};
let URL = PROTOCOL + SERVER_IP + SERVER_LINK;

export { URL, SERVER_API };
