'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from '../../styles/SensorChart.module.css';

type SensorChartProps = {
  data: { timestamp: string; sensor_value: number }[];
  show: boolean;
  onClose: () => void;
  machineID?: string;
  sensorID?: string;
};

export default function SensorChartModal({
  data,
  show,
  onClose,
  machineID,
  sensorID,
}: SensorChartProps) {
  if (!show) return null;

  const latest = data[0];
  const min = Math.min(...data.map(d => d.sensor_value));
  const max = Math.max(...data.map(d => d.sensor_value));
  const avg = (data.reduce((sum, d) => sum + d.sensor_value, 0) / (data.length || 1)).toFixed(2);

  return (
    <div className={styles["pm-modal-backdrop"]}>
      <div className={styles["pm-modal"]}>
        <button className={styles["pm-modal-close"]} onClick={onClose}>&times;</button>
        <h2>History for {machineID}</h2>
        <div className={styles["pm-infoRow"]}>
          <div>
            <strong>Sensor:</strong> {sensorID}
          </div>
          <div>
            <strong>Latest Value:</strong> {latest?.sensor_value}
          </div>
          <div>
            <strong>Last Updated:</strong> {latest ? new Date(latest.timestamp).toLocaleString() : ''}
          </div>
          <div>
            <strong>Min:</strong> {min}
          </div>
          <div>
            <strong>Max:</strong> {max}
          </div>
          <div>
            <strong>Avg:</strong> {avg}
          </div>
        </div>
        <div className={styles.chart}>
          {(!data || data.length === 0) ? (
            <div>No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid stroke="#232834" />
                <XAxis dataKey="timestamp" tickFormatter={t => new Date(t).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={t => new Date(t).toLocaleString()} />
                <Line type="monotone" dataKey="sensor_value" stroke="#00eaff" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}