const path = require('node:path');
const { defineConfig } = require('vite');

const backendUrl = 'http://localhost:3000';

module.exports = defineConfig({
  root: path.resolve(__dirname, '../backend/public'),
  server: {
    port: 5173,
    proxy: {
      '/api': backendUrl
    }
  },
  preview: {
    proxy: {
      '/api': backendUrl
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
});