const bcrypt = require('bcrypt');
const { User, Vehicle, ParkingArea } = require('../models');
const sequelize = require('../config/database');

async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database sincronizzato');

        // Crea utenti di test
        const adminPassword = await bcrypt.hash('admin123', 10);
        const premiumPassword = await bcrypt.hash('premium123', 10);
        const basicPassword = await bcrypt.hash('basic123', 10);

        await User.bulkCreate([
            {
                username: 'admin',
                password: adminPassword,
                userType: 'admin',
                credit: 0,
                status: 'active'
            },
            {
                username: 'premium',
                password: premiumPassword,
                userType: 'user',
                credit: 50,
                status: 'active'
            },
            {
                username: 'basic',
                password: basicPassword,
                userType: 'user',
                credit: 10,
                status: 'active'
            }
        ]);
        console.log('Utenti di test creati con successo');

        // Crea aree di parcheggio
        const areas = await ParkingArea.bulkCreate([
            { name: 'Centro', location: 'Piazza Centrale' },
            { name: 'Stazione', location: 'Via Stazione 1' },
            { name: 'Università', location: 'Via Sapienza 42' }
        ]);
        console.log('Aree di parcheggio create con successo');

        // Crea mezzi
        const vehicles = [];
        for (let i = 1; i <= 5; i++) {
            vehicles.push({
                code: `BM${i}`,
                type: 'muscolare',
                status: 'available',
                batteryLevel: null,
                parkingAreaId: areas[0].id
            });
        }
        for (let i = 1; i <= 5; i++) {
            vehicles.push({
                code: `BE${i}`,
                type: 'elettrica',
                status: 'available',
                batteryLevel: 90,
                parkingAreaId: areas[1].id
            });
        }
        for (let i = 1; i <= 5; i++) {
            vehicles.push({
                code: `ME${i}`,
                type: 'monopattino',
                status: 'available',
                batteryLevel: 85,
                parkingAreaId: areas[2].id
            });
        }

        await Vehicle.bulkCreate(vehicles);
        console.log('Mezzi di test creati con successo');

        process.exit(0);
    } catch (error) {
        console.error('Errore durante l\'inizializzazione del database:', error);
        process.exit(1);
    }
}

initializeDatabase();
