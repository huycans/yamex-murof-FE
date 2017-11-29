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
				<Switch>
					<Route exact path="/" component={Main} />
					<Route exact path="/Future" component={Forum} />
					<Route
						path={"/Future/:subForumName"}
						render={props => <SubForum {...props} />}
					/>
				</Switch>
			</div>
		);
	}
}

export default App;
