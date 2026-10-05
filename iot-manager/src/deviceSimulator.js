const mqtt = require('mqtt');
const config = require('./config.json');
const fs = require('node:fs');

const client = mqtt.connect(config.brokerUrl);

client.on('connect', () => {
    console.log('Connesso al broker MQTT');
    // Simula lo stato del dispositivo e pubblica i messaggi
    setInterval(() => {
        const data = JSON.parse(fs.readFileSync('./devices.json'));
        data.forEach(device => {
            const status = Math.random() < 0.1 ? 'maintenance' : 'available';
            client.publish(config.topics.deviceStatus + '/' + device.id, JSON.stringify({ id: device.id, status }));
        });
    }, 5000);
});
