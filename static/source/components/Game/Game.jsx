import React, { Component } from 'react'
import { findDOMNode } from 'react-dom';


import './Game.scss'
import BlockRain from '../../../libs/blockrain.jquery.src.js';
import '../../../libs/blockrain.css';

export default class Game extends Component {
	static defaultProps = {
		enemyData: []
	};

	constructor(props) {
		super(props);

		this.state = {
			adversaryScore: 0
		}
	}

	componentDidMount() {
		this.tetris = BlockRain(findDOMNode(this.refs.tetris)).find('.tetris')
		this.tetris.tetrify({
			autoplay: true,
			speed: 200,
			
			autoBlockWidth: true,
			autoBlockSize: 20,
			theme: 'candy',
			onGameOver: this.onGameOver,
			onLine: this.onLine,
			onPlaced: this.onPlaced
		})

		this.tetrisEnemy = BlockRain(findDOMNode(this.refs.tetrisEnemy)).find('.tetris-enemy')
		this.tetrisEnemy.tetrify({
			autoBlockWidth: true,
			autoBlockSize: 20,
			theme: 'candy',

			useEnemyData: true
		})

		socket.on('adversaryBlockPlaced', (filledData) => {
			BlockRain(this.tetrisEnemy).tetrify('updateTetris', filledData)
		})

		socket.on('adversaryLine', (adversaryScore) => {
			this.setState({
				adversaryScore: adversaryScore
			})

			BlockRain(this.tetris).tetrify('addConcreteLine', 2);
		})

		socket.on('gameOver', (data) => {
			BlockRain(this.tetris).tetrify('pause');
			BlockRain(this.tetrisEnemy).tetrify('pause');

			if (data.victory) {
				alert("ganhador!")
			} else {
				alert("perdedor!")
			}
		})
	}

	onGameOver = () => {
		socket.emit('gameOver')
	}

	onPlaced = (filledData) => {
		socket.emit('blockPlaced', filledData)
	}

	onLine = (_lines, _scoreIncrement, score) => {
		socket.emit('line', score)
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.enemyDataCounter > this.props.enemyDataCounter) {
	// 		BlockRain(this.tetrisEnemy).tetrify('updateTetris', nextProps.enemyData);
	// 	}

	// 	if (nextProps.trollMyself > this.props.trollMyself) {
	// 		const diff = nextProps.trollMyself - this.props.trollMyself;
	// 		BlockRain(this.tetris).tetrify('trollMyself', diff);
	// 	}

	// 	if (nextProps.saveNoob > this.props.saveNoob) {
	// 		BlockRain(this.tetris).tetrify('saveNoob');
	// 	}
	// }

	

	// onMakeLines = (lines) => {
	// 	this.props.socket.emit('onMakeLines', lines);
	// }

	// gameOver = () => {
	// 	if (!this.unmounting) {
	// 		this.props.socket.emit('gameOver');
	// 	}
	// }

	render() {
		//console.log('this.props: ', this.props);
		
		// não esquecer de usar dangerous HTML
		//console.log('jQuery: ', jQuery);
		return (
			<div className='game-wrapper'>
				<div className='tetris-wrapper'>
					<div ref='tetris'>
						<div className='tetris' />
					</div>
				</div>

				<div className='tetris-wrapper adversary'>
					<div ref='tetrisEnemy'>
						<div className='blockrain-score-holder'>
							<div className='blockrain-score'>
								<div className='blockrain-score-msg'>Score</div>
								<div className='blockrain-score-num'>{this.state.adversaryScore}</div>
							</div>
						</div>
						<div className='tetris-enemy' />
					</div>
				</div>
			</div>
		);
	}
}