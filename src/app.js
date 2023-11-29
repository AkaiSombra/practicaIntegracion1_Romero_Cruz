
import express from 'express'
import mongoose, { mongo } from 'mongoose'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'

import chatModel from "../src/models/message.models.js"
//Filesystem
import productsRouterFs from './routes/products.fs.routes.js'
import cartsRouterFs from './routes/carts.fs.routes.js'
//MongoAtlas
import productsRouterMdb from './routes/products.mdb.routes.js'
import cartsRouterMdb from './routes/carts.mdb.routes.js'
//Chat
import chatRouter from './routes/chat.routes.js'

import { __dirname, __filename } from './utils.js'

const PORT = 8080
const MONGOOSE_URL = 'mongodb+srv://SombraAkai:1234@cluster0.nqkm3pp.mongodb.net/videogameShop?retryWrites=true&w=majority'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//Filesystem
app.use('/api/fs/products', productsRouterFs)
app.use('/api/fs/carts', cartsRouterFs)

//MongoAtlas
app.use('/api/mdb/products', productsRouterMdb)
app.use('/api/mdb/carts', cartsRouterMdb)

//Chat
app.use ('/', chatRouter)


app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use('/static', express.static(`${__dirname}/public`))

try{
    await mongoose.connect(MONGOOSE_URL)
    const httpServer = app.listen(PORT, () => {
        console.log(`Express server active on port ${PORT}`)
    })
    
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
            credentials: false
        }
    })

    app.set('io', io)

    io.on('connection', async socket => {  
            socket.on('user_connected', async data => {

            const chat_message = await chatModel.find()
            socket.broadcast.emit('user_connected', data)
            io.emit('chatLogs', chat_message)
            console.log(`Chat actual enviado a ${socket.id}`)
        })
    
        socket.on('message', async data => {
            const pushChat = await chatModel.create(data)
            
            io.emit('messageLogs', pushChat)
        })
    })
} catch(err){
    console.log(`Error initializing server (${err.message})`)
}