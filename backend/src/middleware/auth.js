const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Ottieni il token dall'header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token non fornito' });
        }

        // Verifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chiave_segreta_super_sicura');
        // Trova l'utente
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        // Aggiungi l'utente alla richiesta
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token non valido', error: error.message });
    }
}; 