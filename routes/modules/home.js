// require express and Router
const express = require('express')
const router = express.Router()

// require Restaurant model
const Restaurant = require('../../models/restaurant')

// set route

// home page
router.get('/', (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.trim() : ''
  const sort = [req.query.sort1, req.query.sort2, req.query.sort3]

  RestaurantFind(keyword, sort).then(rows => {

    // if no restaurant found, then show alert and list all restaurants
    if (!rows.length) {
      RestaurantFind({}, sort).then(all => {
        const searchAlert = true
        const showReturnBtn = false
        const restaurants = all
        res.render('index', { restaurants, keyword, searchAlert, showReturnBtn })
        return
      })
    }

    // if any restaurant found
    const searchAlert = false
    const restaurants = rows
    const showReturnBtn = keyword ? true : false
    res.render('index', { restaurants, keyword, searchAlert, showReturnBtn })
  }).catch(e => {
    console.error(e)
  })
})

function RestaurantFind(keyword, sortOption) {

  let where = keyword ? {
    $or: [
      { 'name': { "$regex": keyword, "$options": "i" } },
      { 'category': { "$regex": keyword, "$options": "i" } }
    ]
  } : {}

  // default sorting is { 'rating': 'desc', 'name': 'asc' }
  let sort = sortOption[0] ? sortOption : ['rd', 'na']

  // code for sorting options
  const sortingCode = {
    r: 'rating', n: 'name', c: 'category',
    d: 'desc', a: 'asc'
  }

  // selected sorting options
  const selectedSortingOptions = {}
  sort.forEach(q => {
    if (q) {
      selectedSortingOptions[sortingCode[q[0]]] = sortingCode[q[1]]
    }
  })

  return Restaurant.find(where).lean().sort(selectedSortingOptions)
}

// export module
module.exports = router