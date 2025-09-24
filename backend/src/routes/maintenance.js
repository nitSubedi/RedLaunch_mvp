import express from 'express';
const router = express.Router();
import * as maintenanceController from '../controllers/predictive_maintenance_controller.js'

router.get('/machines', maintenanceController.getAllMachines);
router.get('/machine/:machineID', maintenanceController.getMachineByID);
router.post('/add_machine', maintenanceController.createMachine);

export default router;