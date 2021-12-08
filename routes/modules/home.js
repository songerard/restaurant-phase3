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
      if (!filteredRestaurants.length) {
        // get all restaurants from mongodb
        Restaurant.find()
          .lean()
          .sort({ 'rating': 'desc', 'name': 'asc' })
          .then(restaurants => {
            const searchAlert = true
            const showReturnBtn = false

            // render index page with searchAlert
            res.render('index', { restaurants, keyword, searchAlert, showReturnBtn })
          })
      } else {
        // if some restaurant found
        const searchAlert = false
        const restaurants = filteredRestaurants
        const showReturnBtn = true
        res.render('index', { restaurants, keyword, searchAlert, showReturnBtn })
      }
    })
    .catch(error => console.error(error))
})

// sort restaurant
router.get('/sort', (req, res) => {
  // get sorting query
  const sortingQuery = [
    req.query.sort1,
    req.query.sort2,
    req.query.sort3
  ]

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
  sortingQuery.forEach(q => {
    if (q) {
      selectedSortingOptions[sortingCode[q[0]]] = sortingCode[q[1]]
    }
  })

  // sort Restaurant according to selected sorting options
  Restaurant.find()
    .lean()
    .sort(selectedSortingOptions)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// export module
module.exports = router