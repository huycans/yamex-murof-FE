import React, { Component } from "react";
import PropTypes, { string } from "prop-types";
import { Link, Route } from "react-router-dom";
import SubForum from "../SubForum";
import "../../../css/Forum.css";
import { getSubForumList } from "../API_Functions";

const MiniThreadView = props => {
	let { forumPath, subforumData } = props;
	let date = new Date(subforumData.lastModifiedTime);
	return (
		<div className="MiniThreadView">
			<div className="Date">{`${date.getDate()}/${date.getMonth()}`}</div>
			<div className="MiniThreadView_name">
				<Link to={`/${forumPath}/${subforumData.path}`}>
					{subforumData.name}
				</Link>
			</div>
			<div className="MiniThreadView_rep">{subforumData.threadNumber}</div>
			<div className="MiniThreadView_view">chua co</div>
		</div>
	);
};
MiniThreadView.propTypes = {
	forumPath: PropTypes.string,
	subforumData: PropTypes.object
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
		let { forumData } = this.props;
		getSubForumList(forumData.id).then(
			subforumList => {
				this.setState({ subforumList: subforumList });
			},
			error => console.log(error)
		);
	}
	render() {
		let { match, forumData } = this.props;
		let subforums = this.state.subforumList;
		//TODO: add thread views
		//create a list of subforum in the forum
		let SubforumList = subforums.map(subforum => (
			<div key={subforum.id}>
				<div className="title">
					<div className="topic">{subforum.name} </div>
					<div className="rep">REPLIES</div>
					<div className="views">VIEW</div>
				</div>

				{"thread list"}
				<div className="more">
					<Link to={`/${forumData.path}/${subforum.path}`}>
						Go to {subforum.name} subforum
					</Link>
				</div>
				<hr />
			</div>
		));
		let listOfSubForumRoutes = subforums.map(subforum => (
			<Route
				key={subforum.id}
				path={`${match.path}/${subforum.path}`}
				render={props => (
					<SubForum
						{...props}
						forumData={forumData}
						subForumData={subforum}
						userData={this.props.userData}
					/>
				)}
			/>
		));
		let ForumView = (
			<div>
				<h1>{forumData.name}</h1>
				{SubforumList}{" "}
			</div>
		);
		// <Subforum
		// 	forumPath={forumData.path}
		// 	subforumData={subforum}
		// 	{...this.props}
		// 	key={subforum.id}
		// />

		//SubForum should have a list of threads
		return (
			<div className="tab">
				<Route exact path={`${match.path}`} render={() => ForumView} />
				{listOfSubForumRoutes}
			</div>
		);
	}
}
Forum.propTypes = {
	match: PropTypes.objectOf({
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	}),
	forumData: PropTypes.objectOf({
		bikeInfo: PropTypes.string,
		coverUrl: PropTypes.string,
		createdTime: PropTypes.string,
		description: PropTypes.string,
		id: PropTypes.string,
		lastModifiedTime: PropTypes.string,
		moderators: PropTypes.arrayOf(PropTypes.string),
		name: PropTypes.string,
		path: PropTypes.string
	}),
	userData: PropTypes.object
};
export default Forum;
