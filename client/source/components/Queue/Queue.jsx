import React, { PureComponent } from 'react'

import './Queue.scss'

export default class Queue extends PureComponent {
	static defaultProps = {
		queue: [],
		gameList: []
	}

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
		}, () => {
			this.queueCounter = setInterval(() => {
				this.setState({
					secondsOnQueue: this.state.secondsOnQueue + 1 
				})
			}, 1000)
		})
	}

	componentWillUnmount() {
		if (this.queueCounter) {
			clearInterval(this.queueCounter)
		}
	}

	render() {
		const { nick, onQueue, secondsOnQueue } = this.state
		const { queue, gameList } = this.props

		let gameListElement = gameList.reduce((elementList, game) => {
			elementList.push(
				<li key={game.id}>
					<span className='player-nick'>{game.player1}</span>
					<span className='vs'>vs</span>
					<span className='player-nick'>{game.player2}</span>
				</li>
			)

			return elementList
		}, [])

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


				<div className='queue-list'>
					Quem está na fila agora?
					{
						queue.length > 0 ?
							<p>{queue[0]}</p> : <p>No momento ninguém está na fila</p>
					}
				</div>

				<div className='game-list'>
					Quem está jogando agora?
					{
						gameList.length > 0 ?
							<ul>{gameListElement}</ul> : <p>No momento ninguém está jogando</p>
					}
				</div>
			</div>
		);
	}
}