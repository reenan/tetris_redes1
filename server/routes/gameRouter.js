const { Router } = require('express')

const {
    findPlayers,
    insertPlayer,
    findPlayerById,
    updatePlayer,
    deletePlayer
} = require('../db/gameDB')

const router = new Router()

router.get('/', async ({ res }) => {
    const players = await findPlayers()
    res.send(players)
})

router.post('/', async (req, res) => {
    try {
        const player = await insertPlayer(req.body)
        res.status(201).send(player)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/:playerId', async (req, res) => {
    const { playerId } = req.params
    try {
        const player = await findPlayerById(playerId)
        res.send(player)
    } catch (err) {
        res.sendStatus(404)
    }
})

router.put('/:playerId', async (req, res) => {
    const { playerId } = req.params

    try {
        const player = await updatePlayer(playerId, req.body)
        res.send(player)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.delete('/:playerId', async (req, res) => {
    const { playerId } = req.params

    try {
        await deletePlayer(playerId)
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router