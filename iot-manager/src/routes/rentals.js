const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const auth = require('../middleware/auth');

router.post('/', auth, rentalController.createRental);
router.post('/:rental_id/end', auth, rentalController.endRental);
router.get('/user', auth, rentalController.getUserRentals);
router.get('/:rental_id', auth, rentalController.getRentalById);

module.exports = router; 