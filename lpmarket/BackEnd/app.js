// Middleware runs before actual logic/code

const express =  require('express')
require('dotenv').config();
require('./db');

const userRouter = require('./routes/user');

const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)  
})



/* app.use((req, res, next) => {
    req.on('data', (buffer) => {
        req.body = JSON.parse(buffer)
        next()
    })
})

Essentially how "express.json" works

*/