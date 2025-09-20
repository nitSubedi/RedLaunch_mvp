'use client';
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import KpiPanel from './predictive_inv/KpiPanel'
import {  InventoryItem } from '../app/predictive_inv/types';
import { fetchInventory } from "../app/lib/apiClient";

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
      // Match the transformation logic from predictive_inv/page.tsx
      const items: InventoryItem[] = (data.inventory || []).map((item: { id: string; item_name?: string; name?: string; category?: string; stock_level?: number; stock?: number; location?: string; last_updated?: string; optimal?: number; color?: string; lead_time?: number; supplier?: string }) => ({
        id: item.id?.toString(),
        category: item.item_name || item.name || item.category,
        stock: item.stock_level ?? item.stock,
        location: item.location || 'Unknown',
        optimal: item.optimal ?? 100,
        color: item.color || '#38bdf8',
        lastUpdated: item.last_updated || new Date().toISOString(),
        supplier: item.supplier,
        leadTime: item.lead_time ?? 7,
        // usageTrend is not needed for the dashboard pie chart
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

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}> EE0 </header>
      <main className={styles.pageMain}>
        <div className={styles.cardContainer}>
          <a href="/predictive_inv" className={styles.dashboardCard}>
  <span className={styles.cardIcon}>📊</span>
  Predictive Inventory
  <span className={styles.cardSubtext}>View predictions & analytics</span>

  <div className={styles.cardChart}>
    <ResponsiveContainer width="100%" height={120}>
      <PieChart>
        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={45}
          label
        >
          {statusData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={
                entry.name === "Critical"
                  ? COLORS.critical
                  : entry.name === "Warning"
                  ? COLORS.warning
                  : COLORS.normal
              }
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
 
</a>
  

          <a href="" className={styles.dashboardCard}>
            <span className={styles.cardIcon}>🛠️</span>
            Predictive Maintenance Engine
            <span className={styles.cardSubtext}>Monitor & Forecast Maintenance</span>
          </a>
           <div className={styles.kpiWrapper}>
          <KpiPanel inventory={inventory} />
        </div>
          
        </div>
       
      
      </main>
      
         
        
      
      <footer className={styles.pageFooter}>
        &copy; {new Date().getFullYear()} RedLaunch. All rights reserved.
      </footer>
    </div>
  );
}