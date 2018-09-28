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
        queue = queue.filter(client => client.id != socket.id)

        // Se estiver jogando, finaliza o jogo
        if (socket.isPlaying) {
            socket.game.end()

            // Adiciona o adversário na fila novamente
            queue.push(socket.adversary)

            checkQueue()
            updateGameList(socket)
        }
    })

    // Quando cliente montar os componentes ele vai avisar o servidor que vai responder com as listas
    socket.on('appMounted', () => {
        socket.emit('updateQueue', getNickList())
        socket.emit('updateGameList', games)
    })

    // Quando sair do jogo, atualiza a lista de jogos
    socket.on('leaveGame', () => {
        updateGameList(socket)
    })
})

// Checa a fila para verificar se existe algum jogo a ser iniciado
function checkQueue() {
    // Se a quantidade de clientes na fila é par, começa um jogo para os dois primeiros
    if (queue.length != 0 && queue.length % 2 == 0) {
        let game = new Game(queue.shift(), queue.shift())
        games.push({
            id: game.id,
            player1: game.player1.nick,
            player2: game.player2.nick
        })

        game.start()

        io.emit('updateGameList', games)
    }

    io.sockets.emit('updateQueue', getNickList())
}

function updateGameList(socket) {
    if (socket.game != null) {
        games = games.filter(game => game.id != socket.game.id)
        socket.game = null
    }
    
    io.emit('updateGameList', games)
}

function getNickList() {
    return queue.reduce((nicks, currentSocket) => {
        nicks.push(currentSocket.nick)
        return nicks
    }, [])
}