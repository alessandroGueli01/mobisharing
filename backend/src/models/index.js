const sequelize = require('../config/database');
const User = require('./User');
const Vehicle = require('./Vehicle');
const ParkingArea = require('./ParkingArea');
const Ride = require('./Ride');

// Relazioni

// Un utente può fare molte corse
User.hasMany(Ride, { foreignKey: 'userId' });
Ride.belongsTo(User, { foreignKey: 'userId' });

// Un veicolo può avere molte corse
Vehicle.hasMany(Ride, { foreignKey: 'vehicleId' });
Ride.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// Un veicolo si trova in un parcheggio (se non è in uso)
ParkingArea.hasMany(Vehicle, { foreignKey: 'parkingAreaId' });
Vehicle.belongsTo(ParkingArea, { foreignKey: 'parkingAreaId' });

// Una corsa ha un parcheggio di partenza e uno di arrivo
ParkingArea.hasMany(Ride, { as: 'StartParking', foreignKey: 'startParkingId' });
Ride.belongsTo(ParkingArea, { as: 'StartParking', foreignKey: 'startParkingId' });

ParkingArea.hasMany(Ride, { as: 'EndParking', foreignKey: 'endParkingId' });
Ride.belongsTo(ParkingArea, { as: 'EndParking', foreignKey: 'endParkingId' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  ParkingArea,
  Ride
};