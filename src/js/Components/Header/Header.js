import React, { Component } from "react";

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: ""
		};
		this.handleInputEmail = this.handleInputEmail.bind(this);
		this.handleInputPassword = this.handleInputPassword.bind(this);
		this.loginEmail = this.loginEmail.bind(this);
		this.loginFB = this.loginFB.bind(this);
		this.loginGoogle = this.loginGoogle.bind(this);
		this.signup = this.signup.bind(this);
	}

	handleInputEmail(event) {
		this.setState({ email: event.target.value });
	}

	handleInputPassword(event) {
		this.setState({ password: event.target.value });
	}
	//these action are forwarded to App.js to process
	loginEmail() {
		console.log("click");
	}
	loginFB() {
		console.log("click");
	}
	loginGoogle() {
		console.log("click");
	}
	signup() {
		console.log("click");
	}
	render() {
		let { email, password } = this.state;
		console.log(email, " ", password);
		return (
			<div className="wrap">
				<img src={require("../../../img/logo.png")} alt="Logo" />

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
						<button className="button-login" onClick={this.loginEmail}>
							Login
						</button>

						<button onClick={this.signup}>Sign up</button>

						<img
							src={require("../../../img/facebook.png")}
							alt="fb logo"
							onClick={this.loginFB}
							onKeyPress={this.loginFB}
						/>

						<img
							src={require("../../../img/google-plus.png")}
							alt="google logo"
							onClick={this.loginGoogle}
							onKeyPress={this.loginFB}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;
