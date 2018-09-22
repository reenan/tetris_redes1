import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom';


import './Game.scss'
import BlockRain from '../../../libs/blockrain.jquery.src.js';
import '../../../libs/blockrain.css';

export default class Game extends PureComponent {
	static defaultProps = {
		adversary: {
			filled: {
				version: 0,
				data: [],
				lines: 0
			},
			score: 0
		},
		gameId: null,
		isOver: false,
		isWinner: false
	}
	
	constructor(props) {
		super(props);

		this.state = {
			message: ''
		}
	}

	componentDidMount() {
		this.tetrify()
	}

	componentWillReceiveProps(nextProps) {
		const { adversary: nextAdversary, isOver: nextIsOver, isWinner: nextIsWinner } = nextProps
		const { adversary } = this.props

		// Atualiza tetris do adversário com o blocos 
		if (nextAdversary.filled.version > adversary.filled.version) {
			BlockRain(this.tetrisAdversary).tetrify(
				'updateTetris',
				nextAdversary.filled.data
			)
		}

		// Insere uma linha fixa para cada linha fechada do adversário
		if (nextAdversary.filled.lines > adversary.filled.lines) {
			BlockRain(this.tetris).tetrify(
				'addConcreteLine', 
				nextAdversary.filled.lines - adversary.filled.lines
			)
		}

		// Finaliza o jogo
		if (nextIsOver) {
			BlockRain(this.tetris).tetrify('pause');
			BlockRain(this.tetrisAdversary).tetrify('pause');
	
			if (nextIsWinner) {
				this.setState({
					message: "VOCÊ GANHOU!"
				})
			} else {
				this.setState({
					message: "VOCÊ PERDEU!"
				})
			}
		}
	}

	tetrify = () => {
		this.tetris = BlockRain(findDOMNode(this.refs.tetris)).find('.tetris')
		this.tetris.tetrify({
			autoplay: true,
			speed: 500,
			
			autoBlockWidth: true,
			autoBlockSize: 20,
			theme: 'candy',
			onGameOver: this.onGameOver,
			onLine: this.onLine,
			onPlaced: this.onPlaced
		})

		this.tetrisAdversary = BlockRain(findDOMNode(this.refs.tetrisAdversary)).find('.tetris-adversary')
		this.tetrisAdversary.tetrify({
			autoBlockWidth: true,
			autoBlockSize: 20,
			theme: 'candy',
			initPaused: true
		})
	}

	onGameOver = () => {
		socket.emit('gameOver')
	}

	onPlaced = (filledData) => {
		socket.emit('blockPlaced', filledData)
	}

	onLine = (lines, _scoreIncrement, score) => {
		socket.emit('line', {score: score, lines: lines})
	}

	leaveGame = () => {
		socket.emit('leaveGame')
		this.props.history.push('/')
	}

	render() {
		const { message } = this.state
		const { adversary, gameId } = this.props

		return (
			<div key={gameId} className='game-wrapper'>
				<div className='tetris-wrapper'>
					<div ref='tetris'>
						<div className='tetris' />
					</div>
				</div>

				<div className='tetris-wrapper adversary'>
					<div ref='tetrisAdversary'>
						<div className='blockrain-score-holder'>
							<div className='blockrain-score'>
								<div className='blockrain-score-msg'>Score</div>
								<div className='blockrain-score-num'>{adversary.score}</div>
							</div>
						</div>
						<div className='tetris-adversary' />
					</div>
				</div>

				<p onClick={this.leaveGame} className='message'>{message}</p>
			</div>
		);
	}
}