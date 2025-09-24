// types.ts
export type InventoryItem = {
  id: string;
  name?: string; 
  category: string;
  stock: number;
  optimal: number;
  location: string;
  color: string;
  supplier: string;
  leadTime: number;
  usageTrend: number[];
};

export type GridViewProps = {
  inventory: InventoryItem[];
  onItemClick: (item: InventoryItem) => void;
  onRestock: (item: InventoryItem) => void;
  onAddUsage: (item: InventoryItem) => void;

};

export type TableViewProps = {
  inventory: InventoryItem[];
  onItemClick: (item: InventoryItem) => void;
  onRestock: (item: InventoryItem) => void;
  onAddUsage: (item: InventoryItem) => void;
};

export type RawInventoryItem = {
  id?: string | number;
  item_name?: string;
  name?: string;
  category?: string;
  stock_level?: number;
  stock?: number;
  location?: string;
  optimal?: number;
  color?: string;
  last_updated?: string;
  supplier?: string;
  lead_time?: number;
};