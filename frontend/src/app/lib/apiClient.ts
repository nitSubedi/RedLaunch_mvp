export async function fetchInventory() {
  const res = await fetch('http://localhost:3001/inventory/getinventory');
  return res.json();
}



export async function restockItem(itemId: number, stock_level: number) {
  const res = await fetch(`http://localhost:3001/inventory/restock_inventory/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({itemId, stock_level }),
  });
  return res.json();
}

export async function logUsage(item_id: number, used_by: number, quantity: number, notes: string) {
  const usage_time = new Date().toISOString(); // current timestamp in ISO format
  const res = await fetch('http://localhost:3001/usage_log/add_usage_log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item_id, used_by, quantity,  usage_time, notes }),
  });
  return res.json();
}

export async function fetchUsageTrend(itemId: string, modelType: string = "arima") {
  const res = await fetch(`http://localhost:8000/predict_usage_trend?item_id=${itemId}&periods=7&model_type=${modelType}`);
  return res.json();
}

export async function fetchShortagePrediction(itemId: string, periods: number = 7, modelType: string = "arima") {
  const res = await fetch(`http://localhost:8000/predict_shortages?item_id=${itemId}&periods=${periods}&model_type=${modelType}`);
  return res.json();
}


export async function add_Inventory(item_name: string, stock_level: number, location: string, last_updated?: string, optimal?: number, color?: string, lead_time?: number, supplier?: string) {
  const res = await fetch('http://localhost:3001/inventory/add_inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item_name, stock_level, location, last_updated, optimal, color, lead_time, supplier }),
  });
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function fetchMachines() {
  const res = await fetch('http://localhost:3001/maintenance/machines');
  if (!res.ok) throw new Error('Failed to fetch machines');
  return res.json();
}

export async function fetchMachineByID(machineID: string) {
  const res = await fetch(`http://localhost:3001/maintenance/machine/${machineID}`);
  if (!res.ok) throw new Error('Failed to fetch machine history');
  return res.json();
}

