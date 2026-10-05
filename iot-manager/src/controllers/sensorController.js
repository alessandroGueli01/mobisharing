const { Sensor, SensorData, Vehicle, Op } = require('../models');

exports.getAllSensors = async (req, res) => {
    try {
        const sensors = await Sensor.findAll({
            include: [{
                model: Vehicle,
                attributes: ['id', 'type', 'status']
            }]
        });
        res.json(sensors);
    } catch (error) {
        console.error('Errore nel recupero dei sensori:', error);
        res.status(500).json({ message: 'Errore nel recupero dei sensori' });
    }
};

exports.getSensorById = async (req, res) => {
    try {
        const sensor = await Sensor.findByPk(req.params.id, {
            include: [{
                model: Vehicle,
                attributes: ['id', 'type', 'status']
            }]
        });

        if (!sensor) {
            return res.status(404).json({ message: 'Sensore non trovato' });
        }

        res.json(sensor);
    } catch (error) {
        console.error('Errore nel recupero del sensore:', error);
        res.status(500).json({ message: 'Errore nel recupero del sensore' });
    }
};

exports.getSensorData = async (req, res) => {
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

exports.updateSensorStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const sensor = await Sensor.findByPk(req.params.id);

        if (!sensor) {
            return res.status(404).json({ message: 'Sensore non trovato' });
        }

        await sensor.update({ status });
        res.json({ message: 'Stato del sensore aggiornato con successo', sensor });
    } catch (error) {
        console.error('Errore nell\'aggiornamento dello stato del sensore:', error);
        res.status(500).json({ message: 'Errore nell\'aggiornamento dello stato del sensore' });
    }
}; 