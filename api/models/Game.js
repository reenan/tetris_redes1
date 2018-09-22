const uuidv4 = require('uuid/v4')

class Game {
    constructor(player1, player2) {
        player1.adversary = player2
        player2.adversary = player1

        this.id = uuidv4()
        this.player1 = player1
        this.player2 = player2

        this.players = [player1, player2]
    }

    hasPlayer(player) {
        return this.players.indexOf(player) != -1
    } 

    start() {
        console.log('começando jogo para: ', this.player1.id, this.player2.id)
        this.setupListeners()
        
    }

    leave(player) {
        console.log('saindo do jogo para: ', player.id)
        player.emit('endGame')
        player.isPlaying = false
    }

    end() {
        for (let player of this.players) {
            this.leave(player)
        }
    }

    setupListeners() {
        for (let player of this.players) {

            player.emit('startGame', { adversary: player.adversary.nick, gameId: this.id })
            player.isPlaying = true
            player.game = this

            if (player.playedOnce) {
                continue
            }

            player.on('blockPlaced', (filledData) => {
                //console.log(player.id, ' colocou um block')
                player.adversary.emit('adversaryBlockPlaced', filledData)
            })

            player.on('line', (data) => {
                console.log(player.id, ' fechou uma linha')
                player.adversary.emit('adversaryLine', data)
            })

            player.on('gameOver', () => {
                console.log(player.id, ' sofreu game over')
                player.adversary.emit('gameOver', {victory: true})
                player.emit('gameOver', {victory: false})
            })

            player.on('leaveGame', () => {
                this.leave(player)
            })

            player.playedOnce = true
        }
    }
}

module.exports = Game