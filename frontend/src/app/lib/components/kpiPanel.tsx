import React from "react";
import { InventoryItem } from "../../predictive_inv/types";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";
import "../../styles/kpiPanel.css";

interface KpiPanelProps {
  inventory: InventoryItem[];
}

const COLORS = {
  inStock: "#38bdf8",
  stockout: "#ff4d4f",
  optimal: "#52c41a",
  belowOptimal: "#faad14",
  supplier: "#8884d8",
};

const KpiPanel: React.FC<KpiPanelProps> = ({ inventory }) => {
  const totalStock = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);
  const avgStock = inventory.length ? Number((totalStock / inventory.length).toFixed(1)) : 0;
  const stockoutCount = inventory.filter(item => item.stock === 0).length;
  const optimalCoverage = inventory.length
    ? Number(((inventory.filter(item => item.stock >= item.optimal).length / inventory.length) * 100).toFixed(1))
    : 0;
  const supplierCount = new Set(inventory.map(item => item.supplier)).size;

  // --- Chart Data ---
  const stockPieData = [
    { name: "In Stock", value: inventory.length - stockoutCount, fill: COLORS.inStock },
    { name: "Stockouts", value: stockoutCount, fill: COLORS.stockout }
  ];

  const optimalPieData = [
    { name: "Optimal", value: Math.round((optimalCoverage / 100) * inventory.length), fill: COLORS.optimal },
    { name: "Below Optimal", value: inventory.length - Math.round((optimalCoverage / 100) * inventory.length), fill: COLORS.belowOptimal }
  ];

  // top 3 suppliers only
  const supplierMap: { [key: string]: number } = {};
  inventory.forEach(item => {
    if (!item.supplier) return;
    supplierMap[item.supplier] = (supplierMap[item.supplier] || 0) + 1;
  });
  const supplierBarData = Object.entries(supplierMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="kpiPanelGrid">
      {/* Stockouts */}
      <div className="kpiBox">
        <div className="kpiTitle">Stockouts</div>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie data={stockPieData} dataKey="value" outerRadius={45} label>
              {stockPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="kpiValue">{stockoutCount}</div>
      </div>

      {/* Optimal Coverage */}
      <div className="kpiBox">
        <div className="kpiTitle">Optimal Coverage</div>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie data={optimalPieData} dataKey="value" outerRadius={45} label>
              {optimalPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="kpiValue">{optimalCoverage}%</div>
      </div>

      {/* Avg Stock/Item */}
      <div className="kpiBox">
        <div className="kpiTitle">Avg. Stock/Item</div>
        <div className="kpiBigValue">{avgStock}</div>
      </div>

      {/* Suppliers */}
      <div className="kpiBox">
        <div className="kpiTitle">Top Suppliers</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart layout="vertical" data={supplierBarData} margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={70} />
            <Bar dataKey="value" fill={COLORS.supplier} />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
        <div className="kpiValue">{supplierCount} total</div>
      </div>
    </div>
  );
};

export default KpiPanel;
