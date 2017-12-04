import React, { Component } from "react";
import Forum from "./Components/Forum";
import "../css/App.css";
import MainContent from "./Components/MainContent";
import { Route, Switch } from "react-router-dom";
import Header from "./Components/Header";
import SubForum from "./Components/SubForum";
import Thread from "./Components/Thread";
class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Header />
				<Route path="/" component={MainContent} />
			</div>
		);
	}
}
//<Route path="/honda-future" render={() => <Forum />} />
export default Thread;
