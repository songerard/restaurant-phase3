// require express and Router
const express = require('express')
const router = express.Router()

// require Restaurant model
const Restaurant = require('../../models/restaurant')

// set route

// home page
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ 'rating': 'desc', 'name': 'asc' })
    .then(restaurants => {
      allCategory = []      // clear allCategory list
      restaurants.forEach(r => {
        // if category not found in allCategory, then add in allCategory
        if (allCategory.indexOf(r.category) === -1) {
          allCategory.push(r.category)
        }
      })
      allCategory.sort
      res.render('index', { restaurants })
    })
    .catch(error => console.error(error))
})

// search restaurant
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()

  // get all restaurants from mongodb
  const allRestaurants = []
  Restaurant.find()
    .lean()
    .sort({ 'rating': 'desc', 'name': 'asc' })
    .then(restaurants => {
      allRestaurants.push(...restaurants)
    })

  // filter restaurants by keyword in name or category
  Restaurant.find({
    $or: [
      { 'name': { "$regex": keyword, "$options": "i" } },
      { 'category': { "$regex": keyword, "$options": "i" } }
    ]
  })
    .lean()
    .sort({ 'rating': 'desc', 'name': 'asc' })
    .then(filteredRestaurants => {
      // if no restaurant found, then set alert = true and show all restaurants
      const searchAlert = (!filteredRestaurants.length || !keyword) ? true : false
      const restaurants = (filteredRestaurants.length) ? filteredRestaurants : allRestaurants

      // render index page
      res.render('index', { restaurants, keyword, searchAlert })
    })
    .catch(error => console.error(error))
})

// export module
module.exports = router