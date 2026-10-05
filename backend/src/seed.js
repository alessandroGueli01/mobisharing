const { sequelize, User, Vehicle, ParkingArea } = require('./models');
require('dotenv').config();

async function seed() {
    try {
        // Sincronizza il DB (crea le tabelle se non esistono)
        await sequelize.sync({ alter: true });

        console.log('Inizio popolamento database...');

        // 1. Crea un'area di parcheggio (necessaria per iniziare/finire le corse)
        const [parking, createdParking] = await ParkingArea.findOrCreate({
            where: { name: 'Stazione Centrale' },
            defaults: {
                latitude: 45.4858,
                longitude: 9.2042,
                capacity: 20
            }
        });
        console.log(createdParking ? 'Parcheggio creato.' : 'ℹ️  Parcheggio già esistente.');

        // 2. Crea il Veicolo ID 1 (quello del simulatore)
        // Forziamo l'ID a 1 per farlo corrispondere al default del simulatore IoT
        const [vehicle, createdVehicle] = await Vehicle.findOrCreate({
            where: { id: 1 }, 
            defaults: {
                code: 'MOBI-001',
                type: 'e_scooter',
                status: 'available',
                batteryLevel: 100,
                latitude: 45.4858,
                longitude: 9.2042,
                parkingAreaId: parking.id
            }
        });
        console.log(createdVehicle ? 'Veicolo ID 1 creato.' : 'ℹ️  Veicolo ID 1 già esistente.');

        // 3. Crea un Utente di test con credito
        let passwordHash = 'password123';
        try {
            // Proviamo a usare bcrypt se installato nel backend per hashare la password
            const bcrypt = require('bcryptjs');
            passwordHash = await bcrypt.hash('password123', 10);
        } catch (e) {
            console.log('bcryptjs non trovato, salvo password in chiaro (ok per dev).');
        }

        const [user, createdUser] = await User.findOrCreate({
            where: { email: 'test@mobisharing.com' },
            defaults: {
                name: 'Mario Rossi',
                password: passwordHash,
                credit: 50.00, // 50 euro di credito iniziale
                role: 'user',
                status: 'active'
            }
        });
        
        if (!createdUser) {
            // Se l'utente esiste già, ripristiniamo il credito
            user.credit = 50.00;
            await user.save();
            console.log('Credito utente ripristinato a 50.00€');
        } else {
            console.log('Utente test creato: test@mobisharing.com / password123');
        }

        console.log('\nDatabase pronto! Ora puoi fare il login e noleggiare il veicolo.');
        process.exit(0);
    } catch (error) {
        console.error('Errore:', error);
        process.exit(1);
    }
}

seed();