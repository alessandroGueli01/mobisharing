# Mobisharing - IoT Vehicle Simulator

Questo modulo simula un veicolo connesso (monopattino/bici) per la piattaforma Mobisharing.
Comunica via MQTT inviando telemetria (GPS, batteria, stato) e ricevendo comandi (LOCK, UNLOCK).

## Installazione

```bash
npm install
```

## Configurazione

Crea un file `.env` (opzionale) o usa le variabili d'ambiente:

- `VEHICLE_ID`: ID del veicolo (default: 1)
- `MQTT_BROKER_URL`: URL del broker MQTT (default: mqtt://localhost:1883)

## Avvio

Per avviare il veicolo predefinito (ID 1):
```bash
node src/index.js
```

Per simulare un secondo veicolo:
```bash
VEHICLE_ID=2 node src/index.js
```

## Comandi Manuali (Tastiera)

Una volta avviato, puoi usare questi tasti nel terminale per simulare eventi:
- `b`: Batteria scarica (Low Battery)
- `m`: Guasto (Maintenance)
- `r`: Riparazione e Ricarica (Available)
- `q`: Chiudi simulatore