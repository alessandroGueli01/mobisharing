const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const auth = require('../middleware/auth');

router.get('/', auth, sensorController.getAllSensors);
router.get('/:id', auth, sensorController.getSensorById);
router.get('/:sensorId/data', auth, sensorController.getSensorData);
router.patch('/:id/status', auth, sensorController.updateSensorStatus);

module.exports = router; 