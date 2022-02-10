const express = require('express');
const userModel = require('../models/User')
const groupChatModel = require('../models/GroupChat')

const router = express();

router.post('/validate_user', async (req, res) => {
    const username = req.body.username;
    const pw = req.body.password;
    const user = await userModel.findOne({ username:  username})
    try {
        if (!user) {
            res.status(400).send({ error: "User is not found" })
            return
        }
        if (user.password != pw) {
            res.status(401).send({ error: "Password is Invalid" })
            return
        }
        res.send({ validated: true })
    } catch (err) {
        res.status(500).send(err);
    }

})

router.get('/:username', async (req, res) => {
    const username = req.params.username;
    const user = await userModel.findOne({ username:  username})
    try {
        if (!user) {
            res.status(400).send({ err: "Could not found the User" })
        }
        res.send({ username: user.username, id: user._id, firstname: user.firstname, lastname: user.lastname })
    } catch (err) {
        res.status(500).send(err);

    }

})

router.post('/', async (req, res) => {
    const user = new userModel(req.body)
    try {
        await user.save()
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/', (req, res) => {
    const user = groupChatModel.find({}).distinct('room', (err, rooms) => {
        if (err) {
            res.status(400).send(err)
        }
        res.send(rooms)
    })
})

router.post('/send_room', async (req, res) => {
    const groupMessages = new groupChatModel(req.body)

    try {
        await groupMessages.save()
        res.send(groupMessages)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/room/:room', async (req, res) => {
    try {
        const roomName = req.params.room;
        const messages = await groupChatModel.find({room: roomName}).sort({"date_sent": 1})
        res.send(messages)
    } catch (err) {
        res.status(500).send(err)
    }

})



module.exports = router