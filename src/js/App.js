import React, { Component } from "react";
import Forum from "./Components/Forum";
import "../css/App.css";
import { Main } from "./Components/Main";
import { Route, Switch } from "react-router-dom";
import Header from "./Components/Header";
import SubForum from "./Components/SubForum";
import { URL, SERVER_API } from "./Constants/API";
import LoadingIcon from "./Components/LoadingIcon";
class App extends Component {
	constructor(props) {
		super(props);
		this.getForumList = this.getForumList.bind(this);
		this.state = {
			isError: null,
			forumList: [],
			isLoading: true
		};
	}
	async getForumList() {
		try {
			let link = URL + SERVER_API.getAllForum;
			let response = await fetch(link, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Access-Control-Allow-Origin": "*"
				}
			});
			let responseJSON = await response.json();
			return responseJSON.content;
		} catch (error) {
			throw error;
		}
	}
	componentDidMount() {
		this.getForumList().then(
			forumList => {
				this.setState({ isLoading: false, forumList: forumList });
			},
			error => {
				this.setState({ isLoading: false, isError: true });
				console.log("Error while getting forum list: ", error);
			}
		);
	}
	render() {
		let { forumList, isError, isLoading } = this.state;
		console.log("forumList", forumList);
		let listOfForumRoute = null;
		if (isLoading)
			return (
				<div>
					<Header />
					<LoadingIcon />
				</div>
			);
		if (isError) {
			return (
				<div>
					<Header />
					<div>There has been an error, please refresh the page</div>
				</div>
			);
		}

		//create a list of route for main forum view, e.g /honda-future
		console.log("before routes list", forumList);
		listOfForumRoute = forumList.map(forum => {
			return (
				<Route
					exact
					path={`/${forum.path}`}
					key={forum.id}
					//render={forum => <Forum forumData={forum} />}
					component={Forum}
				/>
			);
		});
		return (
			<div>
				<Header />
				<Switch>
					<Route exact path="/" render={() => <Main forumList={forumList} />} />
					{listOfForumRoute}
				</Switch>
			</div>
		);
	}
}
//<Route path="/honda-future" render={() => <Forum />} />
export default App;
