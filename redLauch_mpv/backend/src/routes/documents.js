import { supabase } from '../services/supabase_client.js';
import express from 'express';
const router = express.Router();

router.get('/get_documents', async (req, res) => {
    try {
        const { data: documents, error } = await supabase
            .from('documents')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ documents });
    } catch (error) {
        console.error('Error fetching documents data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
