import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime

# Configurazione MQTT
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "mobisharing/sensors"

# Configurazione mezzi e sensori
VEHICLES = {
    'scooter_1': {
        'type': 'scooter',
        'sensors': {
            'battery': {'min': 0, 'max': 100, 'current': 85},
            'movement': {'value': False}
        }
    },
    'scooter_2': {
        'type': 'scooter',
        'sensors': {
            'battery': {'min': 0, 'max': 100, 'current': 20},
            'movement': {'value': False}
        }
    },
    'bike_1': {
        'type': 'bicycle',
        'sensors': {
            'movement': {'value': False}
        }
    },
    'bike_2': {
        'type': 'bicycle',
        'sensors': {
            'movement': {'value': False}
        }
    }
}

def on_connect(client, userdata, flags, rc):
    print(f"Connesso al broker MQTT con codice: {rc}")

def simulate_battery_sensor(vehicle_id, sensor_data):
    """Simula il sensore della batteria"""
    # Simula una leggera variazione della batteria
    current = sensor_data['current']
    change = random.uniform(-2, 1)  # La batteria può diminuire più velocemente di quanto aumenti
    new_value = max(0, min(100, current + change))
    sensor_data['current'] = new_value
    return new_value

def simulate_movement_sensor(vehicle_id, sensor_data):
    """Simula il sensore di movimento"""
    # 10% di probabilità che il mezzo si muova
    if random.random() < 0.1:
        sensor_data['value'] = True
        time.sleep(2)  # Simula il movimento
        sensor_data['value'] = False
    return sensor_data['value']

def main():
    # Crea il client MQTT
    client = mqtt.Client()
    client.on_connect = on_connect

    try:
        # Connetti al broker
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()

        print("Simulatore sensori Mobisharing avviato...")
        
        while True:
            for vehicle_id, vehicle_data in VEHICLES.items():
                # Simula i dati per ogni sensore del veicolo
                for sensor_type, sensor_data in vehicle_data['sensors'].items():
                    if sensor_type == 'battery':
                        value = simulate_battery_sensor(vehicle_id, sensor_data)
                    else:  # movement
                        value = simulate_movement_sensor(vehicle_id, sensor_data)

                    # Prepara i dati da inviare
                    data = {
                        "vehicleId": vehicle_id,
                        "sensorType": sensor_type,
                        "value": value,
                        "timestamp": datetime.now().isoformat()
                    }

                    # Pubblica i dati
                    topic = f"{MQTT_TOPIC}/{vehicle_id}/{sensor_type}"
                    client.publish(topic, json.dumps(data))
                    print(f"Dati pubblicati per {vehicle_id} - {sensor_type}: {data}")
            
            # Attendi 5 secondi prima del prossimo ciclo
            time.sleep(5)

    except KeyboardInterrupt:
        print("\nSimulatore arrestato")
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main() 