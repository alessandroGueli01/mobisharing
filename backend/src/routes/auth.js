const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Route pubbliche
router.post('/register', userController.register);
router.post('/login', userController.login);

// Route protette (richiedono autenticazione)
router.get('/profile/:userId', authMiddleware, userController.getProfile);
router.post('/credit/:userId', authMiddleware, userController.addCredit);

// Route solo per gestori
router.put('/status/:userId', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
    next();
}, userController.updateUserStatus);

router.get('/suspended', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
    }
    next();
}, userController.getSuspendedUsers);

module.exports = router; 