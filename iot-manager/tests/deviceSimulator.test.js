const { expect } = require('chai');
const DeviceSimulator = require('../src/deviceSimulator');

describe('DeviceSimulator', () => {
  let simulator;

  beforeEach(() => {
    simulator = new DeviceSimulator();
  });

  describe('inizializzazione', () => {
    it('dovrebbe creare un nuovo simulatore', () => {
      expect(simulator).to.be.an.instanceOf(DeviceSimulator);
    });
  });

  describe('aggiunta dispositivo', () => {
    it('dovrebbe aggiungere un nuovo dispositivo', () => {
      const device = {
        id: 'test-device-1',
        type: 'sensor',
        status: 'active'
      };
      
      simulator.addDevice(device);
      expect(simulator.getDevice(device.id)).to.deep.equal(device);
    });
  });

  describe('rimozione dispositivo', () => {
    it('dovrebbe rimuovere un dispositivo esistente', () => {
      const device = {
        id: 'test-device-2',
        type: 'sensor',
        status: 'active'
      };
      
      simulator.addDevice(device);
      simulator.removeDevice(device.id);
      expect(simulator.getDevice(device.id)).to.be.undefined;
    });
  });
}); 