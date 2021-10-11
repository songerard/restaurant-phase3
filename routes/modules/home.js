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
    .then(restaurants => res.render('index', { restaurants }))
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

// sort restaurant
router.get('/sort', (req, res) => {
  const sort1 = req.query.sort1
  const sort2 = req.query.sort2
  const sort3 = req.query.sort3

  // code for sorting options
  const sortingCode = {
    r: 'rating',
    n: 'name',
    c: 'category',
    d: 'desc',
    a: 'asc'
  }

  // selected sorting options
  const selectedSortingOptions = {}
  if (sort1) {
    selectedSortingOptions[sortingCode[sort1[0]]] = sortingCode[sort1[1]]
  }
  if (sort2) {
    selectedSortingOptions[sortingCode[sort2[0]]] = sortingCode[sort2[1]]
  }
  if (sort3) {
    selectedSortingOptions[sortingCode[sort3[0]]] = sortingCode[sort3[1]]
  }

  // sort Restaurant according to selected sorting options
  Restaurant.find()
    .lean()
    .sort(selectedSortingOptions)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))

})

// export module
module.exports = router