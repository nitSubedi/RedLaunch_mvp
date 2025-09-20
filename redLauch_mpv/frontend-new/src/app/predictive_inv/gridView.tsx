import React from 'react';
import { GridViewProps, InventoryItem } from './types';
import './gridView.css'

function GridView({ inventory, onItemClick, onRestock, onAddUsage  }: GridViewProps) {
  if (!inventory || inventory.length === 0) {
    return (
      <div className="empty-state">
        <p>No items to display</p>
      </div>
    );
  }

  const getItemStatus = (item: InventoryItem ) => {
    if (item.stock < item.optimal * 0.7) return 'critical';
    if (item.stock < item.optimal) return 'warning';
    return 'normal';
  };

  const getStatusText = (item: InventoryItem) => {
    if (item.stock < item.optimal * 0.7) return 'Critical';
    if (item.stock < item.optimal) return 'Low Stock';
    return 'Normal';
  };

  return (
    <div>
      <div className="grid-container">
        {inventory.map(item => (
           <div 
            key={item.id} 
            className={`grid-item ${getItemStatus(item)}`}
            onClick={() => onItemClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <h4>{item.category}</h4>
            <div className="grid-item-content">
              <div className="grid-item-row">
                <span className="grid-item-label">Stock</span>
                <span className="grid-item-value">{item.stock} / {item.optimal}</span>
              </div>
              <div className="grid-item-row">
                <span className="grid-item-label">Location</span>
                <span className="grid-item-value">{item.location}</span>
              </div>
              <div className="grid-item-row">
                <span className="grid-item-label">Supplier</span>
                <span className="grid-item-value">{item.supplier}</span>
              </div>
              <div className="grid-item-row">
                <span className="grid-item-label">Lead Time</span>
                <span className="grid-item-value">{item.leadTime} days</span>
              </div>

              <div className="grid-item-row">
                <span className="grid-item-label">Status</span>
                <span className={`status-badge status-${getItemStatus(item)}`}>
                  {getStatusText(item)}
                </span>
              </div>
              <button className="btn btn-secondary" onClick={e => { e.stopPropagation(); onRestock(item); }}>
            Restock
          </button>
          <button className="btn btn-secondary" onClick={e => { e.stopPropagation(); onAddUsage(item); }}>
            Add Usage Log
          </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridView;