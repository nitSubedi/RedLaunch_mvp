import express from 'express';
import cors from 'cors';
//import { authenticateJWT } from './utils/middleware.js';
import inventoryRoutes from './routes/inventory.js';
import documentsRoutes from './routes/documents.js';
import sensorDataRoutes from './routes/sensor_data.js';
import weatherRoutes from './routes/weather.js';
import usageLogRoutes from './routes/usage_log.js';
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

//app.use('/inventory', authenticateJWT, inventoryRoutes);
//app.use('/documents', authenticateJWT, documentsRoutes);
//app.use('/sensor_data', authenticateJWT, sensorDataRoutes);
//app.use('/weather', authenticateJWT, weatherRoutes);
//app.use('/usage_log', authenticateJWT, usageLogRoutes);

app.use('/inventory', inventoryRoutes);
app.use('/documents', documentsRoutes);
app.use('/sensor_data', sensorDataRoutes);
app.use('/weather', weatherRoutes);
app.use('/usage_log', usageLogRoutes);
app.listen(process.env.PORT || 3001);   
console.log(`Server running on port ${process.env.PORT || 3001}`);