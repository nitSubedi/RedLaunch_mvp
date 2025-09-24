import styles from '../../styles/MachineCard.module.css';

type MachineCardProps = {
  machineID: string;
  sensorID: string;
  latestValue: number;
  timestamp: string;
};

export default function MachineCard({ machineID, sensorID, latestValue, timestamp }: MachineCardProps) {
  return (
    <div className={styles.card}>
      <h3>{machineID}</h3>
      <p>Sensor: {sensorID}</p>
      <p>Latest Value: {latestValue}</p>
      <p className={styles.timestamp}>{new Date(timestamp).toLocaleString()}</p>
    </div>
  );
}