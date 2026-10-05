const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./user')(sequelize, DataTypes);
const Vehicle = require('./vehicle')(sequelize, DataTypes);
const Rental = require('./rental')(sequelize, DataTypes);
const Sensor = require('./sensor')(sequelize, DataTypes);
const SensorData = require('./sensorData')(sequelize, DataTypes);

// Definizione delle relazioni
User.hasMany(Rental, { foreignKey: 'user_id' });
Rental.belongsTo(User, { foreignKey: 'user_id' });

Vehicle.hasMany(Rental, { foreignKey: 'vehicle_id' });
Rental.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

Vehicle.hasMany(Sensor, { foreignKey: 'vehicle_id' });
Sensor.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

Sensor.hasMany(SensorData, { foreignKey: 'sensor_id' });
SensorData.belongsTo(Sensor, { foreignKey: 'sensor_id' });

module.exports = {
    sequelize,
    User,
    Vehicle,
    Rental,
    Sensor,
    SensorData
}; 