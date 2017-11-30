import React, { Component } from "react";
import Forum from "./Components/Forum";
import "../css/App.css";
import { Main } from "./Components/Main";
import { Route, Switch } from "react-router-dom";
import Header from "./Components/Header";
import SubForum from "./Components/SubForum";
class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Header />

				<Route exact path="/" component={Main} />
			</div>
		);
	}
}

export default App;
