import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";
import SubForum from "../SubForum";
import "../../../css/Forum.css";
import {
	getSubForumList,
	getThreadList,
	getNewestThreadList
} from "../API_Functions";
import { Thread } from "../Thread";
const MiniThreadView = props => {
	let { forumPath, subforumPath, threadData } = props;
	let date = new Date(threadData.lastModifiedTime);
	return (
		<div className="MiniThreadView">
			<div className="Date">{`${date.getDate()}/${date.getMonth()}`}</div>
			<div className="MiniThreadView_name">
				<Link to={`/${forumPath}/${subforumPath}/thread/${threadData.id}`}>
					{threadData.name}
				</Link>
			</div>
			<div className="MiniThreadView_rep">{threadData.threadNumber}</div>
			<div className="MiniThreadView_view">NA</div>
		</div>
	);
};
MiniThreadView.propTypes = {
	forumPath: PropTypes.string,
	subforumPath: PropTypes.string,
	threadData: PropTypes.object
};
//full forum view
class Forum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subforumList: []
		};
	}
	componentDidMount() {
		const { forumData } = this.props;
		getSubForumList(forumData.id)
			.then(
				subforumList => {
					return subforumList;
				},
				error => console.log(error)
			)
			.then(subforumList => {
				//create a copy of the subforumlist
				let subforumListCopy = subforumList.slice();
				//for each subforum, get its list of threads, use Promise.all to wait for
				//all Promises return by async functions inside the map function

				Promise.all(
					subforumListCopy.map(async subforum => {
						let threadList = await getNewestThreadList(subforum.id);
						//create a new object which includes the subforum data plus
						//threadList data for easy data display
						return Object.assign(
							{},
							{ ...subforum },
							{ threadList: threadList }
						);
					})
				).then(subforumListWithThreads => {
					this.setState({ subforumList: subforumListWithThreads });
				});
			});
	}
	render() {
		let { match, forumData, authData } = this.props;
		let subforums = this.state.subforumList;
		//create a list of subforum in the forum
		let SubforumList = subforums.map(subforum => {
			let MiniThreadViews = subforum.threadList.map(thread => (
				<MiniThreadView
					forumPath={forumData.path}
					subforumPath={subforum.path}
					key={thread.id}
					threadData={thread}
				/>
			));

			return (
				<div key={subforum.id}>
					<div className="title">
						<div className="topic">{subforum.name} </div>
						<div className="rep">REPLIES</div>
						<div className="views">VIEW</div>
					</div>

					{MiniThreadViews}
					<div className="more">
						<Link to={`/${forumData.path}/${subforum.path}`}>
							Go to {subforum.name} subforum
						</Link>
					</div>
					<hr />
				</div>
			);
		});
		let listOfSubForumRoutes = subforums.map(subforum => (
			<Route
				key={subforum.id}
				path={`${match.path}/${subforum.path}`}
				render={props => (
					<SubForum
						{...props}
						forumData={forumData}
						subforumData={subforum}
						authData={authData}
					/>
				)}
			/>
		));
		let ForumView = (
			<div>
				<div className="navigator">
					<Link to={"/"}>YAMEX</Link>
					-&gt;
					<Link to={`/${forumData.path}`}>{forumData.name}</Link>
				</div>
				<div className="forum_view">
					<h1>{forumData.name}</h1>
					{SubforumList}{" "}
				</div>
			</div>
		);

		return (
			<div className="tab">
				<Route exact path={`${match.path}`} render={() => ForumView} />
				<Switch>
					<Route
						exact
						path={"/:forumName/:subforumName/thread/:threadId"}
						render={props => <Thread authData={authData} {...props} />}
					/>

					{listOfSubForumRoutes}
				</Switch>

				{/*route for threads*/}
			</div>
		);
	}
}
Forum.propTypes = {
	match: {
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
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
	authData: PropTypes.object
};
export default Forum;
