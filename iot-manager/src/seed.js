const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });
const { sequelize, User, Vehicle, ParkingArea } = require('../../backend/src/models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // ATTENZIONE: Cancella e ricrea il DB
    console.log('Database sincronizzato.');

    // 1. Crea Aree di Parcheggio
    const parkingCentral = await ParkingArea.create({
      name: 'Stazione Centrale',
      latitude: 45.4642,
      longitude: 9.1900,
      capacity: 20
    });

    const parkingPark = await ParkingArea.create({
      name: 'Parco Sempione',
      latitude: 45.4720,
      longitude: 9.1770,
      capacity: 15
    });

    console.log('Parcheggi creati.');

    // 2. Crea Veicoli
    await Vehicle.create({
      code: 'SCOOTER-001',
      type: 'e_scooter',
      status: 'available',
      batteryLevel: 100,
      parkingAreaId: parkingCentral.id
    });

    await Vehicle.create({
      code: 'BIKE-001',
      type: 'muscle_bike',
      status: 'available',
      parkingAreaId: parkingPark.id
    });

    console.log('Veicoli creati.');

    // 3. Crea Utente di Test
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Mario Rossi',
      email: 'mario@test.com',
      password: hashedPassword,
      credit: 50.0, // Credito sufficiente per testare
      role: 'user',
      status: 'active'
    });

    // 4. Crea Utente Gestore
    await User.create({
      name: 'Luigi Gestore',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('Utente di test creato (email: mario@test.com, pass: password123).');
    process.exit(0);

  } catch (error) {
    console.error('Errore nel seeding:', error);
    process.exit(1);
  }
}

seed();