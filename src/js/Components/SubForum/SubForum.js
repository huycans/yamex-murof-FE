import React, { Component } from "react";
import PropTypes from "prop-types";
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
class Subforum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: ""
		};
		this.handleSearchType = this.handleSearchType.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleSearchType(event) {
		this.setState({ searchText: event.target.value });
	}

	handleSearch() {
		console.log("click");
	}

	render() {
		let { match } = this.props;
		let threads = threadList.map(thread => (
			<div className="thread_container" key={thread.name}>
				<div className="thread_info">
					<div className="thread_name">
						<a href="#">{thread.name}</a>
					</div>
					<div className="thread_creator">
						Thread by : <a href="#">{thread.creator}</a>
					</div>
				</div>
				<div className="lasted_post">
					<div className="lasted_post_time">
						<a href="#">{thread.lasted_post_time}</a>
						<span> 10:46 PM</span>
					</div>
					<div className="lasted_post_owner">
						<span>by</span>
						<a href="#">{thread.lasted_post_owner} </a>
					</div>
				</div>
				<div className="no_rep_view">
					<a href="#">Replies: {thread.rep}</a>
					<br />
					<span>Views: {thread.views}</span>
				</div>
			</div>
		));
		return (
			<div>
				<div className="navigator">
					<a href="#">Yamex</a>
					<span>-&gt;</span>
					<a href="#">Forum Name</a>
					<span>-&gt;</span>
					<a href="#">Subforum Name</a>
				</div>

				<div className="intro">
					This is a description for the Subforum {match.params.subForumName}
				</div>

				<div className="tools">
					<div className="new_thread">
						<button>New Thread</button>
					</div>
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

export default Subforum;
