import { supabase } from '../services/supabase_client.js';
import express from 'express';
const router = express.Router();

router.get('/get_usage_log', async (req, res) => {
    try {
        const { data: usage_log, error } = await supabase
            .from('usage_log')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ usage_log });
    } catch (error) {
        console.error('Error fetching usage log data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add_usage_log', async (req, res) => {
    try {
        const {
            item_id,
            used_by,
            quantity,
            usage_time,
            notes
        } = req.body;

        const { data, error } = await supabase
            .from('usage_log')
            .insert([{
                item_id,
                used_by,
                quantity,
                usage_time,
                notes
            }])
            .select();

        if (error) {
            throw error;
        }

         const { data: inventoryData, error: inventoryError } = await supabase
            .from('inventory')
            .select('stock_level')
            .eq('id', item_id)
            .single();

        if (inventoryError) {
            throw inventoryError;
        }

        const newStockLevel = (inventoryData.stock_level || 0) + quantity;

        const { error: updateError } = await supabase
            .from('inventory')
            .update({ stock_level: newStockLevel })
            .eq('id', item_id);

        if (updateError) {
            throw updateError;
        }

        res.status(201).json({ message: 'Usage log entry added successfully', entry: data[0] });
    } catch (error) {
        console.error('Error adding usage log entry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
