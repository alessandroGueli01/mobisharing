const ParkingArea = require('../models/ParkingArea');
const Vehicle = require('../models/Vehicle');

// Ottieni tutte le aree di parcheggio
exports.getAllParkingAreas = async (req, res) => {
    try {
        const parkingAreas = await ParkingArea.findAll({
            include: [{
                model: Vehicle,
                attributes: ['id', 'type', 'status']
            }]
        });
        res.json(parkingAreas);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero delle aree di parcheggio', error: error.message });
    }
};

// Crea nuova area di parcheggio
exports.createParkingArea = async (req, res) => {
    try {
        const { name, location, capacity } = req.body;

        const parkingArea = await ParkingArea.create({
            name,
            location,
            capacity,
            currentOccupancy: 0,
            status: 'active'
        });

        res.status(201).json({
            message: 'Area di parcheggio creata con successo',
            parkingArea
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nella creazione dell\'area di parcheggio', error: error.message });
    }
};

// Aggiorno area di parcheggio
exports.updateParkingArea = async (req, res) => {
    try {
        const { parkingAreaId } = req.params;
        const { name, location, capacity, status } = req.body;

        const parkingArea = await ParkingArea.findByPk(parkingAreaId);
        if (!parkingArea) {
            return res.status(404).json({ message: 'Area di parcheggio non trovata' });
        }

        // Aggiorno i campi
        if (name) parkingArea.name = name;
        if (location) parkingArea.location = location;
        if (capacity) parkingArea.capacity = capacity;
        if (status) parkingArea.status = status;

        await parkingArea.save();

        res.json({
            message: 'Area di parcheggio aggiornata con successo',
            parkingArea
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'area di parcheggio', error: error.message });
    }
};

// Ottiengo statistiche area di parcheggio
exports.getParkingStats = async (req, res) => {
    try {
        const { parkingAreaId } = req.params;

        const parkingArea = await ParkingArea.findByPk(parkingAreaId, {
            include: [{
                model: Vehicle,
                attributes: ['type', 'status']
            }]
        });

        if (!parkingArea) {
            return res.status(404).json({ message: 'Area di parcheggio non trovata' });
        }

        // Calcola statistiche
        const stats = {
            totalVehicles: parkingArea.Vehicles.length,
            availableVehicles: parkingArea.Vehicles.filter(v => v.status === 'available').length,
            occupancyRate: (parkingArea.currentOccupancy / parkingArea.capacity) * 100,
            vehicleTypes: {
                bike: parkingArea.Vehicles.filter(v => v.type === 'bike').length,
                ebike: parkingArea.Vehicles.filter(v => v.type === 'ebike').length,
                scooter: parkingArea.Vehicles.filter(v => v.type === 'scooter').length
            }
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero delle statistiche', error: error.message });
    }
}; 