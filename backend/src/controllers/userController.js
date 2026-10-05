const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrazione nuovo utente
exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Verifica se l'utente esiste già
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Utente già registrato' });
        }

        // Cripta la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea nuovo utente
        const user = await User.create({
            email,
            password: hashedPassword,
            name
        });

        // Genera token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'chiave_segreta_super_sicura',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Utente registrato con successo',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante la registrazione', error: error.message });
    }
};

// Login utente
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trova l'utente
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        // Verifica password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Password non valida' });
        }

        // Genera token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'chiave_segreta_super_sicura',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login effettuato con successo',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante il login', error: error.message });
    }
};

// Ricarica credito
exports.addCredit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        user.credit = parseFloat(user.credit) + parseFloat(amount);
        await user.save();

        res.json({
            message: 'Credito aggiunto con successo',
            newBalance: user.credit
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante la ricarica', error: error.message });
    }
};

// Ottieni profilo utente
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero del profilo', error: error.message });
    }
};

// Aggiorna stato utente (per gestori)
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        user.status = status;
        await user.save();

        res.json({
            message: 'Stato utente aggiornato con successo',
            user: {
                id: user.id,
                email: user.email,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'aggiornamento dello stato', error: error.message });
    }
};

// Ottieni lista utenti sospesi (per gestori)
exports.getSuspendedUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { status: 'suspended' },
            attributes: ['id', 'name', 'email', 'credit', 'updatedAt']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero utenti sospesi', error: error.message });
    }
};