'use client';
import { useEffect, useState } from 'react';
import MachineCard from '../lib/components/MachineCard';
import SensorChartModal from '../lib/components/SensorChart';
import { fetchMachines, fetchMachineByID } from '../lib/apiClient';
import './page.css';

type MachineData = {
  machineID: string;
  sensorID: string;
  sensor_value: number;
  timestamp: string;
};
type MachineApiResponse = {
  machineid: string;
  sensorid: string;
  sensor_value: number;
  timestamp: string;
};

export default function PredictiveMaintenancePage() {
  const [machines, setMachines] = useState<MachineData[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [machineHistory, setMachineHistory] = useState<MachineData[]>([]);
  const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMachines()
      .then(data => {
        // Map backend fields to frontend fields
        setMachines(
          data.map((item: MachineApiResponse) => ({
            machineID: item.machineid,
            sensorID: item.sensorid,
            sensor_value: item.sensor_value,
            timestamp: item.timestamp,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (machineID: string) => {
    setSelectedMachine(machineID);
    setLoading(true);
    fetchMachineByID(machineID)
      .then(data => {
        setMachineHistory(
          data.map((item: MachineApiResponse) => ({
            machineID: item.machineid,
            sensorID: item.sensorid,
            sensor_value: item.sensor_value,
            timestamp: item.timestamp,
          }))
        );
        setShowModal(true);
      })
      .finally(() => setLoading(false));
  };

   const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMachine(null);
    setMachineHistory([]);
  };

  // Get latest reading per machine
  const latestByMachine = Object.values(
    machines.reduce((acc, cur) => {
      if (!acc[cur.machineID] || new Date(cur.timestamp) > new Date(acc[cur.machineID].timestamp)) {
        acc[cur.machineID] = cur;
      }
      return acc;
    }, {} as Record<string, MachineData>)
  );

  return (
    <div className="container">
      <h1>Predictive Maintenance Dashboard</h1>
      {loading && <div className="pm-loading">Loading...</div>}
      <div className="machineGrid">
        {latestByMachine.map(machine => (
          <div key={machine.machineID + machine.sensorID} onClick={() => handleSelect(machine.machineID)}>
            <MachineCard
              machineID={machine.machineID}
              sensorID={machine.sensorID}
              latestValue={machine.sensor_value}
              timestamp={machine.timestamp}
            />
          </div>
        ))}
      </div>
       <SensorChartModal
        data={machineHistory}
        show={showModal}
        onClose={handleCloseModal}
        machineID={selectedMachine ?? undefined}
        sensorID={machineHistory[0]?.sensorID}
      />
      </div>

  );
}