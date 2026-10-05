const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./models');
const { connectMQTT, sendCommand } = require('./services/mqttService');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicles');
const parkingRoutes = require('./routes/parking');
const rideRoutes = require('./routes/rides');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Per parsare il body delle richieste JSON
app.use(express.static(path.join(__dirname, '../public'))); // Serve file statici (Frontend)

// Rotte API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/rides', rideRoutes);

// Endpoint di test per inviare comandi al veicolo (Debug)
// Esempio body: { "command": "UNLOCK" }
app.post('/api/debug/vehicle/:id/command', (req, res) => {
  const { id } = req.params;
  const { command } = req.body; 
  sendCommand(id, command);
  res.json({ success: true, message: `Comando ${command} inviato al veicolo ${id}` });
});

// Rotta di base: serve la dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Avvio del server e connessione al Database
const startServer = async () => {
  try {
    // Inizializza il DB (crea tabelle se non esistono)
    await sequelize.sync({ alter: true });
    
    // Connetti al broker MQTT
    connectMQTT();
    
    app.listen(PORT, () => {
      console.log(`Server in ascolto sulla porta ${PORT}`);
    });
  } catch (error) {
    console.error('Impossibile avviare il server:', error);
  }
};

startServer();