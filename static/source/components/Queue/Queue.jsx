import React, { Component } from 'react'

import './Queue.scss'

export default class Game extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='queue-wrapper'>
				<p>Waiting!</p>
			</div>
		);
	}
}