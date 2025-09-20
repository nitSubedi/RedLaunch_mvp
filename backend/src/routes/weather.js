import { supabase } from '../services/supabase_client.js';
import express from 'express';
const router = express.Router();

router.get('/get_weather', async (req, res) => {
    try {
        const { data: weather, error } = await supabase
            .from('weather')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ weather });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
