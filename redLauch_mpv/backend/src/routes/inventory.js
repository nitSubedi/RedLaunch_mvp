import * as inventoryController from '../controllers/inventoryController.js'
import express from 'express';
const router = express.Router();

router.get('/getinventory', inventoryController.getInventory);
router.post('/add_inventory', inventoryController.addInventory);
router.put('/restock_inventory/:id', inventoryController.restockInventory);
router.post('/log_usage/:id', inventoryController.logUsage);


export default router;
