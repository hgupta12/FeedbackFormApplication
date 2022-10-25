const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const {errorMiddleware} = require('./middleware/errorMiddleware')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan('tiny'))

app.use('/user',require('./routes/user'))
app.use('/form',require('./routes/form'))
app.use('/response',require('./routes/response'))

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT,()=>{
            console.log(`Listening at port ${PORT}`)
        });
    } catch (error) {
        console.log(error);
    }
}

start()
