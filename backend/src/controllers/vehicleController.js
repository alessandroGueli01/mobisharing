const Vehicle = require('../models/Vehicle');
const ParkingArea = require('../models/ParkingArea');

// Ottieni tutti i veicoli
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei veicoli', error: error.message });
    }
};

// Ottieni veicoli disponibili in un'area di parcheggio
exports.getAvailableVehicles = async (req, res) => {
    try {
        const { parkingAreaId } = req.params;
        const vehicles = await Vehicle.findAll({
            where: {
                status: 'available',
                parkingAreaId: parkingAreaId
            }
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei veicoli disponibili', error: error.message });
    }
};

// Aggiorna stato veicolo
exports.updateVehicleStatus = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const { status, batteryLevel, parkingAreaId } = req.body;

        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Veicolo non trovato' });
        }

        // Aggiorna i campi
        if (status) vehicle.status = status;
        if (batteryLevel) vehicle.batteryLevel = batteryLevel;
        if (parkingAreaId) vehicle.parkingAreaId = parkingAreaId;

        await vehicle.save();

        res.json({
            message: 'Stato veicolo aggiornato con successo',
            vehicle
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'aggiornamento dello stato', error: error.message });
    }
};

// Registra nuovo veicolo
exports.registerVehicle = async (req, res) => {
    try {
        const { code, type, parkingAreaId } = req.body;

        // Verifica se il codice esiste già
        const existingVehicle = await Vehicle.findOne({ where: { code } });
        if (existingVehicle) {
            return res.status(400).json({ message: 'Codice veicolo già registrato' });
        }

        // Verifica se l'area di parcheggio esiste
        if (parkingAreaId) {
            const parkingArea = await ParkingArea.findByPk(parkingAreaId);
            if (!parkingArea) {
                return res.status(400).json({ message: 'Area di parcheggio non trovata' });
            }
        }

        const vehicle = await Vehicle.create({
            code,
            type,
            parkingAreaId,
            status: 'available'
        });

        res.status(201).json({
            message: 'Veicolo registrato con successo',
            vehicle
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nella registrazione del veicolo', error: error.message });
    }
};

// Ottieni dettagli veicolo
exports.getVehicleDetails = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const vehicle = await Vehicle.findByPk(vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Veicolo non trovato' });
        }

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei dettagli del veicolo', error: error.message });
    }
}; 