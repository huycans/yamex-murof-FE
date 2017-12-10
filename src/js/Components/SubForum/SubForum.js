import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import { getThreadList } from "../API_Functions/index";
import Modal from "react-modal";
import { createThread } from "../API_Functions";
const formatTime = time => {
	return `${time.getDate()}/${time.getMonth() +
		1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
};
class SubForum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: "",
			threadList: [],
			newThreadName: "",
			newThreadContent: ""
		};
		this.handleSearchType = this.handleSearchType.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.createNewThread = this.createNewThread.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	handleSearchType(event) {
		this.setState({ searchText: event.target.value });
	}

	handleSearch() {
		console.log("click");
	}

	async createNewThread() {
		try {
			const { newThreadName, newThreadContent } = this.state;
			const { subforumData, authData } = this.props;
			let response = await createThread(
				newThreadName,
				subforumData.id,
				newThreadContent,
				authData
			);
			window.location.reload();
			if (response !== 1) throw Error("Error while creating thread");
		} catch (error) {
			console.log("Error while creating thread: ", error);
		} finally {
			this.closeModal();
		}
	}

	handleInputChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]: value
		});
	}

	openModal() {
		this.setState({ isModalOpen: true });
	}

	closeModal() {
		this.setState({
			isModalOpen: false,
			newThreadName: "",
			newThreadContent: ""
		});
	}

	componentWillMount() {
		//thread data are not passed to subforum, must be downloaded again
		const { subforumData, match } = this.props;
		const self = this;
		const pageNum = match.params.pageNum ? match.params.pageNum : 1;
		getThreadList(subforumData.id, pageNum).then(
			threadList => {
				self.setState({ threadList: threadList });
			},
			error => console.log(error)
		);
	}

	render() {
		const { match, forumData, authData, subforumData } = this.props;

		const {
			threadList,
			newThreadName,
			newThreadContent,
			isModalOpen
		} = this.state;
		const customStyles = {
			content: {
				top: "50%",
				left: "50%",
				right: "auto",
				bottom: "auto",
				marginRight: "-50%",
				transform: "translate(-50%, -50%)"
			}
		};
		const newThreadModal = (
			<Modal
				style={customStyles}
				isOpen={isModalOpen}
				contentLabel="newThreadModal"
			>
				<div style={{ flex: 1, flexDirection: "column" }}>
					<h2>Enter information</h2>
					<input
						style={{ border: "1px black solid", color: "black" }}
						name="newThreadName"
						type="text"
						placeholder="Thread Name"
						value={newThreadName}
						onChange={this.handleInputChange}
					/>
					<textarea
						name="newThreadContent"
						type="text"
						placeholder="Content"
						value={newThreadContent}
						onChange={this.handleInputChange}
					/>
					<button onClick={this.createNewThread}>Submit</button>
					<button onClick={this.closeModal}>Close</button>
				</div>
			</Modal>
		);
		const threads = threadList.map(thread => {
			const lastModifiedTime = new Date(thread.lastModifiedTime);
			const formattedTime = formatTime(lastModifiedTime);
			return (
				<div className="thread_container" key={thread.id}>
					<div className="thread_info">
						<div className="thread_name">
							<Link to={`${match.path}/${thread.id}`}>{thread.name}</Link>
						</div>
						<div className="thread_creator">
							Thread by :{" "}
							<Link to={`/user/${thread.author.id}`}>
								{thread.author.username}
							</Link>
						</div>
					</div>
					<div className="lasted_post">
						<div className="lasted_post_time">
							<span>{formattedTime}</span>
						</div>
						<div className="lasted_post_owner">
							<span>by </span>
							<Link to={`/user/${thread.latestReply.author.id}`}>
								{thread.latestReply.author.username}{" "}
							</Link>
						</div>
					</div>
					<div className="no_rep_view">
						<span>Replies: {thread.replyNumber}</span>
						<span>Views: {thread.viewNumber}</span>
					</div>
				</div>
			);
		});
		return (
			<div>
				{newThreadModal}
				<div className="navigator">
					<Link to={"/"}>YAMEX</Link>
					<span>-&gt;</span>
					<Link to={`/${forumData.path}`}>{forumData.name}</Link>
					<span>-&gt;</span>
					<Link to={`/${match.path}`}>{subforumData.name}</Link>
				</div>

				<div className="intro">{subforumData.description}</div>

				<div className="tools">
					{authData.sessionToken ? (
						<div className="new_thread">
							<button onClick={this.openModal}>New Thread</button>
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
					<div className="subforum_name">{subforumData.name}</div>
					<div className="search_bar">
						<input
							type="text"
							placeholder="Search.."
							name="search"
							onChange={this.handleSearchType}
						/>

						<img src= {require("../../../img/search.svg")}  onClick={this.handleSearch}/>

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
//added by forum "threadList" : []
SubForum.propTypes = {
	match: {
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	},
	subforumData: {
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
	authData: PropTypes.object
};
export default SubForum;
