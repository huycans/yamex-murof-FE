import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { getReplyList, getThreadData, sendReply, sendThank } from "../API_Functions"
import Modal from "react-modal"
import ReactPaginate from "react-paginate"
import EditorConvertToHTML from "../Editor"
const formatTime = time => {
  return `${time.getDate()}/${time.getMonth() +
    1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`
}

class Thread extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      thread: null,
      replies: [],
      errorMessage: "",
      isModalOpen: false,
      current: null,
      pages: null
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleType = this.handleType.bind(this)
    this.thank = this.thank.bind(this)
    this.reply = this.reply.bind(this)
    this.loadRepliesFromPageNum = this.loadRepliesFromPageNum.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    // this.createDummyThreads = this.createDummyThreads.bind(this);
    this.submit = this.submit.bind(this)
  }

  submit(htmlString) {
    this.reply(htmlString)
  }

  // createDummyThreads() {
  // 	const { authData } = this.props;
  // 	const { thread } = this.state;
  // 	for (let index = 0; index < 200; index++) {
  // 		sendReply(authData, "content", thread.id);
  // 	}
  // }

  handleType(event) {
    this.setState({ newReplyContent: event.target.value })
  }

  openModal() {
    const { authData } = this.props
    if (!authData.sessionToken) {
      alert("You're not logging in")
      return
    }
    this.setState({ isModalOpen: true })
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
      newReplyContent: ""
    })
  }

  async reply(newReplyContent) {
    try {
      const { authData } = this.props
      const { thread } = this.state
      await sendReply(authData, newReplyContent, thread.id)
      this.setState({ isModalOpen: false })
      window.location.reload()
    } catch (error) {
      this.setState({ errorMessage: error })
    }
  }

  async thank(rid) {
    try {
      console.log(rid)
      const { authData } = this.props
      if (!authData.sessionToken) {
        alert("You're not logging in")
        return
      }
      await sendThank(authData, rid)
    } catch (error) {
      this.setState({ errorMessage: error })
    }
  }

  handlePageClick(data) {
    this.loadRepliesFromPageNum(data.selected + 1)
  }

  async loadRepliesFromPageNum(pageNum) {
    try {
      //loading thread is just loading replies in that thread
      this.setState({ isLoading: true })
      const { match } = this.props
      console.log(match.params, pageNum)
      getReplyList(match.params.threadId, pageNum).then(({replies, current, pages}) => {
        this.setState({ replies, current, pages })
      })
    } catch (error) {
      console.log(error)
      this.setState({ errorMessage: error })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount() {
    const { match } = this.props
    getThreadData(match.params.threadId).then(thread => {
      console.log(thread)
      this.setState({ thread: thread })
    })
    this.loadRepliesFromPageNum(1)
  }

  render() {
    const { match, authData } = this.props
    const { replies, errorMessage, isLoading, thread, isModalOpen, current, pages } = this.state

    if (!replies || !thread) return null
    //the maximum number of page to display in the paginator
    const maxPageNumber = thread.pageNumber
    console.log(replies)
    console.log(thread)
    //tool bar to thank and reply to posts
    const RepToolBar = props => {
      if (props.reply)
        return (
          <div className="rep_quickrep_tool">
            <div className="no_thank">{props.reply.thankedList.length} people thank this</div>
            <button onClick={this.openModal}>Reply</button>
            <button onClick={() => this.thank(props.reply.id)}>Thanks</button>
          </div>
        )
      else return
    }

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
          to={`/${match.params.forumName}/${match.params.subforumName}/${match.params.threadId}`}
        >
          {thread.name}
        </Link>
      </div>
    )

    const ThreadHeader = (
      <div className="thread_header">
        <div className="user_avatar">
          <img src={thread.author.avatarUrl} alt="user_avatar" />
        </div>
        <div className="thread_header_info">
          <div className="thread_name">{thread.name}</div>
          <div className="thread_creator">
            By <Link to={`/user/${thread.author.id}`}>{thread.author.username}</Link>, Member on{" "}
            {formatTime(new Date(thread.author.createdTime))}
          </div>
        </div>
      </div>
    )

    const repliesListView = replies.map((reply, index) => {
      function createMarkup() {
        return { __html: reply.content }
      }
      console.log(reply.content)
      if (index === 0) {
        //display for the first reply, which is created by thread creator
        return (
          <div key={reply.id}>
            <div className="thread_content">
              <div dangerouslySetInnerHTML={createMarkup()} />
            </div>
            <RepToolBar reply={reply} />
          </div>
        )
        //display for all other replies
      } else {
        return (
          <div key={reply.id}>
            <div className="post_reply">
              <div className="user_post_rep">
                <div className="post_user">
                  <Link to={`/user/${reply.author.id}`}>{reply.author.username}</Link>
                </div>
                <div className="post_info">{formatTime(new Date(reply.createdTime))}</div>
              </div>
              <div className="post_content">
                <div className="post_user_content">
                  <img src={reply.author.avatarUrl} alt="user_avatar" />

                  <div className="user_title">Role: {reply.author.role}</div>
                </div>
                <div className="post_rep_content">
                  <div dangerouslySetInnerHTML={createMarkup()} />
                </div>
              </div>
            </div>
            <RepToolBar reply={reply} />
          </div>
        )
      }
    })

    let errorDisplay = (
      <div style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}>
        {errorMessage}
      </div>
    )

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
    }

    let newReplyModal = (
      <Modal style={customStyles} isOpen={isModalOpen} contentLabel="newThreadModal">
        <div style={{ flex: 1, flexDirection: "column" }}>
          <h2>Enter information</h2>
          <EditorConvertToHTML submit={this.submit} />

          <button onClick={this.closeModal}>Close</button>
        </div>
      </Modal>
    )
    let Pagination = () => {
      // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
      let paginationNumbers = []
      
      current == 1 
      ? paginationNumbers.push(<li className="disabled"><button disabled>First</button></li>) 
      : paginationNumbers.push(<li><button onClick={() => {this.loadRepliesFromPageNum(1)}}>First</button></li>)
      
      var i = Number(current) > 5 ? Number(current) - 4 : 1
      
      if(i !== 1) paginationNumbers.push(<li className="disabled"> <button disabled>...</button></li>)
      
      for (; i <= Number(current) + 4 && i <= pages; i++) {
        // trick to make sure ii has the value of i per run, not the final value of i
        let ii = i;
        if (i == current) {
          paginationNumbers.push(
            <li className="active">
              <button className="pagination active">{ii}</button>
            </li>
          )
        } else {
          paginationNumbers.push(
            <li>
              <button onClick={() => {
                this.loadRepliesFromPageNum(ii)
              }} >{i}</button>
            </li>
          )
        }
        if (i == Number(current) + 4 && i < pages) {
          paginationNumbers.push(
            <li className="disabled">
              <button disabled>...</button>
            </li>
          )
        }
      }
      
      if (current == pages)  {
        paginationNumbers.push(
        <li className="disabled">
          <button disabled >Last</button>
        </li>
      )} 
      else {
        paginationNumbers.push(
        <li>
          <button onClick={() => {
            this.loadRepliesFromPageNum(pages)
          }}>Last</button>
        </li>
      )}
      
      // if there are more than one page, we show pagination
      if (pages > 0) {
        return (
          <ul className="no_pages">
              {
                paginationNumbers
              }
          </ul>
        )
      }
      else return null;
    }

    if (isLoading) return <div />
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

            {/*<ReactPaginate
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
            />*/}
            <Pagination />
            <div className="container"></div>
          </div>

          {repliesListView}
        </div>
      )
  }
}
Thread.propTypes = {
  match: PropTypes.object,
  authData: PropTypes.object
}
export default Thread
