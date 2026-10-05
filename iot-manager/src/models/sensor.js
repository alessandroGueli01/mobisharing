module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define('Sensor', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        vehicle_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'vehicles',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM('battery', 'movement', 'location'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
            defaultValue: 'active'
        },
        last_reading: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'sensors',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Sensor;
}; 