import React, { Component } from "react";
import PropTypes from "prop-types";
import Collapsible from "react-collapsible";
import { Link, Route, Switch } from "react-router-dom";
import Forum from "../Forum";
import { URL, SERVER_API } from "../../Constants/API";
// const SubForumIconList = [
// 	"FAQ",
// 	"Accessories",
// 	"Prices",
// 	"Customize",
// 	"Buy or Sell",
// 	"Where to buy"
// ];

const MiniSubForumView = () => {
	return (
		<div className="subforum">
			<div className="subforum_info">
				<a href="forum.html">Subforum name</a>
				<p>This is a description</p>
			</div>
			<div className="no_thread_post">
				<span>Threads: </span> %number_thread
				<br />
				<span>Posts: </span> %number_post
			</div>
			<div className="first_unread_post">
				\ %fist_unread_post_name\
				<br />
				by <a href="#">Username</a>
				<br />
				dd,mm,yy hh:mm AM/PM
			</div>
		</div>
	);
};

const MiniForumView = props => {
	let { forumData } = props;
	return (
		<Collapsible
			trigger={
				<div className="trigger" id="forum1-trigger">
					<Link to={`/${forumData.path}`}>{forumData.name}</Link>
				</div>
			}
			open
			key={forumData.id}
		>
			<div id="wrapper" className="open">
				<div className="forum-content" id="forum1-content">
					<MiniSubForumView />
				</div>
			</div>
		</Collapsible>
	);
};

//Main will display the list of all forums on the site with their subforums
class Main extends Component {
	constructor(props) {
		super(props);
		this.getForumList = this.getForumList.bind(this);
		this.state = {
			isError: null,
			forumList: []
		};
	}

	async getForumList() {
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
	componentDidMount() {
		this.getForumList().then(
			forumList => {
				this.setState({ forumList: forumList });
			},
			error => {
				this.setState({ isError: true });
				console.log("Error while getting forum list: ", error);
			}
		);
	}

	render() {
		let { forumList, isError } = this.state;
		console.log("forumList", forumList);
		let listOfForum = null;
		let listOfForumRoute = null;
		if (isError) {
			return <div>There has been an error, please refresh the page</div>;
		} else if (forumList) {
			//create a list of minimal forum views
			listOfForum = forumList.map(forumData => (
				<MiniForumView forumData={forumData} key={forumData.id} />
			));
			//create a list of route for main forum view, e.g /honda-future
			console.log("before routes list", forumList);
			listOfForumRoute = forumList.map(forum => {
				return (
					<Route
						path={`/${forum.path}`}
						key={forum.id}
						//render={forum => <Forum forumData={forum} />}
						component={Forum}
					/>
				);
			});
			console.log("Forums: ", listOfForum);
			console.log("Routes: ", listOfForumRoute);
			return (
				<div>
					{listOfForum}
					{listOfForumRoute}
				</div>
			);
		}
	}
}
Main.propTypes = {
	match: {
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	}
};

// bikeInfo: null
// coverUrl: null
// createdTime: "2017-11-30T02:32:20.192Z"
// description: null
// id: "5a1f6db45a111d1a78bbc2aa"
// lastModifiedTime: "2017-11-30T02:32:20.192Z"
// moderators: null
// name: "Honda Future"
// path: "honda-future"
export default Main;
