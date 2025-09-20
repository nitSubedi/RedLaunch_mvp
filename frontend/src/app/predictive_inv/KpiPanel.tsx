import React from "react";
import { InventoryItem } from "./types";
import './KpiPanel.css'

interface KpiPanelProps {
  inventory: InventoryItem[];
}

const KpiPanel: React.FC<KpiPanelProps> = ({ inventory }) => {
  const totalStock = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);
  const avgStock = inventory.length ? (totalStock / inventory.length).toFixed(1) : 0;
  const stockoutCount = inventory.filter(item => item.stock === 0).length;
  const optimalCoverage = inventory.length
    ? ((inventory.filter(item => item.stock >= item.optimal).length / inventory.length) * 100).toFixed(1)
    : 0;
  const supplierCount = new Set(inventory.map(item => item.supplier)).size;

  return (
    <div className="kpiPanelGrid">
      <div className={`kpiCard kpiTotal`}>
        <span className="kpiIcon" role="img" aria-label="boxes">📦</span>
        <div className="kpiText">
          <div className="kpiValue">{totalStock}</div>
          <div className="kpiLabel">Total Stock</div>
        </div>
      </div>

      <div className={`kpiCard kpiAvg`}>
        <span className="kpiIcon" role="img" aria-label="average">📊</span>
        <div className="kpiText">
          <div className="kpiValue">{avgStock}</div>
          <div className="kpiLabel">Avg. Stock/Item</div>
        </div>
      </div>

      <div className={`kpiCard kpiStockout`}>
        <span className="kpiIcon" role="img" aria-label="alert">🚨</span>
        <div className="kpiText">
          <div className="kpiValue">{stockoutCount}</div>
          <div className="kpiLabel">Stockouts</div>
        </div>
      </div>

      <div className={`kpiCard kpiOptimal`}>
        <span className="kpiIcon" role="img" aria-label="check">✅</span>
        <div className="kpiText">
          <div className="kpiValue">{optimalCoverage}%</div>
          <div className="kpiLabel">Optimal Coverage</div>
        </div>
      </div>

      <div className={`kpiCard kpiSuppliers`}>
        <span className="kpiIcon" role="img" aria-label="truck">🚚</span>
        <div className="kpiText">
          <div className="kpiValue">{supplierCount}</div>
          <div className="kpiLabel">Suppliers</div>
        </div>
      </div>
    </div>
  );
};

export default KpiPanel;
