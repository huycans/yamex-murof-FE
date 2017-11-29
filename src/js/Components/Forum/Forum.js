import React, { Component } from "react";
import PropTypes from "prop-types";
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

class Forum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			topicList: [
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
		let topicList = this.state.topicList;
		let match = this.props.match;
		console.log(this.props);
		return (
			<div className="tab">
				<div className="title">
					<div className="topic">FORUM</div>
					<div className="rep">REPLIES</div>
					<div className="views">VIEW</div>
				</div>
				<SingleTopic topicInfo={topicList[0]} />
				<SingleTopic topicInfo={topicList[1]} />
				<SingleTopic topicInfo={topicList[2]} />
				<SingleTopic topicInfo={topicList[3]} />
				<div className="more">
					<a href="#">More about this things bla bla</a>
				</div>
			</div>
		);
	}
}

export default Forum;
