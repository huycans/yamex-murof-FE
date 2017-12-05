import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
const threadList = [
	{
		name: "thread 1",
		creator: "User",
		lasted_post_time: "17th June 2014",
		lasted_post_owner: "Dinh Cong Manh",
		rep: 200,
		views: 300
	}
];
class SubForum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: ""
		};
		this.handleSearchType = this.handleSearchType.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.createNewThread = this.createNewThread.bind(this);
	}

	handleSearchType(event) {
		this.setState({ searchText: event.target.value });
	}

	handleSearch() {
		console.log("click");
	}

	createNewThread() {}

	render() {
		let { match, forumData, userData, subForumData } = this.props;
		let threads = threadList.map(thread => (
			<div className="thread_container" key={thread.name}>
				<div className="thread_info">
					<div className="thread_name">
						<Link to={`${match.path}`}>{thread.name}</Link>
					</div>
					<div className="thread_creator">
						Thread by : <Link to={`${match.path}`}>{thread.creator}</Link>
					</div>
				</div>
				<div className="lasted_post">
					<div className="lasted_post_time">
						<Link to={`${match.path}`}>{thread.lasted_post_time}</Link>
						<span> 10:46 PM</span>
					</div>
					<div className="lasted_post_owner">
						<span>by</span>
						<Link to={`${match.path}`}>{thread.lasted_post_owner} </Link>
					</div>
				</div>
				<div className="no_rep_view">
					<Link to={`${match.path}`}>Replies: {thread.rep}</Link>
					<span>Views: {thread.views}</span>
				</div>
			</div>
		));
		return (
			<div>
				<div className="navigator">
					<Link to={`/${forumData.path}`}>{forumData.name}</Link>
					<span>-&gt;</span>
					<Link to={`/${forumData.path}/${subForumData.path}`}>
						{subForumData.name}
					</Link>
				</div>

				<div className="intro">{subForumData.description}</div>

				<div className="tools">
					{userData ? (
						<div className="new_thread">
							<button onClick={() => this.createNewThread}>New Thread</button>
						</div>
					) : null}
					<div className="no_pages">
						<a href="#">1</a>
						<a href="#">2</a>
						<a href="#">3</a>
						<a href="#">11</a>
						<a href="#">></a>
						<a href="#">Last &gt;&gt;</a>
					</div>
				</div>

				<div className="subforum_bar">
					<div className="subforum_name">Subforum Name</div>
					<div className="search_bar">
						<input
							type="text"
							placeholder="Search.."
							name="search"
							onChange={this.handleSearchType}
						/>
						<button type="submit" onClick={this.handleSearch}>
							<i className="fa fa-search" />
						</button>
					</div>
				</div>
				{threads}
			</div>
		);
	}
}
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
SubForum.propTypes = {
	match: {
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	},
	subForumData: {
		id: PropTypes.string,
		createdTime: PropTypes.string,
		lastModifiedTime: PropTypes.string,
		name: PropTypes.string,
		description: PropTypes.string,
		forumId: PropTypes.string,
		latestThread: PropTypes.object,
		threadNumber: PropTypes.number,
		replyNumber: PropTypes.number
	},
	forumData: {
		bikeInfo: PropTypes.string,
		coverUrl: PropTypes.string,
		createdTime: PropTypes.string,
		description: PropTypes.string,
		id: PropTypes.string,
		lastModifiedTime: PropTypes.string,
		moderators: PropTypes.arrayOf(PropTypes.string),
		name: PropTypes.string,
		path: PropTypes.string
	},
	userData: PropTypes.object
};
export default SubForum;
