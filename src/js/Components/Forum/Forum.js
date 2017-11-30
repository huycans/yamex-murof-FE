import React, { Component } from "react";
import PropTypes, { string } from "prop-types";
import { Link, Route } from "react-router-dom";
import SubForum from "../SubForum";
import "../../../css/Forum.css";

const SingleTopic = props => {
	let { date, name, rep, view } = props.topicInfo;
	return (
		<div className="singleTopic">
			<div className="Date">{date}</div>
			<div className="singleTopic_name">
				<a href="#">{name}</a>
			</div>
			<div className="singleTopic_rep">{rep}</div>
			<div className="singleTopic_view">{view}</div>
		</div>
	);
};
SingleTopic.propTypes = {
	topicInfo: PropTypes.object
};
//full forum view
class Forum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//placeholders for subforum data
			subforum: [
				{
					date: "20/10",
					name: "FAQ",
					rep: 100,
					view: 400
				},
				{
					date: "30/10",
					name: "Accessories",
					rep: 100,
					view: 400
				},
				{
					date: "40/10",
					name: "Prices",
					rep: 100,
					view: 400
				},
				{
					date: "20/33",
					name: "Customize",
					rep: 100,
					view: 444
				}
			]
		};
	}
	render() {
		//let { forumData, match } = this.props;
		let { match } = this.props;
		let subforums = this.state.subforum;
		console.log(typeof match);
		return (
			<div className="tab">
				<div className="title">
					<div className="topic">{match.path}</div>
					<div className="rep">REPLIES</div>
					<div className="views">VIEW</div>
				</div>
				<SingleTopic topicInfo={subforums[0]} />
				<SingleTopic topicInfo={subforums[1]} />
				<SingleTopic topicInfo={subforums[2]} />
				<SingleTopic topicInfo={subforums[3]} />
				<div className="more">
					<a href="#">More about this things bla bla</a>
				</div>
				<hr />
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
		moderators: PropTypes.arrayOf(string),
		name: PropTypes.string,
		path: PropTypes.string
	}
};
export default Forum;
