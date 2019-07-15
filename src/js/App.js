import React, { Component } from "react";
import "../css/App.css";
import MainContent from "./Components/MainContent";
import { Route, Link } from "react-router-dom";
import firebase from "./Components/Firebase/Firebase.js";
import { verifyToken, getUserInfo, loginWithEmail } from "./Components/API_Functions";
import Modal from "react-modal";
import LoadingIcon from "./Components/LoadingIcon";
import UserInfo from "./Components/User";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			email: "huy2@user.com",
			password: "password",
			errorMessage: "",
			//user from firebase
			user: null,
			userFromServer: null,
			sessionToken: "",
			userId: ""
		};
		this.handleInputEmail = this.handleInputEmail.bind(this);
		this.handleInputPassword = this.handleInputPassword.bind(this);
		this.signup = this.signup.bind(this);
		this.login = this.login.bind(this);
		this.signout = this.signout.bind(this);
		this.loginMethod = this.loginMethod.bind(this);
	}
	handleInputEmail(event) {
		this.setState({ email: event.target.value });
	}

	handleInputPassword(event) {
		this.setState({ password: event.target.value });
	}

	//function that will perform login function from various method and return user object
	async loginMethod(method) {
		let provider = null;
		let result = null;
		let user = null;
		let { email, password } = this.state;
		try {
			console.log("Switching");
			switch (method) {
			case "facebook": //if user log in using facebook
				console.log("Logging in with facebook");
				provider = new firebase.auth.FacebookAuthProvider();
				await firebase.auth().signInWithRedirect(provider);
				result = await firebase.auth().getRedirectResult();
				// The signed-in user info.
				user = result.user;
				console.log("logged in");
				console.log(user);
				// clientIdToken = await user.getIdToken(true);
				// console.log("clientIdToken", clientIdToken);
				// return clientIdToken;
				return user;
				//break;

			case "google": //if user log in using google
				console.log("Logging in with google");
				provider = new firebase.auth.GoogleAuthProvider();
				await firebase.auth().signInWithRedirect(provider);
				firebase.auth().languageCode = "en";
				result = await firebase.auth().getRedirectResult();

				// The signed-in user info.
				user = result.user;
				console.log("logged in");
				console.log(user);
				// clientIdToken = await user.getIdToken();
				// console.log("clientIdToken", clientIdToken);
				// return clientIdToken;
				return user;
				//break;

			case "email": //if user log in using email/password
				if (email === "" || password === "") return;
				console.log("Logging in with email");
				await firebase.auth().signInWithEmailAndPassword(email, password);
				await firebase.auth().onAuthStateChanged(function(userObj) {
					if (userObj) {
						//User is signed in
						console.log(userObj);
						user = userObj;
					} else {
						console.log("No user is logged in");
					}
				});
				if (user !== null) {
					// clientIdToken = await user.getIdToken();
					// console.log("clientIdToken", clientIdToken);
					// return clientIdToken;
					return user;
				}

				break;
			default:
				console.log("Not recognize login method");
				break;
			}
		} catch (error) {
			throw error;
		}
	}

	// async login(method) {
	// 	console.log("Logging in");
	// 	console.log(method);
	// 	this.setState({ isLoading: true });
	// 	try {
	// 		let user = await this.loginMethod(method);
	// 		let clientIdToken = await user.getIdToken();
	// 		console.log("clientIdToken", clientIdToken);
	// 		//verify token
	// 		let serverResponse = await verifyToken(clientIdToken, null);
	// 		console.log(serverResponse);
	// 		//save user, sessionToken, userId to state
	// 		let userObj = await getUserInfo(serverResponse.userId);
	// 		//save user, sessionToken, userId to state
	// 		this.setState({
	// 			userFromServer: userObj,
	// 			user: user,
	// 			sessionToken: serverResponse.sessionToken,
	// 			userId: serverResponse.userId
	// 		});
	// 	} catch (error) {
	// 		this.setState({ errorMessage: error.message });
	// 		console.log(error);
	// 	} finally {
	// 		this.setState({ isLoading: false });
	// 	}
	// }

	async login(method) {
		console.log("Logging in");
		console.log(method);
		this.setState({ isLoading: true });
		try {
			let userObj = await loginWithEmail(this.state.email, this.state.password);
			this.setState({
				userFromServer: userObj.user,
				user: userObj.user,
				sessionToken: userObj.token,
				userId: userObj.user.id
			});
		} catch (error) {
			this.setState({ errorMessage: error.message });
			console.log(error);
		} finally {
			this.setState({ isLoading: false });
		}
	}

	async signup() {
		const { email, password } = this.state;
		const self = this;
		this.setState({ isLoading: true });
		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.catch(function(error) {
				// Handle Errors here.
				let errorMessage = error.message;
				self.setState({ errorMessage: errorMessage, isLoading: false });
			});
		await firebase.auth().onAuthStateChanged(async function(user) {
			if (user) {
				//Signed in user
				console.log(user);
				let clientIdToken = await user.getIdToken();
				let serverResponse = await verifyToken(clientIdToken, null);
				console.log(serverResponse);
				//save user, sessionToken, userId to state
				let userObj = await getUserInfo(serverResponse.userId);
				//save user, sessionToken, userId to state
				self.setState({
					userFromServer: userObj,
					user: user,
					sessionToken: serverResponse.sessionToken,
					userId: serverResponse.userId
				});
			} else {
				console.log("No user is logged in");
			}
		});
		this.setState({ isLoading: false });
	}

	signout() {
		this.setState({ isLoading: true });
		let self = this;
		firebase
			.auth()
			.signOut()
			.then(function() {
				self.setState({ isLoading: false, user: null });
				// Sign-out successful.
				console.log("Sign-out successful.");
				window.location.reload();
			})
			.catch(function(error) {
				// An error happened.
				console.log("Error while signout: ", error);
				self.setState({
					isLoading: false,
					errorMessage: error.message
				});
			});
	}

	componentDidMount() {
		this.setState({ isLoading: true });
		let self = this;
		console.log("Checking if user is signed in or not");
		firebase.auth().onAuthStateChanged(async function(user) {
			try {
				if (user) {
					//Signed in user
					console.log(user);
					let clientIdToken = await user.getIdToken();
					let serverResponse = await verifyToken(clientIdToken, null);
					console.log(serverResponse);
					let userObj = await getUserInfo(serverResponse.userId);
					//save user, sessionToken, userId to state
					self.setState({
						userFromServer: userObj,
						user: user,
						sessionToken: serverResponse.sessionToken,
						userId: serverResponse.userId
					});
				} else {
					console.log("No user is logged in");
				}
			} catch (error) {
				self.setState({ errorMessage: error.message });
			} finally {
				self.setState({ isLoading: false });
			}
		});
	}

	render() {
		let {
			email,
			password,
			errorMessage,
			isLoading,
			sessionToken,
			userId,
			userFromServer
		} = this.state;
		//display a error message
		let errorDisplay = (
			<div style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}>
				{errorMessage}
			</div>
		);

		//display a modal in the foreground while user is login, signup or signout
		let LoadingModal = (
			<Modal isOpen={isLoading} contentLabel="LoadingModal">
				<div>
					Logging in...
					<LoadingIcon />
				</div>
			</Modal>
		);
		//if state.user exist display the signout button and link to user info page, if not display the login buttons
		const authSection = userId ? (
			<div className="login">
				<div className="login-section">
					<Link to={`/user/${userId}`}>{userFromServer.username}</Link>
					<button className="button-signout" onClick={() => this.signout()}>
						Signout
					</button>
				</div>
			</div>
		) : (
			<div className="login">
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={email}
					onChange={this.handleInputEmail}
				/>

				<input
					type="password"
					name="pwd"
					placeholder="Password"
					value={password}
					onChange={this.handleInputPassword}
				/>
				<div className="login-section">
					<button className="button-login" onClick={() => this.login("email")}>
						Login
					</button>

					<button className="button-signup" onClick={this.signup}>
						Sign up
					</button>
					<input
						className="login-button"
						type="image"
						src={require("../img/facebook.png")}
						alt="fb logo"
						onClick={() => this.login("facebook")}
						onKeyPress={() => this.login("facebook")}
					/>
					<input
						className="login-button"
						type="image"
						src={require("../img/google-plus.png")}
						alt="google logo"
						onClick={() => this.login("google")}
						onKeyPress={() => this.login("google")}
					/>
				</div>
			</div>
		);
		//sessionToken and userId is passed as a prop called authData to all other children components
		//to determined if user is signed in or not
		return (
			<div>
				{LoadingModal}
				<div className="wrap">
					<Link to="/">
						<img src={require("../img/logo.png")} alt="Logo" />
					</Link>

					<div className="search-input">
						<input type="text" name="search" placeholder="Search.." />
					</div>
					{authSection}
				</div>

				{errorDisplay}
				<Route
					path="/"
					render={props => (
						<MainContent
							{...props}
							userFromServer={userFromServer}
							authData={{ sessionToken: sessionToken, userId: userId }}
						/>
					)}
				/>
				<Route
					path={"/user/:userId"}
					render={props => (
						<UserInfo authData={{ sessionToken: sessionToken, userId: userId }} {...props} />
					)}
				/>
				<footer>
					<div className="footer_container">
						<div className="col1">
							<div className="logo">
								<img src={require("../img/logo.png")} alt="logo" />
							</div>
							<div className="describe-us">
								<span>YAMEX RUMOF - Team 1&#39;s project</span>
								<br />This forum help people discuss about things and things about motorcycle.
							</div>
						</div>
						<div className="col2">
							<p>
								<b>Group member :</b>
								<div className="member">
									<br /> Nguyen Thanh Binh
									<br /> Ngo Chinh Dung
									<br /> Dao Thanh Duy
									<br /> Vuong Thieu Huy
									<br /> Diep Nhut Phuong
								</div>
							</p>
						</div>
					</div>
				</footer>
			</div>
		);
	}
}
export default App;
