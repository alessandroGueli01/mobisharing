const { Sequelize } = require('sequelize');
const { Client } = require('pg');
require('dotenv').config();

// Configurazione per la creazione del database
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

// Funzione per creare il database se non esiste
async function createDatabase() {
    const client = new Client({
        ...dbConfig,
        database: 'postgres' // Connessione al database di default
    });

    try {
        await client.connect();
        
        // Verifica se il database esiste
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (result.rowCount === 0) {
            // Crea il database se non esiste
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database ${process.env.DB_NAME} creato con successo`);
        } else {
            console.log(`Database ${process.env.DB_NAME} già esistente`);
        }
    } catch (error) {
        console.error('Errore durante la creazione del database:', error);
        throw error;
    } finally {
        await client.end();
    }
}

// Configurazione Sequelize per il database
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Funzione per sincronizzare i modelli con il database
async function syncDatabase() {
    try {
        // Sincronizza tutti i modelli con il database
        await sequelize.sync({ alter: true });
        console.log('Modelli sincronizzati con il database');
    } catch (error) {
        console.error('Errore durante la sincronizzazione dei modelli:', error);
        throw error;
    }
}

// Funzione principale per inizializzare il database
async function initializeDatabase() {
    try {
        // Crea il database se non esiste
        await createDatabase();
        
        // Sincronizza i modelli
        await syncDatabase();
        
        console.log('Inizializzazione database completata con successo');
    } catch (error) {
        console.error('Errore durante l\'inizializzazione del database:', error);
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    initializeDatabase
}; 