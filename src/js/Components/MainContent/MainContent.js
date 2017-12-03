import React, { Component } from "react";
import PropTypes from "prop-types";
import Collapsible from "react-collapsible";
import { Link, Route, Switch } from "react-router-dom";
import Forum from "../Forum";
import { URL, SERVER_API } from "../../Constants/API";
import LoadingIcon from "../LoadingIcon";
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
	let { forum, match } = props;
	return (
		<Collapsible
			trigger={
				<div className="trigger" id="forum1-trigger">
					<Link to={`${match.url}${forum.path}`}>{forum.name}</Link>
				</div>
			}
			open
			key={forum.id}
		>
			<div id="wrapper" className="open">
				<div className="forum-content" id="forum1-content">
					<MiniSubForumView />
				</div>
			</div>
		</Collapsible>
	);
};
MiniForumView.propTypes = {
	forum: PropTypes.arrayOf(PropTypes.object)
};
//MainContent will display the list of all forums on the site with their subforums
class MainContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isError: null,
			forumList: [],
			isLoading: true
		};
		this.getForumList = this.getForumList.bind(this);
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
				this.setState({ isLoading: false, forumList: forumList });
			},
			error => {
				this.setState({ isLoading: false, isError: true });
				console.log("Error while getting forum list: ", error);
			}
		);
	}
	render() {
		let { forumList, isError, isLoading } = this.state;
		let { match } = this.props;
		console.log("forumList", forumList);

		if (isLoading)
			return (
				<div>
					<LoadingIcon />
				</div>
			);
		if (isError) {
			return (
				<div>
					<div>There has been an error, please refresh the page</div>
				</div>
			);
		}

		let listOfForum = null;
		let listOfForumRoute = null;

		listOfForum = forumList.map(forum => (
			<MiniForumView forum={forum} match={match} key={forum.id} />
		));
		listOfForumRoute = forumList.map(forum => (
			<Route
				exact
				path={`${match.path}${forum.path}`}
				key={forum.id}
				// render={(forum, props) => <Forum {...props} forumData={forum} />}
				component={Forum}
			/>
		));

		return (
			<div>
				<Link to="/honda-future">future</Link>
				<Switch>
					<Route exact path="/" render={() => listOfForum} />
					{listOfForumRoute}
				</Switch>
			</div>
		);
	}
}

MainContent.propTypes = {
	match: {
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	},
	forumList: PropTypes.array,
	listOfForumRoute: PropTypes.array
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
export default MainContent;
