//const playerRouter = require('./routes/playerRouter')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const Game = require('./models/Game')

app.use(express.static('../client'));
app.use(cors())
app.use(bodyParser.json())

//app.use('/player', playerRouter)

// Fila para jogos
let queue = []

// Lista de jogos
let games = []

http.listen(8080, async () => {
    console.log('tetris running at localhost:8080')
})

app.get('/game', ({ res }) => {
    res.redirect('/')
})

io.on('connection', (socket) => {
    
    // Quando um cliente solicita entrada na fila
    socket.on('enterQueue', (nick) => {
        socket.nick = nick ? (nick.length < 18 ? nick : nick.substring(0, 18)) : 'anônimo'

        if (queue.indexOf(socket) == -1) {
            console.log('adicionando ', socket.id, ' na fila')
            queue.push(socket)
            checkQueue()
        }
    })
    
    // Quando um cliente desconectar
    socket.on('disconnect', () => {
        
        // Remove cliente da fila, se estiver la
        console.log('removendo ', socket.id, ' da fila')
        queue = queue.filter(client => client.id != socket.id)

        // Se estiver jogando, finaliza o jogo
        if (socket.isPlaying) {
            socket.game.end()

            // Adiciona o adversário na fila novamente
            queue.push(socket.adversary)

            checkQueue()
        }
    })
})

// Checa a fila para verificar se existe algum jogo a ser iniciado
function checkQueue() {

    // Se a quantidade de clientes na fila é par, começa um jogo para os dois primeiros
    if (queue.length != 0 && queue.length % 2 == 0) {
        let game = new Game(queue.shift(), queue.shift())
        games.push(game)
        
        game.start()
    }
}