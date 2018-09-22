import React, { Component } from 'react'

import './Login.scss'

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: 'something'
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

		const { history } = this.props
		socket.on('startGame', () => {
			history.push('/game')
		})

		socket.on('endGame', () => {
			history.push('/')
		})
	}

	render() {
		const { name } = this.state

		return (			
			<div>
				<h1 className='title'>Tetris</h1>

				<input placeholder='Nome' id='name' type='text' onChange={this.changeName} value={name} />
				<button onClick={this.enterQueue}>Entrar na fila!</button>
			</div>
		);
	}
}