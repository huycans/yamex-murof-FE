//constants for api access
// const PROTOCOL = "https://";
// const SERVER_IP = "35.196.89.114:5003";
//const SERVER_IP = "10.80.250.235:5003";

// local link
const PROTOCOL = "http://";
const SERVER_IP = "localhost:3000";

//deployed link
// const PROTOCOL = "https://";
// const SERVER_IP = "yamex.herokuapp.com";
const SERVER_API = {
	auth: "/auth",
	forum: "/forum",
	getAllForum: "/forum/all",
	subforum: "/subforum",
	thread: "/thread",
	threadNewest: "/thread/latest",
	reply: "/reply",
	user: "/user",
	userlogin: "/user/login",
	usersignup: "/user/signup",
	userTokenCheck: "/user/checkJWTToken",
	logout: "/user/logout"
};
let URL = process.env.baseURL || PROTOCOL + SERVER_IP;

export { URL, SERVER_API };
