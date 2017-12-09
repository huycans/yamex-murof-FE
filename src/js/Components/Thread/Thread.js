import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import {
	getReplyList,
	getThreadData,
	sendReply,
	sendThank
} from "../API_Functions";
import Modal from "react-modal";
const formatTime = time => {
	return `${time.getDate()}/${time.getMonth() +
		1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
};
class Thread extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			thread: null,
			replies: [],
			errorMessage: "",
			newReplyContent: "",
			isModalOpen: false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleType = this.handleType.bind(this);
		this.thank = this.thank.bind(this);
		this.reply = this.reply.bind(this);
	}

	handleType(event) {
		this.setState({ newReplyContent: event.target.value });
	}

	openModal() {
		const { authData } = this.props;
		if (!authData.sessionToken) {
			alert("You're not logging in");
			return;
		}
		this.setState({ isModalOpen: true });
	}

	closeModal() {
		this.setState({
			isModalOpen: false,
			newReplyContent: ""
		});
	}

	async reply() {
		try {
			const { authData } = this.props;
			const { newReplyContent, thread } = this.state;
			await sendReply(authData, newReplyContent, thread.id);
			this.setState({ isModalOpen: false });
			window.location.reload();
		} catch (error) {
			this.setState({ errorMessage: error });
		}
	}

	async thank(rid) {
		try {
			console.log(rid);
			const { authData } = this.props;
			if (!authData.sessionToken) {
				alert("You're not logging in");
				return;
			}
			await sendThank(authData, rid);
		} catch (error) {
			this.setState({ errorMessage: error });
		}
	}

	componentDidMount() {
		try {
			console.log("Getting replies");
			//loading thread is just loading replies in that thread
			this.setState({ isLoading: true });
			const { match } = this.props;
			const pageNum = match.params.pageNum ? match.params.pageNum : 1;
			getReplyList(match.params.threadId, pageNum).then(replies => {
				console.log(replies);
				this.setState({ replies: replies });
			});

			getThreadData(match.params.threadId).then(thread => {
				console.log(thread);
				this.setState({ thread: thread });
			});
		} catch (error) {
			console.log(error);
			this.setState({ errorMessage: error });
		} finally {
			this.setState({ isLoading: false });
		}
	}

	render() {
		const { match, authData } = this.props;
		const {
			replies,
			errorMessage,
			isLoading,
			thread,
			isModalOpen,
			newReplyContent
		} = this.state;

		if (!replies || !thread) return null;
		//tool bar to thank and reply to posts
		const RepToolBar = props => {
			if (props.reply)
				return (
					<div className="rep_quickrep_tool">
						<div className="no_thank">
							{props.reply.thankedList.length} people thank this
						</div>
						<button onClick={this.openModal}>Reply</button>
						<button onClick={() => this.thank(props.reply.id)}>Thanks</button>
					</div>
				);
			else return;
		};

		//navbar that display the path to the thread
		const NavBar = (
			<div className="navigator">
				<Link to={"/"}>YAMEX</Link>
				-&gt;
				<Link to={`/${match.params.forumName}`}>{match.params.forumName}</Link>
				-&gt;
				<Link to={`/${match.params.forumName}/${match.params.subforumName}`}>
					{match.params.subforumName}
				</Link>
				-&gt;
				<Link
					to={`/${match.params.forumName}/${match.params.subforumName}/${
						match.params.threadId
					}`}
				>
					{thread.name}
				</Link>
			</div>
		);

		const ThreadHeader = (
			<div className="thread_header">
				<div className="user_avatar">
					<img src={thread.author.avatarUrl} alt="user_avatar" />
				</div>
				<div className="thread_header_info">
					<div className="thread_name">{thread.name}</div>
					<div className="thread_creator">
						By{" "}
						<Link to={`/user/${thread.author.id}`}>
							{thread.author.username}
						</Link>, Member on {formatTime(new Date(thread.author.createdTime))}
					</div>
				</div>
			</div>
		);

		const repliesListView = replies.map((reply, index) => {
			if (index === 0) {
				//display for the first reply, which is created by thread creator
				return (
					<div key={reply.id}>
						<div className="thread_content">
							<p>{reply.content}</p>
						</div>
						<RepToolBar reply={reply} />
					</div>
				);
				//display for all other replies
			} else {
				return (
					<div key={reply.id}>
						<div className="post_reply">
							<div className="user_post_rep">
								<div className="post_user">
									<Link to={`/user/${reply.author.id}`}>
										{reply.author.username}
									</Link>
								</div>
								<div className="post_info">
									{formatTime(new Date(reply.createdTime))}
								</div>
							</div>
							<div className="post_content">
								<div className="post_user_content">
									<img src={reply.author.avatarUrl} alt="user_avatar" />

									<div className="user_title">Role: {reply.author.role}</div>
								</div>
								<div className="post_rep_content">
									<p>{reply.content}</p>
								</div>
							</div>
						</div>
						<RepToolBar reply={reply} />
					</div>
				);
			}
		});

		let errorDisplay = (
			<div
				style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}
			>
				{errorMessage}
			</div>
		);

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

		let newReplyModal = (
			<Modal
				style={customStyles}
				isOpen={isModalOpen}
				contentLabel="newThreadModal"
			>
				<div style={{ flex: 1, flexDirection: "column" }}>
					<h2>Enter information</h2>
					<textarea
						name="newThreadContent"
						type="text"
						placeholder="Content"
						value={newReplyContent}
						onChange={this.handleType}
					/>
					<button onClick={this.reply}>Submit</button>
					<button onClick={this.closeModal}>Close</button>
				</div>
			</Modal>
		);

		if (isLoading) return <div />;
		else
			return (
				<div>
					{newReplyModal}
					{NavBar}
					{ThreadHeader}
					{errorDisplay}
					<div className="thread_bar">
						{authData.sessionToken ? (
							<button className="rep" onClick={this.openModal}>
								Post Reply
							</button>
						) : null}

						<div className="search_bar">
							<input type="text" placeholder="Search thread.." name="search" />
							<input
								type="image"
								alt="search_icon"
								src={require("../../../img/search.png")}
								onClick={() => {}}
							/>
						</div>
						<div className="no_pages search_no">
							<a href="#">1</a>
							<a href="#">2</a>
							<a href="#">3</a>
							<a href="#">11</a>
							<a href="#">&gt;</a>
							<a href="#">Last &gt;&gt;</a>
						</div>
					</div>

					{repliesListView}
				</div>
			);
	}
}
Thread.propTypes = {
	match: PropTypes.object,
	authData: PropTypes.object
};
export default Thread;
