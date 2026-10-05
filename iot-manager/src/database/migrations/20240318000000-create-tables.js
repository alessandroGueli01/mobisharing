'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Creazione tabella users
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Creazione tabella vehicles
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      type: {
        type: Sequelize.ENUM('bicycle', 'scooter'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('available', 'in_use', 'maintenance', 'charging'),
        defaultValue: 'available'
      },
      battery_level: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      last_maintenance_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Creazione tabella rentals
    await queryInterface.createTable('rentals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      vehicle_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'vehicles',
          key: 'id'
        }
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Creazione tabella sensors
    await queryInterface.createTable('sensors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      vehicle_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'vehicles',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM('battery', 'movement', 'location'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'maintenance'),
        defaultValue: 'active'
      },
      last_reading: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Creazione tabella sensor_data
    await queryInterface.createTable('sensor_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sensor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sensors',
          key: 'id'
        }
      },
      value: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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