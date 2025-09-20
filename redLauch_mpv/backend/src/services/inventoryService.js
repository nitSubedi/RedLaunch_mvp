import { supabase } from './supabase_client.js';

export async function fetchInventory() {
  return supabase.from('inventory').select('*');
}

export async function addInventoryItem(item) {
  return supabase.from('inventory').insert([item]).select();
}

export async function restockInventoryItem(id, { used_by, quantity, notes = '' }) {
  // 1. Insert negative quantity in usage_log
  const usageLogResult = await supabase
    .from('usage_log')
    .insert([{ item_id: id, used_by, quantity: -Math.abs(quantity), notes }])
    .select();

  // 2. Fetch current stock_level
  const { data, error } = await supabase
    .from('inventory')
    .select('stock_level')
    .eq('id', id)
    .single();

  if (error) return { usageLogResult, updateError: error };

  // 3. Add to inventory stock_level
  const newStock = data.stock_level + Math.abs(quantity);

  const { error: updateError } = await supabase
    .from('inventory')
    .update({ stock_level: newStock })
    .eq('id', id);

  return { usageLogResult, updateError };
}

export async function logUsage(id, { used_by, quantity, notes = '' }) {
  // 1. Insert positive quantity in usage_log
  const usageLogResult = await supabase
    .from('usage_log')
    .insert([{ item_id: id, used_by, quantity: Math.abs(quantity), notes }])
    .select();

  // 2. Fetch current stock_level
  const { data, error } = await supabase
    .from('inventory')
    .select('stock_level')
    .eq('id', id)
    .single();

  if (error) return { usageLogResult, updateError: error };

  // 3. Subtract from inventory stock_level
  const newStock = data.stock_level - Math.abs(quantity);

  const { error: updateError } = await supabase
    .from('inventory')
    .update({ stock_level: newStock })
    .eq('id', id);

  return { usageLogResult, updateError };
}