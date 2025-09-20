import React from 'react';
import { TableViewProps, InventoryItem } from './types';
import './tableView.css'

function TableView({ inventory, onItemClick, onRestock, onAddUsage }: TableViewProps) {
  if (!inventory || inventory.length === 0) {
    return (
      <div className="empty-state">
        <p>No items to display</p>
      </div>
    );
  }

  const getItemStatus = (item: InventoryItem) => {
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
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Stock</th>
              <th>Location</th>
              <th>Supplier</th>
              <th>Lead Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr 
                key={item.id}
                onClick={() => onItemClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{color: 'var(--text-primary)', fontWeight: '600'}}>{item.category}</td>
                <td>{item.stock} / {item.optimal}</td>
                <td>{item.location}</td>
                <td>{item.supplier}</td>
                <td>{item.leadTime} days</td>
                <td>
                  <span className={`status-badge status-${getItemStatus(item)}`}>
                    {getStatusText(item)}
                  </span>
                </td>
                <button className="btn btn-secondary" onClick={e => { e.stopPropagation(); onRestock(item); }}>
                Restock
              </button>
              <button className="btn btn-secondary" onClick={e => { e.stopPropagation(); onAddUsage(item); }}>
                Add Usage Log
              </button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableView;