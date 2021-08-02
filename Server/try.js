import express from 'express'
import bodyParser from 'body-parser'
import routerPage from './route.js'

const app= express()
const PORT =5000;

app.use(bodyParser.json())
app.use('/users', routerPage)

app.listen(PORT, ()=> console.log('server connected:${PORT}'))

app.get('/', (req,res)=>{res.send("welcome to willjob")})