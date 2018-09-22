import React, { Component } from "react";
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { render } from 'react-dom';
import io from 'socket.io-client'

const history = createBrowserHistory();

import App from "source/App.jsx";
import "source/App.scss";

window.socket = io.connect('localhost:8080', { reconnect: true })

class Wrapper extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router history={history}>
				<App history={history} />
			</Router>
		);
	}
}

render(
	<Wrapper />,
	document.getElementById('root')
);
