// Server setup
const express = require('express')
const path = require('path')
const app = express()
const api = require('./server/routes/api')
const bodyParser = require('body-parser')

// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTION_STRING||'mongodb://localhost/weatherdb');


app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', api)

app.listen(process.env.PORT || '8080');