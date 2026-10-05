const Ride = require('../models/Ride');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const ParkingArea = require('../models/ParkingArea');
const { sendCommand } = require('../services/mqttService');

// Inizia una nuova corsa
exports.startRide = async (req, res) => {
    try {
        const { vehicleId, startParkingId } = req.body;
        const userId = req.user.id;

        // Verifica credito utente
        const user = await User.findByPk(userId);
        if (user.credit <= 0) {
            return res.status(400).json({ message: 'Credito insufficiente' });
        }

        // Verifica disponibilità veicolo
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle || vehicle.status !== 'available') {
            return res.status(400).json({ message: 'Veicolo non disponibile' });
        }

        // Verifica area di parcheggio
        const parkingArea = await ParkingArea.findByPk(startParkingId);
        if (!parkingArea) {
            return res.status(400).json({ message: 'Area di parcheggio non valida' });
        }

        // Crea nuova corsa
        const ride = await Ride.create({
            userId,
            vehicleId,
            startTime: new Date(),
            startParkingId,
            status: 'active'
        });

        // Aggiorna stato veicolo
        vehicle.status = 'in_use';
        await vehicle.save();

        // Invia comando di sblocco al veicolo fisico/simulato
        sendCommand(vehicleId, 'UNLOCK');

        res.status(201).json({
            message: 'Corsa iniziata con successo',
            ride
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'avvio della corsa', error: error.message });
    }
};

// Termina una corsa
exports.endRide = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { endParkingId, issues } = req.body;

        const ride = await Ride.findByPk(rideId, { include: Vehicle });
        if (!ride || ride.status !== 'active') {
            return res.status(400).json({ message: 'Corsa non valida' });
        }

        // Calcola durata e costo
        const endTime = new Date();
        const duration = (endTime - ride.startTime) / 1000 / 60; // durata in minuti
        const cost = calculateRideCost(duration, ride.Vehicle.type);

        // Verifica credito utente
        const user = await User.findByPk(ride.userId);
        
        // Aggiorna credito e gestisce sospensione
        user.credit -= cost;
        if (user.credit < 0) {
            user.status = 'suspended';
        }
        await user.save();

        // Aggiorna corsa
        ride.endTime = endTime;
        ride.endParkingId = endParkingId;
        ride.cost = cost;
        ride.status = 'completed';
        await ride.save();

        // Aggiorna stato veicolo
        const vehicle = ride.Vehicle;
        vehicle.status = issues ? 'maintenance' : 'available';
        vehicle.parkingAreaId = endParkingId;
        await vehicle.save();

        // Invia comando di blocco al veicolo
        sendCommand(vehicle.id, 'LOCK');

        res.json({
            message: 'Corsa terminata con successo',
            ride,
            cost,
            remainingCredit: user.credit,
            userStatus: user.status
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nella terminazione della corsa', error: error.message });
    }
};

// Ottieni corse dell'utente
exports.getUserRides = async (req, res) => {
    try {
        const userId = req.user.id;
        const rides = await Ride.findAll({
            where: { userId },
            include: [
                { model: Vehicle, attributes: ['type', 'code'] },
                { model: ParkingArea, as: 'startParking', attributes: ['name'] },
                { model: ParkingArea, as: 'endParking', attributes: ['name'] }
            ],
            order: [['startTime', 'DESC']]
        });

        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero delle corse', error: error.message });
    }
};

// Funzione helper per calcolare il costo della corsa
function calculateRideCost(duration, vehicleType) {
    // Tariffe: { fisso (primi 30min), al_minuto (dopo 30min) }
    const rates = {
        muscle_bike: { fixed: 0.50, perMinute: 0.05 },
        e_bike: { fixed: 1.00, perMinute: 0.15 },
        e_scooter: { fixed: 1.50, perMinute: 0.20 }
    };

    const rate = rates[vehicleType] || rates.muscle_bike;
    
    let totalCost = rate.fixed; // Costo fisso per la prima mezz'ora
    
    if (duration > 30) {
        const extraMinutes = Math.ceil(duration - 30);
        totalCost += extraMinutes * rate.perMinute;
    }

    return parseFloat(totalCost.toFixed(2));
} 