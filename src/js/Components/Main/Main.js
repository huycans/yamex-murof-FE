import React from "react";
import PropTypes from "prop-types";
import Collapsible from "react-collapsible";
import { Link, Route } from "react-router-dom";

const SubForumIconList = [
	"FAQ",
	"Accessories",
	"Prices",
	"Customize",
	"Buy or Sell",
	"Where to buy"
];
const forumName = "Future";
const Main = ({ match }) => {
	const list = SubForumIconList.map(subName => (
		<div className="subforumicon" key={subName}>
			<Link to={`${forumName}/${subName}`} className="thumb">
				<img src={require("../../../img/square.png")} alt="Model" />
			</Link>
			<span>{subName}</span>
		</div>
	));
	return (
		<div>
			<Collapsible trigger={forumName} open>
				<div className="forum-content">{list}</div>

				<Link className="forum-link" to={`/${forumName}`}>
					{" "}
					Go to Full Forum
				</Link>
			</Collapsible>
		</div>
	);
};
Main.propTypes = {
	match: PropTypes.object
};
export default Main;
