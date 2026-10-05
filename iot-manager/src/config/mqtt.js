const mqtt = require('mqtt');
require('dotenv').config();

const mqttConfig = {
    broker: process.env.MQTT_BROKER || 'mqtt://localhost',
    port: process.env.MQTT_PORT || 1883,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clientId: `mobisharing-${Math.random().toString(16).slice(3)}`,
    clean: true
};

const client = mqtt.connect(mqttConfig.broker, {
    port: mqttConfig.port,
    username: mqttConfig.username,
    password: mqttConfig.password,
    clientId: mqttConfig.clientId,
    clean: mqttConfig.clean
});

client.on('connect', () => {
    console.log('Connesso al broker MQTT');
    // Sottoscrizione ai topic per i veicoli
    client.subscribe('mobisharing/vehicles/+/status');
    client.subscribe('mobisharing/vehicles/+/battery');
    client.subscribe('mobisharing/vehicles/+/movement');
});

client.on('error', (error) => {
    console.error('Errore MQTT:', error);
});

client.on('close', () => {
    console.log('Connessione MQTT chiusa');
});

module.exports = client; 