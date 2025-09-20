import * as inventoryService from '../services/inventoryService.js';

export async function getInventory(req, res) {
  try {
    const { data: inventory, error } = await inventoryService.fetchInventory();
    if (error) throw error;
    res.json({ inventory });
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addInventory(req, res) {
  try {
    const item = req.body;
    const { data, error } = await inventoryService.addInventoryItem(item);
    if (error) throw error;
    res.status(201).json({ message: 'Inventory item added successfully', item: data[0] });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function restockInventory(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { usageLogResult, updateError } = await inventoryService.restockInventoryItem(id, updates);
    if (updateError) throw updateError;
    res.json({ message: 'Inventory item restocked successfully', usageLog: usageLogResult.data });
  } catch (error) {
    console.error('Error restocking inventory item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function logUsage(req, res) {
  try {
    const { id } = req.params;
    const usage = req.body;
    const { usageLogResult, updateError } = await inventoryService.logUsage(id, usage);
    if (updateError) throw updateError;
    res.json({ message: 'Usage logged successfully', usageLog: usageLogResult.data });
  } catch (error) {
    console.error('Error logging usage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}