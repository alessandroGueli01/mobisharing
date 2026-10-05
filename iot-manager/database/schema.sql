-- Creazione del database
CREATE DATABASE mobisharing;

-- Connessione al database
\c mobisharing;

-- Creazione tabella utenti
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione tabella mezzi
CREATE TABLE vehicles (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'bicycle' o 'scooter'
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'charging'
    battery_level INTEGER, -- NULL per biciclette non elettriche
    last_maintenance_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione tabella noleggi
CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    vehicle_id VARCHAR(50) REFERENCES vehicles(id),
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione tabella sensori
CREATE TABLE sensors (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(id),
    type VARCHAR(50) NOT NULL, -- 'battery', 'movement', 'maintenance'
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione tabella dati sensori
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(50) REFERENCES sensors(id),
    value DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserimento dati di esempio per i mezzi
INSERT INTO vehicles (id, type, status, battery_level) VALUES
    ('scooter_1', 'scooter', 'available', 85),
    ('scooter_2', 'scooter', 'charging', 20),
    ('bike_1', 'bicycle', 'available', NULL),
    ('bike_2', 'bicycle', 'maintenance', NULL);

-- Inserimento dati di esempio per i sensori
INSERT INTO sensors (id, vehicle_id, type) VALUES
    ('batt_scooter_1', 'scooter_1', 'battery'),
    ('mov_scooter_1', 'scooter_1', 'movement'),
    ('batt_scooter_2', 'scooter_2', 'battery'),
    ('mov_scooter_2', 'scooter_2', 'movement'),
    ('mov_bike_1', 'bike_1', 'movement'),
    ('mov_bike_2', 'bike_2', 'movement');

-- Creazione indici
CREATE INDEX idx_sensor_data_sensor_id ON sensor_data(sensor_id);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_sensors_vehicle_id ON sensors(vehicle_id);
CREATE INDEX idx_rentals_user_id ON rentals(user_id);
CREATE INDEX idx_rentals_vehicle_id ON rentals(vehicle_id);
CREATE INDEX idx_rentals_status ON rentals(status); 