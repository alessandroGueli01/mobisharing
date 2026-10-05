const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea l'utente
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      credit: 0 // Credito iniziale
    });

    res.status(201).json({ message: 'Utente registrato con successo', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    
    if (user.status === 'suspended') {
        return res.status(403).json({ message: 'Account sospeso. Contattare l\'amministrazione.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password non valida' });

    // Genera Token (assicurati di avere JWT_SECRET nel .env)
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'chiave_segreta_temporanea', 
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { id: user.id, name: user.name, credit: user.credit, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};