import React, { Component } from "react";
import Forum from "./Components/Forum";
import "../css/App.css";
import MainContent from "./Components/MainContent";
import { Route, Switch } from "react-router-dom";
import SubForum from "./Components/SubForum";
import Thread from "./Components/Thread";
import firebase from "./Components/Firebase/Firebase.js";
import { verifyToken } from "./Components/API_Functions";
import Modal from "react-modal";
import LoadingIcon from "./Components/LoadingIcon";

const CLIENT_ID_TOKEN = "clientIdToken";
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isSignedIn: false,
			email: "",
			password: "",
			errorMessage: ""
		};
		this.handleInputEmail = this.handleInputEmail.bind(this);
		this.handleInputPassword = this.handleInputPassword.bind(this);
		this.signup = this.signup.bind(this);
		this.login = this.login.bind(this);
		this.signout = this.signout.bind(this);
	}
	handleInputEmail(event) {
		this.setState({ email: event.target.value });
	}

	handleInputPassword(event) {
		this.setState({ password: event.target.value });
	}

	async login(method) {
		console.log("Logging in");
		console.log(method);
		this.setState({ isLoading: true });
		try {
			let { email, password } = this.state;
			let self = this;
			let clientIdToken = null;
			let fcmKey = null;
			console.log("Switching");
			switch (method) {
			case "facebook": //if user log in using facebook
				try {
					console.log("Logging in with facebook");
					let result = await firebase.auth().getRedirectResult();
					// The signed-in user info.
					let user = result.user;
					console.log("logged in");
					console.log(user);
					fcmKey = await firebase.messaging().getToken();
					clientIdToken = await user.getIdToken(true);
				} catch (error) {
					// Handle Errors here.
					let errorMessage = error.message;
					console.log(errorMessage);
					self.setState({ errorMessage: errorMessage });
				}
				break;

			case "google": //if user log in using google
				try {
					console.log("Logging in with google");
					let provider = new firebase.auth.GoogleAuthProvider();
					firebase.auth().languageCode = "en";
					let result = await firebase.auth().getRedirectResult();

					// The signed-in user info.
					let user = result.user;
					console.log("logged in");
					console.log(user);
					fcmKey = await firebase.messaging().getToken();
					clientIdToken = await user.getIdToken(true);
				} catch (error) {
					// Handle Errors here.
					let errorMessage = error.message;
					console.log(errorMessage);
					self.setState({ errorMessage: errorMessage });
				}
				break;

			case "email": //if user log in using email/password
				try {
					if (email === "" || password === "") return;
					console.log("Logging in with email");
					firebase.auth().signInWithEmailAndPassword(email, password);
				} catch (error) {
					// Handle Errors here.
					let errorMessage = error.message;
					console.log(errorMessage);
					self.setState({ errorMessage: errorMessage });
				}
				fcmKey = await firebase.messaging().getToken();
				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						console.log(user);
						//User signed in info
						user.getIdToken(true).then(function(token) {
							clientIdToken = token;
						});
					} else {
						console.log("No user is logged in");
					}
				});
				break;
			default:
				console.log("Not recognize log in method");
				break;
			}

			console.log("fcmKey: ", fcmKey);
			console.log("clientIdToken", clientIdToken);
			//verify token
			await verifyToken(clientIdToken, fcmKey);
			//setstate issignedin to true
			this.setState({ isSignedIn: true });
		} catch (error) {
			console.log(error);
		} finally {
			this.setState({ isLoading: false });
		}
	}

	signup() {
		let { email, password } = this.state;
		let self = this;
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.catch(function(error) {
				// Handle Errors here.
				let errorMessage = error.message;
				console.log(errorMessage);
				self.setState({ errorMessage: errorMessage });
			});
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				//Signed in user
				console.log(user);
				user.getIdToken(true).then(clientIdToken => {
					localStorage.setItem(CLIENT_ID_TOKEN, clientIdToken);
				});
			} else {
				console.log("No user is logged in");
			}
		});
	}

	signout() {
		firebase
			.auth()
			.signOut()
			.then(function() {
				// Sign-out successful.
				console.log("Sign-out successful.");
			})
			.catch(function(error) {
				// An error happened.
				console.log("Error while signout: ", error);
				this.setState({ errorMessage: "Error while signout" });
			});
	}

	componentDidMount() {
		console.log("Checking local storage");
		let clientIdToken = localStorage.getItem(CLIENT_ID_TOKEN);
		if (!clientIdToken) {
			//if there is no local cached clientIdToken
			this.setState({ isLoading: false, isSignedIn: false });
		} else {
			//if there is local cached clientIdToken
			this.setState({ isLoading: false, isSignedIn: true });
		}
	}

	render() {
		let { email, password, errorMessage, isLoading } = this.state;
		let errorDisplay = (
			<div
				style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}
			>
				{errorMessage}
			</div>
		);
		let LoadingModal = (
			<Modal isOpen={isLoading} contentLabel="LoadingModal">
				<div>
					Logging in...
					<LoadingIcon />
				</div>
			</Modal>
		);
		return (
			<div>
				{LoadingModal}
				<div className="wrap">
					<img src={require("../img/logo.png")} alt="Logo" />

					<div className="search-input">
						<input type="text" name="search" placeholder="Search.." />
					</div>

					<div className="login">
						<input
							type="text"
							name="username"
							placeholder="Username"
							value={email}
							onChange={this.handleInputEmail}
						/>

						<input
							type="text"
							name="pwd"
							placeholder="Password"
							value={password}
							onChange={this.handleInputPassword}
						/>

						<div className="login-section">
							<button
								className="button-login"
								onClick={() => this.login("email")}
							>
								Login
							</button>

							<button onClick={this.signup}>Sign up</button>
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
				</div>
				{errorDisplay}
				<Route path="/" component={MainContent} />
			</div>
		);
	}
}
//<Route path="/honda-future" render={() => <Forum />} />
export default App;
