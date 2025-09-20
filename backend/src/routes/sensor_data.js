import { supabase } from '../services/supabase_client.js';
import express from 'express';
const router = express.Router();

router.get('/get_sensor_data', async (req, res) => {
    try {
        const { data: sensor_data, error } = await supabase
            .from('sensor_data')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ sensor_data });
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
