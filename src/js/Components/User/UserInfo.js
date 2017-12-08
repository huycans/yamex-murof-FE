import React, { Component } from "react";
import PropTypes from "prop-types";
import { getUserInfo } from "../API_Functions";
import { updateUserInfo } from "../API_Functions";
const formatTime = time => {
	return `${time.getDate()}/${time.getMonth() +
		1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
};
class UserInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userInfo: null,
			avatarUrl: "",
			favoriteBike: "",
			username: "",
			errorMessage: "",
			isUpdateSuccess: false,
			isUpdating: false
		};
		this.handleChangeValue = this.handleChangeValue.bind(this);
		this.updateUser = this.updateUser.bind(this);
	}

	handleChangeValue(event) {
		let targetName = event.target.name;
		this.setState({ [targetName]: event.target.value });
	}

	componentDidMount() {
		console.log("Loading user data");
		const { match } = this.props;
		getUserInfo(match.params.userId).then(
			user => {
				this.setState({
					userInfo: user,
					avatarUrl: user.avatarUrl,
					favoriteBike: user.favoriteBike,
					username: user.username
				});
			},
			error => {
				console.log(error);
			}
		);
	}

	async updateUser() {
		let { authData } = this.props;
		try {
			this.setState({ isUpdating: true });
			let { avatarUrl, favoriteBike, username } = this.state;
			if (avatarUrl === "" && favoriteBike === "" && username === "") return;
			else {
				let body = {
					avatarUrl: avatarUrl,
					favoriteBike: favoriteBike,
					username: username
				};
				await updateUserInfo(authData, body);
				this.setState({
					isUpdateSuccess: true
				});
				window.location.reload();
			}
		} catch (error) {
			this.setState({ errorMessage: error });
		} finally {
			this.setState({ isUpdating: false });
		}
	}

	render() {
		const {
			userInfo,
			avatarUrl,
			favoriteBike,
			username,
			errorMessage,
			isUpdateSuccess,
			isUpdating
		} = this.state;
		const { authData, match } = this.props;
		const errorDisplay = (
			<div
				style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}
			>
				{errorMessage}
			</div>
		);
		const succesDisplay = isUpdateSuccess ? (
			<div style={{ backgroundColor: "green" }}>Update success</div>
		) : (
			<div />
		);

		if (!userInfo) return null;
		else if (errorMessage) return { errorDisplay };
		else
			return (
				<div className="container">
					<div className="user">
						<img src={userInfo.avatarUrl} alt="avatar" />
						<div className="user_info">
							<div className="user_name">{userInfo.username}</div>
							<div className="user_title">Role: {userInfo.role}</div>
							<div className="status">
								Last online: {formatTime(new Date(userInfo.lastLogin))}
							</div>
						</div>
					</div>
					<div className="user_about">
						<div className="fav_bike">
							<b>Favorite bike: </b>
							{userInfo.favoriteBike}
						</div>
						<div className="statistic">
							<div className="no_post">
								<b>No posts:</b> {userInfo.replyNumber}
							</div>
							<div className="no_tks">
								<b>No thanks:</b> {userInfo.thankedNumber}
							</div>
						</div>
						<div className="contact">
							<div className="email">
								<b>Email:</b> {userInfo.email}
							</div>
						</div>
					</div>
					{authData.userId === match.params.userId ? (
						<div>
							<h4>Change your info</h4>
							<label htmlFor="avatarUrl">Avatar url: </label>
							<input
								id="avatarUrl"
								value={avatarUrl}
								name="avatarUrl"
								onChange={this.handleChangeValue}
							/>
							<br />
							<label htmlFor="favoriteBike">Favorite Bike: </label>
							<input
								id="favoriteBike"
								value={favoriteBike}
								name="favoriteBike"
								onChange={this.handleChangeValue}
							/>
							<br />
							<label htmlFor="username">Username: </label>
							<input
								id="username"
								value={username}
								name="username"
								onChange={this.handleChangeValue}
							/>
							<br />
							<button disabled={isUpdating} onClick={this.updateUser}>
								Submit
							</button>
							{succesDisplay}
						</div>
					) : null}
				</div>
			);
	}
}
UserInfo.propTypes = {
	match: PropTypes.object,
	authData: PropTypes.object
};
export { UserInfo };
