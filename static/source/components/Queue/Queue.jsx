import React, { PureComponent } from 'react'

import './Queue.scss'

export default class Queue extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			name: 'something',
			onQueue: false
		}
	}

	// Controla valor do input "name"
	changeName = (event) => {
		this.setState({
			name: event.target.value
		})
	}

	// Entra na fila para jogar
	enterQueue = () => {
		socket.emit('enterQueue')

		this.setState({
			onQueue: true
		})
	}

	render() {
		const { name, onQueue } = this.state

		return (			
			<div>
				<h1 className='title'>Tetris</h1>

				<input placeholder='Nome' id='name' type='text' onChange={this.changeName} value={name} />
				<button disabled={onQueue} onClick={this.enterQueue}>Entrar na fila!</button>
			</div>
		);
	}
}