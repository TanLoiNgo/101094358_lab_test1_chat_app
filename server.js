const express = require('express')
const app = express()
const http = require('http').createServer(app)
const cors = require('cors')
const mongoose = require('mongoose');
const path = require('path')

const PORT = 3008


//Create Server Socket
const io = require('socket.io')(http)

// Cross Origin Requests 
app.use(cors())

// JSON payload
app.use(express.json())
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

// import Routers
const chatRouter = require('./routes/chatRoutes')



// Use Routers
app.use('/chatrouter', chatRouter)

//Connect Mongoose
mongoose.connect('mongodb+srv://tanLoi:TanL0i@cluster0.xrhj9.mongodb.net/labtest1?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(success => {
    console.log('Success Mongodb connection')
  }).catch(err => {
    console.log('Error Mongodb connection')
  });

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.set('view engine', 'html');


//Accept new request
io.on('connection', (socket) => {
    console.log('Connected ')

    //Custom message event to socket
    socket.on('messageSent', (data) => {
        socket.broadcast.emit('messageReceived')
    })

    socket.on('isTyping', (user) => {
        socket.broadcast.emit('isTyping', user)
    })

    socket.on('stopTyping', (user) => {
        socket.broadcast.emit('stopTyping', user)
    })

    //Disconnected
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
    })
})

http.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})
