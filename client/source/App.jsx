import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Game from 'components/Game/Game.jsx'
import Queue from 'components/Queue/Queue.jsx'

import 'reset-css/reset.css'

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			game: {
				adversary: {
					filled: {
						version: 0,
						data: [],
						lines: 0
					},
					score: 0,
					nick: ''
				},
				gameId: null,
				isOver: false,
				isWinner: false,
				nick: ''
			},
			queue: [],
			gameList: []
		}
	}

	componentDidMount() {
		this.setupListeners()
		socket.emit('appMounted')
	}

	setupListeners() {
		socket.on('startGame', this.onStartGame)		
		socket.on('endGame', this.onEndGame)
		socket.on('adversaryBlockPlaced', this.onAdversaryBlockPlaced)
		socket.on('adversaryLine', this.onAdversaryLine)
		socket.on('gameOver', this.onGameOverCallback)
		socket.on('updateQueue', this.onUpdateQueue)
		socket.on('updateGameList', this.onUpdateGameList)
	}

	onUpdateGameList = (gameList) => {
		this.setState({gameList})
	}

	onUpdateQueue = (queue) => {
		this.setState({queue})
	}

	onStartGame = (data) => {
		const { history } = this.props
		const { game: originalGame } = this.state
		let game = this.removeReference(originalGame)

		game.gameId = data.gameId
		game.adversary.nick = data.adversaryNick
		game.nick = data.nick

		this.setState({game})
		history.push('/game')
	}

	onEndGame = (_data) => {
		const { history } = this.props

		let game = {
			adversary: {
				filled: {
					version: 0,
					data: [],
					lines: 0
				},
				score: 0,
				nick: ''
			},
			gameId: null,
			isOver: false,
			isWinner: false
		}

		this.setState({game})
		
		history.push('/')
	}

	onAdversaryBlockPlaced = (filledData) => {
		const { game: originalGame } = this.state
		let game = this.removeReference(originalGame)

		game.adversary.filled.data = filledData
		game.adversary.filled.version++

		this.setState({game})
	}

	onAdversaryLine = (data) => {
		const { game: originalGame } = this.state
		let game = this.removeReference(originalGame)

		game.adversary.score = data.score
		game.adversary.filled.lines += data.lines

		this.setState({game})
	}

	onGameOverCallback = (data) => {
		const { game: originalGame } = this.state
		let game = this.removeReference(originalGame)

		game.isOver = true
		game.isWinner = data.victory

		this.setState({game})
	}


	removeReference = (obj) => {
		return JSON.parse(JSON.stringify(obj))
	}

	render() {
		const { game, queue, gameList } = this.state

		return (
			<div className='app'>
				<Switch>
					
					<Route path='/game' render={(props) => (
  						<Game {...game} {...props} />
					)} />
					
					<Route path='/' render={(props) => (
  						<Queue {...props} queue={queue} gameList={gameList} nick={game.nick} />
					)} />

				</Switch>
			</div>
		);
	}
}	