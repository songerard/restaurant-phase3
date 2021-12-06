// require mongodb connection
const db = require('../../config/mongoose')

// require Restaurant model
const Restaurant = require('../restaurant').results

// once mongodb connected
db.once('open', () => {
  console.log('mongodb connected!')

  // insert seeder into mongodb
  restaurantSeeder.forEach(seed => {
    const {
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    } = seed
    Restaurant.create({
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    })
  })
  console.log('seeder done')
})