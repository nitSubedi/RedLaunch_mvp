import {
  fetchMachines,
  fetchMachineByID,
  addMachine,
} from '../services/predictive_maintenance_service.js';

// Get all machine records
export async function getAllMachines(req, res) {
  const { data, error } = await fetchMachines();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// Get records for a specific machine
export async function getMachineByID(req, res) {
  const { machineID } = req.params;
  const { data, error } = await fetchMachineByID(machineID);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// Add a new machine record
export async function createMachine(req, res) {
  const { machineID, timestamp, sensor_value, sensorID } = req.body;
  const { data, error } = await addMachine({ machineID, timestamp, sensor_value, sensorID });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}