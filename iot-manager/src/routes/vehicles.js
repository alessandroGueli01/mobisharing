const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const auth = require('../middleware/auth');

router.get('/', auth, vehicleController.getAllVehicles);
router.get('/:id', auth, vehicleController.getVehicleById);
router.patch('/:id/status', auth, vehicleController.updateVehicleStatus);
router.get('/:id/sensors', auth, vehicleController.getVehicleSensors);
router.get('/:id/sensors/:sensorId/data', auth, vehicleController.getVehicleSensorData);

module.exports = router; 