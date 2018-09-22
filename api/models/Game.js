class Game {
    constructor(player1, player2) {
        player1.adversary = player2
        player2.adversary = player1

        this.player1 = player1
        this.player2 = player2

        this.players = [player1, player2]
    }

    hasPlayer(player) {
        return this.players.indexOf(player) != -1
    } 

    start() {
        for (let player of this.players) {
            player.emit('startGame', { adversary: player.adversary.nick })
            player.isPlaying = true
            player.game = this


            player.on('blockPlaced', (filledData) => {
                player.adversary.emit('adversaryBlockPlaced', filledData)
            })

            player.on('line', (score) => {
                player.adversary.emit('adversaryLine', score)
            })

            player.on('gameOver', () => {
                player.adversary.emit('gameOver', {victory: true})
                player.emit('gameOver', {victory: false})
            })
        }
    }

    end() {
        for (let player of this.players) {
            player.emit('endGame')
            player.isPlaying = false
            player.adversary.isPlaying = false
        }
    }
}

module.exports = Game