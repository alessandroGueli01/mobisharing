const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/auth');

// Route pubbliche
router.get('/', vehicleController.getAllVehicles);
router.get('/available/:parkingAreaId', vehicleController.getAvailableVehicles);
router.get('/:vehicleId', vehicleController.getVehicleDetails);

// Route protette (richiedono autenticazione)
router.post('/', authMiddleware, vehicleController.registerVehicle);
router.put('/:vehicleId/status', authMiddleware, vehicleController.updateVehicleStatus);

module.exports = router; 