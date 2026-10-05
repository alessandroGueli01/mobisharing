const express = require('express');
const router = express.Router();
const { Ride, Vehicle, User } = require('../models');
const { sendCommand } = require('../services/mqttService');
const authMiddleware = require('../middleware/auth');

// Inizia una corsa
router.post('/start', authMiddleware, async (req, res) => {
    try {
        const { vehicleId, startParkingId } = req.body;
        const userId = req.user.id; // ID utente dal token JWT

        const vehicle = await Vehicle.findByPk(vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Veicolo non trovato' });
        }
        
        if (vehicle.status !== 'available') {
            return res.status(400).json({ message: 'Veicolo non disponibile' });
        }

        // Verifica credito utente (minimo 1€ per sblocco)
        const user = await User.findByPk(userId);
        if (user.credit < 1.0) {
            return res.status(402).json({ message: 'Credito insufficiente. Ricarica il portafoglio.' });
        }

        // 1. Crea la corsa nel DB
        const ride = await Ride.create({
            userId,
            vehicleId,
            startParkingId,
            startTime: new Date(),
            status: 'active'
        });

        // 2. Aggiorna lo stato del veicolo nel DB
        await vehicle.update({ status: 'in_use' });

        // 3. Invia comando UNLOCK al veicolo fisico via MQTT
        sendCommand(vehicleId, 'UNLOCK');

        res.json({ success: true, ride });
    } catch (error) {
        console.error('Errore start ride:', error);
        res.status(500).json({ message: 'Errore durante l\'avvio della corsa' });
    }
});

// Termina una corsa
router.post('/:id/end', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { endParkingId } = req.body;

        const ride = await Ride.findByPk(id);
        
        if (!ride || ride.status !== 'active') {
            return res.status(404).json({ message: 'Corsa non trovata o già terminata' });
        }

        // Verifica che l'utente che termina la corsa sia lo stesso che l'ha iniziata
        if (ride.userId !== req.user.id) {
            return res.status(403).json({ message: 'Non autorizzato a terminare questa corsa' });
        }

        // Calcolo costo (Esempio: 1€ sblocco + 0.15€ al minuto)
        const endTime = new Date();
        const durationMinutes = (endTime - new Date(ride.startTime)) / 60000;
        const cost = 1.0 + (durationMinutes * 0.15);

        // 1. Chiudi la corsa
        await ride.update({
            endTime,
            endParkingId,
            cost,
            status: 'completed'
        });

        // 2. Blocca il veicolo e rendilo disponibile
        const vehicle = await Vehicle.findByPk(ride.vehicleId);
        await vehicle.update({ status: 'available' });
        sendCommand(vehicle.id, 'LOCK');

        // 3. Aggiorna il credito utente
        const user = await User.findByPk(ride.userId);
        if (user) {
            user.credit -= cost;
            await user.save();
        }

        res.json({ success: true, cost: cost.toFixed(2), remainingCredit: user.credit.toFixed(2) });
    } catch (error) {
        console.error('Errore end ride:', error);
        res.status(500).json({ message: 'Errore durante la chiusura della corsa' });
    }
});

module.exports = router;