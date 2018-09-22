import React, { PureComponent } from 'react'

import './Queue.scss'

export default class Queue extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			nick: this.props.nick,
			onQueue: false,
			secondsOnQueue: 0
		}
	}

	// Controla valor do input "nick"
	changeNick = (event) => {
		this.setState({
			nick: event.target.value
		})
	}

	// Entra na fila para jogar
	enterQueue = () => {
		socket.emit('enterQueue', this.state.nick)

		this.setState({
			onQueue: true
		}, setInterval(() => {
			this.setState({
				secondsOnQueue: this.state.secondsOnQueue + 1 
			})
		}, 1000))
	}

	render() {
		const { nick, onQueue, secondsOnQueue } = this.state

		return (
			<div className='queue-wrapper'>
				<h1 className='title'>
					<span>T</span>
					<span>E</span>
					<span>T</span>
					<span>R</span>
					<span>I</span>
					<span>S</span>
				</h1>

				<input placeholder='Nome' id='nick' type='text' onChange={this.changeNick} value={nick} />
				<button disabled={onQueue} onClick={this.enterQueue}>Entrar</button>
				{
					onQueue ?
						<p>Esperando na fila a {secondsOnQueue} segundo{secondsOnQueue != 0 ? 's' : ''}</p> : null
				}
			</div>
		);
	}
}