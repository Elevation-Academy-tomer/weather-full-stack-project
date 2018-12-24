const express = require('express')
const router = express.Router()
const request = require('request')
const City = require('../models/City')
const User = require('../models/User')
const moment = require('moment')

const cityExist = async function (cityName) {
    const city = await City.findOne({ name: cityName })
    if (city)
    {
      return true
    }
    return false
  }

router.post('/UserId/', function (req, res) {
    let newUser = new User()
    newUser.save()
    res.send(newUser)
})

router.get('/city/:cityName', function (req, res) {
        let cityName = req.params.cityName
        request(`http://api.apixu.com/v1/current.json?key=6705edbedad449258e3112943181912&q=${cityName}`
     , function (error, data,body) {
         const city = JSON.parse(body)
         city.current.last_updated = moment(city.current.last_updated).format("LLLL") 
            res.send(city)
        })
})

router.get('/cities/:idUser', function (req, res) {
        let id = req.params.idUser
        User.findOne({_id : id})
        .populate("cities")
        .exec(function (err, user) {
            user.cities ? user.cities.map(c =>c.updatedAt = moment(c.updatedAt).format("LLLL") ) : null
            res.send(user.cities)
        })
})

router.post('/city/:idUser',async function(req , res){
    let tempcity = req.body
    let id = req.params.idUser
    tempcity.displaySave = "none"
    tempcity.displayDelete = "inline-block"
    let newCity
        if (await cityExist(tempcity.name))
        {
        newCity = await City.findOne({ name: tempcity.name })
        console.log("city exist")
        } else
        {
        console.log("city doesnt exist")
        newCity = new City(tempcity)
        await newCity.save()
        }
        User.findByIdAndUpdate(
        id,
        { $addToSet: { cities: newCity } },
        { new: true })
        .exec(function (err, user) {
            res.send(user.cities)
        })
})

router.delete('/city/:cityName/:idUser', function(req , res){
    let cityName = req.params.cityName
    let id = req.params.idUser
    User.findOne({_id : id})
        .populate("cities")
        .exec(function (err, user) {
            user.cities = user.cities.filter(c => c.name != cityName )
            user.save()
            res.send(user.cities)
        })
})

router.put('/city/:cityName', function(req , res){
    let cityName = req.params.cityName
    request(`http://api.apixu.com/v1/current.json?key=6705edbedad449258e3112943181912&q=${cityName}`
    , function (error, result,body) {
        const city = JSON.parse(body)
        city.current.last_updated = moment(city.current.last_updated).format("LLLL")
        City.findOne({name : city.location.name})
        .exec( function(err , data){
            data.updatedAt = city.current.last_updated
            data.temperature = city.current.temp_c
            data.conditionPic = city.current.condition.icon
            newCity = data
            data.save()
        })
       })

})

module.exports = router


