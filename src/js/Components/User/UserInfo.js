import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import { getUserInfo } from "../API_Functions";
const formatTime = time => {
	return `${time.getDate()}/${time.getMonth() +
		1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
};
class UserInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userInfo: null
		};
	}

	componentDidMount() {
		console.log("Loading user data");
		const { match } = this.props;
		getUserInfo(match.params.userId).then(
			user => {
				this.setState({ userInfo: user });
			},
			error => {
				console.log(error);
			}
		);
	}

	render() {
		let { userInfo } = this.state;
		if (!userInfo) return null;
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
								<b>No posts:</b> %post%
							</div>
							<div className="no_tks">
								<b>No thanks:</b> %thanks%
							</div>
						</div>
						<div className="contact">
							<div className="email">
								<b>Email:</b> {userInfo.email}
							</div>
						</div>
					</div>
				</div>
			);
	}
}
UserInfo.propTypes = {
	match: PropTypes.object
};
export { UserInfo };
