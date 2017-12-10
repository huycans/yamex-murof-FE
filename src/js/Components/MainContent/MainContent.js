import React, { Component } from "react";
import PropTypes from "prop-types";
import Collapsible from "react-collapsible";
import { Link, Route, Switch } from "react-router-dom";
import Forum from "../Forum";
import LoadingIcon from "../LoadingIcon";
import { getSubForumList, getForumList } from "../API_Functions";
// subforumData
// "id": "5a2405a1799a83547a3cb970",
// "createdTime": "2017-12-03T14:09:37.308Z",
// "lastModifiedTime": "2017-12-03T14:09:37.308Z",
// "name": "FAQ",
// "description": "Question",
// "forumId": "5a1ecb2b799a833ca2c7657a",
// "latestThread": null,
// "threadNumber": 0,
// "replyNumber": 0
const MiniSubForumView = props => {
	let { subforumData, forumPath } = props;
	return (
		<div className="subforum">
			<div className="subforum_info">
				<Link to={`${forumPath}/${subforumData.path}`}>
					{subforumData.name}
				</Link>
				<p>{subforumData.description}</p>
			</div>
			<div className="no_thread_post">
				<span>Threads: </span> {subforumData.threadNumber}
				<br />
				<span>Posts: </span> {subforumData.replyNumber}
			</div>
			{subforumData.latestThread === null ? (
				<div className="first_unread_post">
					{"null"}
					<br />
					by <div>{"null"}</div>
					<br />
					{"null"}
				</div>
			) : (
				<div className="first_unread_post">
					{subforumData.latestThread.name}
					<br />
					by{" "}
					<Link to={`/user/${subforumData.latestThread.author.id}`}>
						{subforumData.latestThread.author.username}
					</Link>
					<br />
					{subforumData.latestThread.createdTime}
				</div>
			)}
		</div>
	);
};

MiniSubForumView.propTypes = {
	subforumData: PropTypes.object,
	match: PropTypes.object,
	forumPath: PropTypes.string
};

class MiniForumView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subforumList: []
		};
	}
	componentDidMount() {
		let { forum } = this.props;
		getSubForumList(forum.id).then(
			subforumList => {
				this.setState({ subforumList: subforumList });
			},
			error => console.log(error)
		);
	}
	render() {
		let { forum, match } = this.props;
		let { subforumList } = this.state;
		//create a list of mini (small) subforums of each forum
		let MiniSubForumViewList = subforumList.map(subforum => (
			<MiniSubForumView
				forumPath={forum.path}
				subforumData={subforum}
				{...this.props}
				key={subforum.id}
			/>
		));

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
						{MiniSubForumViewList}
					</div>
				</div>
			</Collapsible>
		);
	}
}

MiniForumView.propTypes = {
	forum: PropTypes.object,
	match: PropTypes.object
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
	}

	componentDidMount() {
		getForumList().then(
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

		//if the component is loading display LoadingIcon component
		if (isLoading)
			return (
				<div>
					<LoadingIcon />
				</div>
			);
		//if there is an error display this error message
		if (isError) {
			return (
				<div>
					<div>There has been an error, please refresh the page</div>
				</div>
			);
		}

		let listOfForum = null;
		let listOfForumRoute = null;
		//create a list of mini (small) peak of the forums in the site
		listOfForum = forumList.map(forum => (
			<MiniForumView forum={forum} match={match} key={forum.id} />
		));
		//create a list of routes to go to each forum
		listOfForumRoute = forumList.map(forum => (
			<Route
				path={`${match.path}${forum.path}`}
				key={forum.id}
				render={props => (
					<Forum {...props} forumData={forum} authData={this.props.authData} />
				)}
				// component={Forum}
			/>
		));

		return (
			<div>
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
	listOfForumRoute: PropTypes.array,
	authData: PropTypes.object
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
