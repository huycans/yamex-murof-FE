import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getThreadList } from "../API_Functions/index";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import { createThread } from "../API_Functions";
import EditorConvertToHTML from "../Editor";

const formatTime = time => {
	return `${time.getDate()}/${time.getMonth() +
		1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
};
class SubForum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			threadList: [],
			newThreadName: ""
		};
		this.createNewThread = this.createNewThread.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
		this.loadThreadsFromPageNum = this.loadThreadsFromPageNum.bind(this);
		this.submit = this.submit.bind(this);
		// this.createDummyThreads = this.createDummyThreads.bind(this);
	}

	// createDummyThreads() {
	// 	const { subforumData, authData } = this.props;
	// 	for (let i = 100; i < 200; i++) {
	// 		createThread("thread " + i, subforumData.id, "content content", authData);
	// 	}
	// }

	submit(htmlString) {
		console.log(htmlString);
		this.createNewThread(htmlString);
	}

	handlePageClick(data) {
		// history.push(
		// 	`${match.path.slice(0, match.path.lastIndexOf("/"))}/${data.selected + 1}`
		// );
		//window.location.reload();
		this.loadThreadsFromPageNum(data.selected + 1);
	}

	async createNewThread(threadContent) {
		try {
			const { newThreadName } = this.state;
			const { subforumData, authData } = this.props;
			let response = await createThread(
				newThreadName,
				subforumData.id,
				threadContent,
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

	async loadThreadsFromPageNum(pageNum) {
		//pageNum is a number used to load threadList from server
		//thread data are not passed to subforum, must be downloaded again
		const { subforumData } = this.props;
		const self = this;

		getThreadList(subforumData.id, pageNum).then(
			threadList => {
				console.log(threadList);
				//if there is no threads, return nothing
				if (!threadList) return;
				self.setState({ threadList: threadList });
			},
			error => console.log(error)
		);
	}

	componentWillMount() {
		//load the first page
		this.loadThreadsFromPageNum(1);
	}

	render() {
		const { match, forumData, authData, subforumData } = this.props;
		//the maximum page number of a subforum
		const maxPageNumber = subforumData.pageNumber;
		const { threadList, newThreadName, isModalOpen } = this.state;
		if (!threadList) return <p>Loading</p>;
		const customStyles = {
			content: {
				top: "50%",
				left: "50%",
				right: "auto",
				bottom: "auto",
				marginRight: "-50%",
				transform: "translate(-50%, -50%)",
				overflow: "scroll",
				height: "500px"
			}
		};
		const newThreadModal = (
			<Modal
				style={customStyles}
				isOpen={isModalOpen}
				contentLabel="newThreadModal"
			>
				<div>
					<h2>Enter information</h2>

					<input
						style={{ border: "1px black solid", color: "black" }}
						name="newThreadName"
						type="text"
						placeholder="Thread Name"
						value={newThreadName}
						onChange={this.handleInputChange}
					/>
					<EditorConvertToHTML submit={this.submit} />
					<button onClick={this.closeModal} style={{marginTop: "1em"}}>Close</button>
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
							<Link to={`${match.path}/thread/${thread.id}`}>
								{thread.name}
							</Link>
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
				{/*<button onClick={this.createDummyThreads}>createDummyThreads</button>*/}
				{newThreadModal}
				<div className="navigator">
					<Link to={"/"}>YAMEX</Link>
					<span>-&gt;</span>
					<Link to={`/${forumData.path}`}>{forumData.name}</Link>
					<span>-&gt;</span>
					<Link to={`/${forumData.path}/${subforumData.path}`}>
						{subforumData.name}
					</Link>
				</div>

				<div className="intro">{subforumData.description}</div>

				<div className="tools">
					{authData.sessionToken ? (
						<div className="new_thread">
							<button onClick={this.openModal}>New Thread</button>
						</div>
					) : null}
					<ReactPaginate
						initialPage={0}
						disableInitialCallback={true}
						previousLabel={"Previous"}
						nextLabel={"Next"}
						breakLabel={"..."}
						breakClassName={"break-me"}
						pageCount={maxPageNumber}
						marginPagesDisplayed={2}
						pageRangeDisplayed={3}
						onPageChange={this.handlePageClick}
						containerClassName={"no_pages"}
						activeClassName={"active"}
					/>
				</div>

				<div className="subforum_bar">
					<div className="subforum_name">{subforumData.name}</div>
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
	history: PropTypes.object,
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
