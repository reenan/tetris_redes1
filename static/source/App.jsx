import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Game from 'components/Game/Game.jsx'
import Queue from 'components/Queue/Queue.jsx'
import Login from 'components/Login/Login.jsx'

import 'reset-css/reset.css'

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className='app'>
				<Switch>
					<Route path='/queue' component={Queue} />
					<Route path='/game' component={Game} />
					<Route path='/' component={Login} />
				</Switch>
			</div>
		);
	}
}	