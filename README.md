# Mobisharing

Applicazione per la gestione di biciclette e monopattini condivisi. Il backend Express espone le API e serve la dashboard; Vite usa la stessa pagina durante lo sviluppo e per la build, senza duplicare il frontend.

## Requisiti

- Node.js 18 o superiore
- PostgreSQL e un database chiamato `mobisharing`
- Un broker MQTT raggiungibile

## Avvio

1. Crea il database, se non esiste, usando il tuo account PostgreSQL:

   ```bash
   createdb mobisharing
   ```

2. Copia il modello e inserisci in `backend/.env` le credenziali valide per la tua installazione PostgreSQL:

   ```env
   cp backend/.env.example backend/.env
   ```

   Poi modifica `DB_USER`, `DB_PASSWORD` e `JWT_SECRET` nel file appena creato.

3. Installa le dipendenze e inizializza lo schema e i dati demo:

   ```bash
   npm --prefix backend install
   npm --prefix frontend install
   npm --prefix iot-manager install
   npm --prefix backend run seed
   ```

   Il seed sincronizza lo schema: usalo solo su un database di sviluppo.

4. Avvia backend e frontend in due terminali:

   ```bash
   npm --prefix backend run dev
   npm --prefix frontend run dev
   ```

5. Apri <http://localhost:5173>. Il frontend inoltra le chiamate `/api` al backend su porta 3000. In alternativa, la dashboard è servita direttamente da <http://localhost:3000>.

Credenziali demo: `test@mobisharing.com` / `password123`.

## Build frontend

```bash
npm --prefix frontend run build
npm --prefix frontend run preview
```

## Simulatore IoT

Avvia il simulatore con `npm --prefix iot-manager start`. Il broker predefinito è `mqtt://test.mosquitto.org`; imposta `MQTT_BROKER_URL` per usarne uno diverso.

## Licenza

MIT