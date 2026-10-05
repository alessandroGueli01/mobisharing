const mqtt = require('mqtt');
require('dotenv').config();

// Configurazione Veicolo Simulato
const VEHICLE_ID = process.env.VEHICLE_ID || '1'; // ID deve corrispondere a un ID nel DB
// Usiamo un broker pubblico per evitare di dover installare Mosquitto in locale
const BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org';

console.log(`Avvio simulatore veicolo ID: ${VEHICLE_ID}`);

const client = mqtt.connect(BROKER_URL);

// Stato interno del veicolo
let vehicleState = {
    battery: 100,
    status: 'available', // available, in_use, maintenance
    led: 'green', // green (libero), red (occupato/guasto)
    latitude: 45.4642, // Coordinate iniziali (es. Milano Duomo)
    longitude: 9.1900
};

client.on('connect', () => {
    console.log('Veicolo connesso al broker MQTT');
    
    // Sottoscrizione ai comandi specifici per questo veicolo
    client.subscribe(`mobisharing/vehicle/${VEHICLE_ID}/command`);
    
    // Avvia loop di telemetria
    setInterval(sendTelemetry, 5000);
});

client.on('error', (err) => {
    console.error('Errore connessione MQTT:', err);
});

client.on('message', (topic, message) => {
    const command = message.toString();
    
    console.log(`📥 Comando ricevuto: ${command}`);

    handleCommand(command);
    // Invia subito lo stato aggiornato
    sendTelemetry();
});

function handleCommand(cmd) {
    switch(cmd) {
        case 'UNLOCK':
            vehicleState.status = 'in_use';
            vehicleState.led = 'red'; // O spento, a seconda delle specifiche
            console.log('🔓 Veicolo SBLOCCATO');
            break;
        case 'LOCK':
            vehicleState.status = 'available';
            vehicleState.led = 'green';
            console.log('🔒 Veicolo BLOCCATO');
            break;
        default:
            console.log('Comando sconosciuto');
    }
}

function sendTelemetry() {
    // Simula consumo batteria se in uso
    if (vehicleState.status === 'in_use' && vehicleState.battery > 0) {
        vehicleState.battery -= 1;
        
        // Simula movimento GPS (random walk)
        vehicleState.latitude += (Math.random() - 0.5) * 0.001;
        vehicleState.longitude += (Math.random() - 0.5) * 0.001;
    }

    const topic = `mobisharing/vehicle/${VEHICLE_ID}/status`;
    const payload = JSON.stringify(vehicleState);
    
    client.publish(topic, payload);
    // console.log(`📤 Telemetria inviata: ${payload}`);
}

// Gestione input da tastiera per simulare eventi
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

console.log(`
--- COMANDI SIMULATORE ---
[b] Batteria Scarica (10%)
[m] Guasto / Manutenzione
[r] Ripara e Ricarica (100%)
[q] Esci
--------------------------
`);

process.stdin.on('keypress', (str, key) => {
    if ((key.ctrl && key.name === 'c') || key.name === 'q') {
        console.log('Chiusura simulatore...');
        client.end(false, () => process.exit());
        return;
    }

    if (key.name === 'b') {
        vehicleState.battery = 10;
        vehicleState.status = 'low_battery';
        vehicleState.led = 'red';
        console.log('⚠️  SIMULAZIONE: Batteria Scarica!');
    } else if (key.name === 'm') {
        vehicleState.status = 'maintenance';
        vehicleState.led = 'red';
        console.log('🔧 SIMULAZIONE: Guasto segnalato!');
    } else if (key.name === 'r') {
        vehicleState.battery = 100;
        vehicleState.status = 'available';
        vehicleState.led = 'green';
        console.log('✅ SIMULAZIONE: Veicolo Riparato e Ricaricato.');
    }
    sendTelemetry(); // Invia subito il nuovo stato
});