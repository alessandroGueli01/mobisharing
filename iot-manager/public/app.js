// Configurazione del grafico
let sensorChart = null;

// Funzione per inizializzare la dashboard
async function initDashboard() {
    try {
        const response = await fetch('/api/sensors');
        const sensors = await response.json();
        displaySensors(sensors);
    } catch (error) {
        console.error('Errore nel caricamento dei sensori:', error);
    }
}

// Funzione per visualizzare i sensori
function displaySensors(sensors) {
    const container = document.getElementById('sensors-container');
    container.innerHTML = '';

    sensors.forEach(sensor => {
        const sensorCard = document.createElement('div');
        sensorCard.className = 'sensor-card';
        sensorCard.innerHTML = `
            <h3>${sensor.name}</h3>
            <p>ID: ${sensor.id}</p>
            <p>Stato: ${sensor.status}</p>
        `;
        sensorCard.onclick = () => selectSensor(sensor);
        container.appendChild(sensorCard);
    });
}

// Funzione per selezionare un sensore
async function selectSensor(sensor) {
    // Rimuovi la classe active da tutte le card
    document.querySelectorAll('.sensor-card').forEach(card => {
        card.classList.remove('active');
    });

    // Aggiungi la classe active alla card selezionata
    event.currentTarget.classList.add('active');

    // Aggiorna il titolo
    document.getElementById('selected-sensor-name').textContent = sensor.name;

    try {
        const response = await fetch(`/api/sensor-data/${sensor.id}`);
        const data = await response.json();
        updateChart(data);
        updateSensorInfo(data[0]);
    } catch (error) {
        console.error('Errore nel caricamento dei dati del sensore:', error);
    }
}

// Funzione per aggiornare il grafico
function updateChart(data) {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    if (sensorChart) {
        sensorChart.destroy();
    }

    sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
            datasets: [{
                label: 'Valore',
                data: data.map(d => d.value),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Funzione per aggiornare le informazioni del sensore
function updateSensorInfo(latestData) {
    const container = document.getElementById('sensor-data');
    container.innerHTML = `
        <div class="data-item">
            <h4>Ultimo Valore</h4>
            <p>${latestData.value}</p>
        </div>
        <div class="data-item">
            <h4>Ultimo Aggiornamento</h4>
            <p>${new Date(latestData.timestamp).toLocaleString()}</p>
        </div>
    `;
}

// Inizializza la dashboard quando la pagina è caricata
document.addEventListener('DOMContentLoaded', initDashboard); 