const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verifica se l'utente esiste già
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Utente già registrato' });
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creazione nuovo utente
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Generazione token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.status(201).json({
            message: 'Utente registrato con successo',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Errore nella registrazione:', error);
        res.status(500).json({ message: 'Errore nella registrazione' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica se l'utente esiste
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Verifica password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Generazione token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.json({
            message: 'Login effettuato con successo',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Errore nel login:', error);
        res.status(500).json({ message: 'Errore nel login' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json(user);
    } catch (error) {
        console.error('Errore nel recupero del profilo:', error);
        res.status(500).json({ message: 'Errore nel recupero del profilo' });
    }
}; 