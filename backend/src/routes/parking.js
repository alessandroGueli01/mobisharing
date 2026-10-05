const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const authMiddleware = require('../middleware/auth');

// Route pubbliche
router.get('/', parkingController.getAllParkingAreas);
router.get('/:parkingAreaId/stats', parkingController.getParkingStats);

// Route protette (richiedono autenticazione)
router.post('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
    next();
}, parkingController.createParkingArea);

router.put('/:parkingAreaId', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
    next();
}, parkingController.updateParkingArea);

module.exports = router; 