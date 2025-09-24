'use client';
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import KpiPanel from './lib/components/kpiPanel';
import { InventoryItem,RawInventoryItem } from './predictive_inv/types';
import { fetchInventory } from "./lib/apiClient";

const COLORS = {
  critical: "#ff4d4f",
  warning: "#faad14",
  normal: "#52c41a",
};

const getItemStatus = (item: InventoryItem) => {
  if (item.stock < item.optimal * 0.7) return "critical";
  if (item.stock < item.optimal) return "warning";
  return "normal";
};

export default function Home() {
  const [statusData, setStatusData] = useState([
    { name: "Critical", value: 0 },
    { name: "Warning", value: 0 },
    { name: "Normal", value: 0 },
  ]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetchInventory().then((data) => {
      const items: InventoryItem[] = (data.inventory || []).map((item: RawInventoryItem) => ({
        id: item.id?.toString(),
        category: item.item_name || item.name || item.category,
        stock: item.stock_level ?? item.stock,
        location: item.location || 'Unknown',
        optimal: item.optimal ?? 100,
        color: item.color || '#38bdf8',
        lastUpdated: item.last_updated || new Date().toISOString(),
        supplier: item.supplier,
        leadTime: item.lead_time ?? 7,
      }));
      setInventory(items);

      const counts = { critical: 0, warning: 0, normal: 0 };
      items.forEach((item) => {
        const status = getItemStatus(item);
        counts[status]++;
      });
      setStatusData([
        { name: "Critical", value: counts.critical },
        { name: "Warning", value: counts.warning },
        { name: "Normal", value: counts.normal },
      ]);
    });
  }, []);

  // Example: Top 5 inventory items by stock for bar chart
  const topItems = [...inventory]
    .sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0))
    .slice(0, 5)
    .map(item => ({
      name: item.category,
      Stock: item.stock,
      Optimal: item.optimal,
    }));

  return (
 <>
        <header className={styles.pageHeader}>Dashboard Overview</header>
        <main className={styles.pageMain}>
          <section className={styles.kpiOverviewSection}>
            <KpiPanel inventory={inventory} />
          </section>
        
        </main>
        <footer className={styles.pageFooter}>
          &copy; {new Date().getFullYear()} RedLaunch. All rights reserved.
        </footer>
     </>
  );
}