import { supabase } from './supabase_client.js';

// Fetch all machines
export async function fetchMachines() {
  return supabase.from('machines').select('*');
}

// Fetch data for a specific machine by machineID
export async function fetchMachineByID(machineID) {
  return supabase
    .from('machines')
    .select('*')
    .eq('machineid', machineID);
}

// Insert a new machine record
export async function addMachine({ machineID, timestamp, sensor_value, sensorID }) {
  return supabase
    .from('machines')
    .insert([{ machineID, timestamp, sensor_value, sensorID }])
    .select();
}