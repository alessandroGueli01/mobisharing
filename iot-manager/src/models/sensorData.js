module.exports = (sequelize, DataTypes) => {
    const SensorData = sequelize.define('SensorData', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sensor_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'sensors',
                key: 'id'
            }
        },
        value: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'sensor_data',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['sensor_id', 'timestamp']
            }
        ]
    });
    return SensorData;
}; 