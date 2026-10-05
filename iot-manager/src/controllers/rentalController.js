const { Rental, Vehicle, User } = require('../models');

exports.createRental = async (req, res) => {
    try {
        const { vehicle_id } = req.body;
        const user_id = req.user.id;

        // Verifica se il veicolo è disponibile
        const vehicle = await Vehicle.findByPk(vehicle_id);
        if (!vehicle || vehicle.status !== 'available') {
            return res.status(400).json({ message: 'Veicolo non disponibile' });
        }

        // Verifica se l'utente ha già un noleggio attivo
        const activeRental = await Rental.findOne({
            where: {
                user_id,
                status: 'active'
            }
        });

        if (activeRental) {
            return res.status(400).json({ message: 'Hai già un noleggio attivo' });
        }

        // Crea il noleggio
        const rental = await Rental.create({
            user_id,
            vehicle_id,
            start_time: new Date(),
            status: 'active'
        });

        // Aggiorna lo stato del veicolo
        await vehicle.update({ status: 'in_use' });

        res.status(201).json({
            message: 'Noleggio creato con successo',
            rental
        });
    } catch (error) {
        console.error('Errore nella creazione del noleggio:', error);
        res.status(500).json({ message: 'Errore nella creazione del noleggio' });
    }
};

exports.endRental = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const user_id = req.user.id;

        const rental = await Rental.findOne({
            where: {
                id: rental_id,
                user_id,
                status: 'active'
            }
        });

        if (!rental) {
            return res.status(404).json({ message: 'Noleggio non trovato' });
        }

        // Aggiorna il noleggio
        await rental.update({
            end_time: new Date(),
            status: 'completed'
        });

        // Aggiorna lo stato del veicolo
        await Vehicle.update(
            { status: 'available' },
            { where: { id: rental.vehicle_id } }
        );

        res.json({
            message: 'Noleggio terminato con successo',
            rental
        });
    } catch (error) {
        console.error('Errore nella terminazione del noleggio:', error);
        res.status(500).json({ message: 'Errore nella terminazione del noleggio' });
    }
};

exports.getUserRentals = async (req, res) => {
    try {
        const user_id = req.user.id;
        const rentals = await Rental.findAll({
            where: { user_id },
            include: [
                { model: Vehicle },
                { model: User, attributes: ['id', 'username', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(rentals);
    } catch (error) {
        console.error('Errore nel recupero dei noleggi:', error);
        res.status(500).json({ message: 'Errore nel recupero dei noleggi' });
    }
};

exports.getRentalById = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const user_id = req.user.id;

        const rental = await Rental.findOne({
            where: { id: rental_id, user_id },
            include: [
                { model: Vehicle },
                { model: User, attributes: ['id', 'username', 'email'] }
            ]
        });

        if (!rental) {
            return res.status(404).json({ message: 'Noleggio non trovato' });
        }

        res.json(rental);
    } catch (error) {
        console.error('Errore nel recupero del noleggio:', error);
        res.status(500).json({ message: 'Errore nel recupero del noleggio' });
    }
}; 