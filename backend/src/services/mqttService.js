const mqtt = require('mqtt');
const { Vehicle } = require('../models'); // Assicurati che il modello Vehicle esista

let client;

const connectMQTT = () => {
    // Usiamo un broker pubblico per evitare di dover installare Mosquitto in locale
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org';
    
    // Connessione al broker
    client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
        console.log('Backend connesso al broker MQTT');
        
        // Sottoscrizione a tutti gli aggiornamenti di stato dei veicoli
        // Il simbolo '+' è una wildcard che sta per qualsiasi ID veicolo
        client.subscribe('mobisharing/vehicle/+/status');
    });

    client.on('message', async (topic, message) => {
        try {
            // Topic atteso: mobisharing/vehicle/{id}/status
            const parts = topic.split('/');
            const vehicleId = parts[2];
            const payload = JSON.parse(message.toString());

            // Aggiorna il database se il modello Vehicle è caricato
            if (Vehicle) {
                await Vehicle.update({
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    batteryLevel: payload.battery,
                    status: payload.status
                }, {
                    where: { id: vehicleId }
                });
                // Log opzionale per debug (puoi commentarlo se troppo verboso)
                console.log(`DB Aggiornato: Veicolo ${vehicleId} -> Bat: ${payload.battery}% GPS: [${payload.latitude}, ${payload.longitude}]`);
            }
        } catch (error) {
            console.error('Errore elaborazione messaggio MQTT:', error);
        }
    });
};

const sendCommand = (vehicleId, command) => {
    if (client && client.connected) {
        client.publish(`mobisharing/vehicle/${vehicleId}/command`, command);
        console.log(`Comando inviato a Veicolo ${vehicleId}: ${command}`);
    } else {
        console.error('Impossibile inviare comando: Client MQTT non connesso');
    }
};

module.exports = { connectMQTT, sendCommand };