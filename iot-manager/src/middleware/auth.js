const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Autenticazione richiesta' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Errore nell\'autenticazione:', error);
        res.status(401).json({ message: 'Token non valido' });
    }
}; 