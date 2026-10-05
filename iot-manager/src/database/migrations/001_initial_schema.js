const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Creazione tabella users
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM('user', 'admin'),
                defaultValue: 'user'
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Creazione tabella vehicles
        await queryInterface.createTable('vehicles', {
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
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Creazione tabella rentals
        await queryInterface.createTable('rentals', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            vehicle_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'vehicles',
                    key: 'id'
                }
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('active', 'completed', 'cancelled'),
                defaultValue: 'active'
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Creazione tabella sensors
        await queryInterface.createTable('sensors', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Creazione tabella sensor_data
        await queryInterface.createTable('sensor_data', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            sensor_id: {
                type: DataTypes.INTEGER,
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
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Creazione indici
        await queryInterface.addIndex('sensor_data', ['sensor_id', 'timestamp']);
        await queryInterface.addIndex('rentals', ['user_id']);
        await queryInterface.addIndex('rentals', ['vehicle_id']);
        await queryInterface.addIndex('sensors', ['vehicle_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('sensor_data');
        await queryInterface.dropTable('sensors');
        await queryInterface.dropTable('rentals');
        await queryInterface.dropTable('vehicles');
        await queryInterface.dropTable('users');
    }
}; 