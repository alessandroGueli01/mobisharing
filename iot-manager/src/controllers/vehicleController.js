const { Vehicle, Sensor, SensorData } = require('../models');

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            include: [{
                model: Sensor,
                include: [{
                    model: SensorData,
                    limit: 1,
                    order: [['timestamp', 'DESC']]
                }]
            }]
        });
        res.json(vehicles);
    } catch (error) {
        console.error('Errore nel recupero dei veicoli:', error);
        res.status(500).json({ message: 'Errore nel recupero dei veicoli' });
    }
};

exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id, {
            include: [{
                model: Sensor,
                include: [{
                    model: SensorData,
                    limit: 100,
                    order: [['timestamp', 'DESC']]
                }]
            }]
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Veicolo non trovato' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Errore nel recupero del veicolo:', error);
        res.status(500).json({ message: 'Errore nel recupero del veicolo' });
    }
};

exports.updateVehicleStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Veicolo non trovato' });
        }

        await vehicle.update({ status });
        res.json({ message: 'Stato del veicolo aggiornato con successo', vehicle });
    } catch (error) {
        console.error('Errore nell\'aggiornamento dello stato del veicolo:', error);
        res.status(500).json({ message: 'Errore nell\'aggiornamento dello stato del veicolo' });
    }
};

exports.getVehicleSensors = async (req, res) => {
    try {
        const sensors = await Sensor.findAll({
            where: { vehicle_id: req.params.id },
            include: [{
                model: SensorData,
                limit: 100,
                order: [['timestamp', 'DESC']]
            }]
        });

        res.json(sensors);
    } catch (error) {
        console.error('Errore nel recupero dei sensori del veicolo:', error);
        res.status(500).json({ message: 'Errore nel recupero dei sensori del veicolo' });
    }
};

exports.getVehicleSensorData = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { limit = 100, startDate, endDate } = req.query;

        const where = { sensor_id: sensorId };
        if (startDate && endDate) {
            where.timestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const sensorData = await SensorData.findAll({
            where,
            limit: parseInt(limit),
            order: [['timestamp', 'DESC']]
        });

        res.json(sensorData);
    } catch (error) {
        console.error('Errore nel recupero dei dati del sensore:', error);
        res.status(500).json({ message: 'Errore nel recupero dei dati del sensore' });
    }
}; 