const express = require('express');
const app = express();

// Middleware per il parsing del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per servire file statici
app.use(express.static('public'));

// Middleware per la gestione degli errori
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Errore interno del server',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app; 