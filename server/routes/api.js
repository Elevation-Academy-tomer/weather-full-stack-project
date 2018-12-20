const express = require('express')
const router = express.Router()
const request = require('request')
const City = require('../models/City')
const moment = require('moment')



router.get('/city/:cityName', function (req, res) {
        let cityName = req.params.cityName
        request(`http://api.apixu.com/v1/current.json?key=6705edbedad449258e3112943181912&q=${cityName}`
     , function (error, data,body) {
         const city = JSON.parse(body)
         city.current.last_updated = moment(city.current.last_updated).format("LLLL") 
            res.send(city)
        })
})

router.get('/cities', function (req, res) {
        City.find({}, function(err, cities){
            cities.map(c =>c.updatedAt = moment(c.updatedAt).format("LLLL") )
            res.send(cities)
        })
})

router.post('/city', function(req , res){
        let tempcity = req.body
        tempcity.displaySave = "none"
        tempcity.displayDelete = "inline-block"
        let newCity = new City(tempcity)
        newCity.save()
        res.send()
})

router.delete('/city/:cityName', function(req , res){
    let cityName = req.params.cityName
    City.find({name : cityName})
    .remove()
    .exec(function(err , data){
        res.send(data)
    })


})

router.put('/city/:cityName', function(req , res){
    let cityName = req.params.cityName
    request(`http://api.apixu.com/v1/current.json?key=6705edbedad449258e3112943181912&q=${cityName}`
    , function (error, result,body) {
        const city = JSON.parse(body)
        console.log(city)
        city.current.last_updated = moment(city.current.last_updated).format("LLLL") 
        City.findOne({name : city.location.name})
        .exec(function(err , data){
        data.updatedAt = city.current.last_updated
        data.temperature = city.current.temp_c
        data.conditionPic = city.current.condition.icon
        data.save()
        res.end()
        })
       })


})

module.exports = router