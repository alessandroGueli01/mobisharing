module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('Vehicle', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM('bicycle', 'scooter'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('available', 'in_use', 'maintenance', 'charging'),
            defaultValue: 'available'
        },
        battery_level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 100
            }
        },
        last_maintenance_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'vehicles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Vehicle;
}; 